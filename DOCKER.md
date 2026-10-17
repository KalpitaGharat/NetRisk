# NETRISK — Docker Containerization & Deployment Guide

> **Intelligent Risk-Aware SDLC Decision Platform for AI-Based Cybersecurity Systems**  
> *DevSecOps Containerization Specification & Operational Runbook*

---

## 1. Container Architecture Overview

NETRISK uses a multi-stage Docker build packaging both the **React 18 + Vite** frontend (built with Node.js) and the **FastAPI** analytical backend (running Python 3.11):

```
┌────────────────────────────────────────────────────────────────────────┐
│                              HOST WORKSTATION                          │
│                                                                        │
│   HTTP Request -> http://localhost:8001                                │
│                         │                                              │
│                         ▼                                              │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              DOCKER CONTAINER: netrisk-app (1.0)               │   │
│   │                                                                │   │
│   │  • Base: python:3.11-slim (Debian Linux)                       │   │
│   │  • Stage 1: node:20-alpine (Compiles React 18 + Tailwind SPA)  │   │
│   │  • Stage 2: python:3.11-slim (FastAPI Server + Uvicorn)        │   │
│   │  • Port Mapping: 8001:8000/tcp                                 │   │
│   │                                                                │   │
│   │  ┌──────────────────────────────────────────────────────────┐  │   │
│   │  │ Compiled React SPA (served from /app/frontend/dist)      │  │   │
│   │  │   ├── Executive Dashboard & SOC Grid Layout              │  │   │
│   │  │   ├── Security Authentication Portal (LoginPage.jsx)     │  │   │
│   │  │   └── 6-Factor Sensitivity Simulator & Radar Analytics  │  │   │
│   │  └──────────────────────────┬───────────────────────────────┘  │   │
│   │                             │ REST API (/api/*)                │   │
│   │                             ▼                                  │   │
│   │  ┌──────────────────────────────────────────────────────────┐  │   │
│   │  │ FastAPI Core Backend & Mathematical Engines              │  │   │
│   │  │   ├── 7-Factor Risk Engine & 5-Model SDLC Engine         │  │   │
│   │  │   └── SQLite Database Layer (SQLAlchemy 2.0 ORM)         │  │   │
│   │  └──────────────────────────┬───────────────────────────────┘  │   │
│   │                             │                                  │   │
│   │                             ▼                                  │   │
│   │               SQLite Mount: /app/database/netrisk.db           │   │
│   └─────────────────────────────┬──────────────────────────────────┘   │
│                                 │ Bind Mount                           │
│                                 ▼                                      │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │      HOST DIRECTORY: C:\PROJECTS\NetRisk\database              │   │
│   │      (Persists all assessments directly on host file system)   │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Prerequisites

Ensure your host workstation satisfies:
- **Docker Desktop** (version 24.0+ or later; verified on Docker 29.5.3)
- **Docker Compose** (v2.20+ or later; verified on Compose v5.1.4)
- **Windows PowerShell 5.1+ / PowerShell 7+** or Unix Bash
- Available TCP Port **8001** on host interface `127.0.0.1`

Verify prerequisites:
```powershell
docker --version
docker compose version
```

---

## 3. How the Dockerfile Works

The [`Dockerfile`](file:///c:/PROJECTS/NetRisk/Dockerfile) uses an industry-standard 2-stage build:

```dockerfile
# Stage 1: Build React 18 Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend (FastAPI + SQLite + React SPA)
FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

1. **`Stage 1 (Node.js 20)`**: Installs npm dependencies and compiles React code into optimized production assets via Vite (`npm run build`).
2. **`Stage 2 (Python 3.11-slim)`**: Installs Python dependencies and copies the built frontend distribution (`dist/`) into FastAPI's static serving path.
3. **Zero Node.js Runtime Overhead**: The final container has no Node.js runtime footprint—FastAPI serves both the compiled static assets and JSON API endpoints.
4. **`CMD uvicorn`**: Runs FastAPI on port 8000 (mapped to port 8001 on the host).

---

## 4. How `.dockerignore` Works

The [`.dockerignore`](file:///c:/PROJECTS/NetRisk/.dockerignore) file guarantees clean, minimal, and secure image builds by excluding:
- **Secrets & Credentials**: `.env`, `.env.*` (never embedded in build layers).
- **Virtual Environments & Bytecode**: `.venv/`, `venv/`, `__pycache__/`, `*.pyc`.
- **Node & Frontend Caches**: `node_modules/`, `frontend/node_modules/`, `.vite/`.
- **Test Artifacts**: `.pytest_cache/`, `.coverage`, `htmlcov/`.
- **Transient Databases**: Backup databases (`*backup*.db`, `*.db-journal`, `*.db-wal`) while preserving `database/netrisk.db` for seed initialization.

---

## 5. How to Build the Image

To build the Docker image manually using standard Docker CLI:

```powershell
# Navigate to project repository root
cd C:\PROJECTS\NetRisk

# Build image with tag 'netrisk:1.0'
docker build -t netrisk:1.0 .
```

To build without using cache (for clean CI validation):
```powershell
docker build --no-cache -t netrisk:1.0 .
```

---

## 6. How to Run the Container

### Option A: Standard `docker run` (with Named Volume)

```powershell
docker run -d `
  --name netrisk-app `
  --restart unless-stopped `
  -p 8501:8501 `
  -v netrisk-persistent-data:/app/data `
  -e NETRISK_DATABASE_URL="sqlite:////app/data/netrisk.db" `
  -e APP_ENV="production" `
  netrisk:1.0
```

### Option B: `docker run` with Windows Host Directory Bind Mount

If you prefer mounting a local folder on your Windows host:
```powershell
docker run -d `
  --name netrisk-app `
  --restart unless-stopped `
  -p 8501:8501 `
  -v C:\PROJECTS\NetRisk\database:/app/database `
  netrisk:1.0
```

---

## 7. How to Use Docker Compose (Recommended)

[`compose.yaml`](file:///c:/PROJECTS/NetRisk/compose.yaml) provides declarative lifecycle management.

### Start the Service:
```powershell
docker compose up -d --build
```

### Check Container Status & Health:
```powershell
docker compose ps
```

### Stream Application Logs:
```powershell
docker compose logs -f
```

### Stop the Service:
```powershell
docker compose down
```

> [!IMPORTANT]
> **Data Safety Rule**: Running `docker compose down` stops and removes the container, but **preserves** the named volume `netrisk-persistent-data`.  
> **DO NOT** run `docker compose down -v` unless you explicitly want to erase the persistent SQLite volume and wipe assessment history.

---

## 8. How to Configure Environment Variables

NETRISK reads runtime configuration from environment variables or an optional `.env` file mounted at runtime.

| Variable Name | Default Value | Description |
|---|---|---|
| `NETRISK_DATABASE_URL` | `sqlite:////app/data/netrisk.db` | Path to persistent SQLite database inside container |
| `APP_ENV` | `production` | Runtime mode (`production` or `development`) |
| `DEBUG` | `false` | Verbose debug output toggle |
| `STREAMLIT_SERVER_PORT` | `8501` | Listening port for web traffic |
| `STREAMLIT_SERVER_ADDRESS`| `0.0.0.0` | Network binding interface |
| `JIRA_BASE_URL` | `https://sakec-team-bcq481n1.atlassian.net` | Jira Cloud workspace URL |
| `JIRA_EMAIL` | `""` | Service account email for Jira integration |
| `JIRA_API_TOKEN` | `""` | API token for Jira integration (leave blank for offline demo mode) |
| `JIRA_PROJECT_KEY` | `NRASS` | Jira project issue key |

### Supplying Secrets at Runtime:
Pass environment variables using `--env-file` or individual `-e` flags:
```powershell
docker compose --env-file .env up -d
```
*Note: In the absence of live Jira credentials, NETRISK automatically defaults to resilient offline mode with zero crashes.*

---

## 9. SQLite Persistence Architecture

1. **Mount Target**: The container declares `VOLUME ["/app/data"]`.
2. **Database Engine**: SQLAlchemy accesses `sqlite:////app/data/netrisk.db`.
3. **First-Run Seeding**: If the persistent volume is brand new, `docker-entrypoint.sh` initializes `/app/data/netrisk.db` from `/app/database/netrisk.db`.
4. **Lifecycle Independence**: Stopping, removing, rebuilding, or upgrading the Docker container never affects data stored in `netrisk-persistent-data`.

---

## 10. Verification & Persistence Testing Runbook

To empirically prove that SQLite persistence functions across container destruction:

### Step 1: Launch Container via Compose
```powershell
docker compose up -d --build
docker compose ps
```

### Step 2: Access UI & Record Initial Count
Open your browser at **`http://localhost:8501`**. Navigate to **Assessment History** and check the total number of assessments (e.g., 5 baseline assessments).

### Step 3: Create a Test Assessment
1. Navigate to **New Assessment**.
2. Project Name: `Container Persistence Verification Test`.
3. Select sliders (e.g., Security Criticality = 90).
4. Click **Calculate Risk & Generate Recommendations**.
5. Confirm recommendation displays and record appears in history.

### Step 4: Destroy the Container (Preserving Volume)
```powershell
# Stop and remove the container
docker compose down

# Verify container is removed
docker ps -a --filter "name=netrisk-app"
```

### Step 5: Recreate the Container from Scratch
```powershell
# Recreate the container
docker compose up -d

# Verify health
docker compose ps
```

### Step 6: Verify Record Persistence
Re-open **`http://localhost:8501`** and view **Assessment History**. Confirm `Container Persistence Verification Test` is intact and fully queryable.

---

## 11. Troubleshooting & Diagnostics

### View Real-Time Logs:
```powershell
docker logs -f netrisk-app
```

### Check Container Health Inspection:
```powershell
docker inspect --format='{{json .State.Health}}' netrisk-app
```

### Inspect Database File Inside Container:
```powershell
docker exec -it netrisk-app ls -la /app/data
```

### Execute Shell Inside Container:
```powershell
docker exec -it netrisk-app /bin/sh
```

---

## 12. Future CI/CD, Cloud & Security Roadmap

### A. Jenkins CI/CD Pipeline
- **Docker in Docker / Docker Agent**: Non-interactive build using `docker build -t netrisk:${BUILD_NUMBER} .`.
- **Deterministic Automated Tests**: Run `docker run --rm netrisk:${BUILD_NUMBER} pytest -v` inside the pipeline stage prior to registry push.

### B. Terraform & AWS Cloud Deployment
- **AWS ECS (Fargate) / EKS**:
  - Container binds to `0.0.0.0:8501` and writes logs to `stdout/stderr` (compatible with AWS CloudWatch).
  - **Storage Architecture for AWS**: While local Docker uses Docker named volumes, production AWS Fargate containers are ephemeral. Long-term production deployment on AWS requires either mounting an **Amazon Elastic File System (EFS)** to `/app/data` or transitioning SQLAlchemy to an **Amazon RDS (PostgreSQL)** managed instance by simply changing `NETRISK_DATABASE_URL`.

### C. SonarQube & Trivy Security Scanning
- **Trivy Vulnerability Scan**:
  ```powershell
  trivy image --severity HIGH,CRITICAL netrisk:2.0
  ```
- **SonarQube Static Analysis**: Non-root user permissions, zero hardcoded credentials, and pinned base images ensure clean security compliance scores.

---

## 13. NETRISK v2.0 Production Deployment Runbook (AWS EC2: `35.154.143.72`)

### Root-Cause Resolution Summary
- **Root Cause 1 (`ReferenceError: onLogout is not defined`)**: When logging in, `App.jsx` rendered `<Navbar onLogout={handleLogout} />`. In `Navbar.jsx`, line 61 evaluated `{onLogout && (`, but `onLogout` was omitted from `Navbar`'s destructured parameter list. In JavaScript strict mode, evaluating an undeclared identifier threw `ReferenceError: onLogout is not defined`, unmounting the React DOM tree and causing a white screen.
- **Root Cause 2 (Client-Side Hardcoded IP Fallback)**: In `api.js`, `BASE_URL` fell back to `"http://127.0.0.1:8001"`, which pointed to the end-user's local workstation rather than the remote EC2 server. Corrected to pure relative path `""` so all browser requests target `http://35.154.143.72:8000/api/*` seamlessly.
- **Root Cause 3 (Backend Authentication & Health Probe)**: Implemented standard `/api/auth/login`, `/api/auth/logout`, and `/health` endpoints in FastAPI.

### Step 1: Local Image Build & Tagging (Completed)
```bash
# Build verified local v2.0 image
docker build -t netrisk:2.0 .

# Tag image for AWS Public ECR repository
docker tag netrisk:2.0 public.ecr.aws/u2v8m6a3/netrisk:2.0
```

### Step 2: Authenticate & Push to AWS ECR Public
```bash
# Obtain authentication token and login to AWS ECR Public (us-east-1 registry endpoint)
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/u2v8m6a3

# Push version 2.0 to AWS Public ECR (Requires user approval)
docker push public.ecr.aws/u2v8m6a3/netrisk:2.0
```

### Step 3: Deploy Version 2.0 on EC2 Instance (`35.154.143.72`)
SSH into the EC2 instance and execute the atomic container swap:
```bash
# 1. Connect to EC2
ssh -i "your-key.pem" ubuntu@35.154.143.72

# 2. Authenticate Docker with AWS Public ECR
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/u2v8m6a3

# 3. Pull newly published v2.0 image
docker pull public.ecr.aws/u2v8m6a3/netrisk:2.0

# 4. Gracefully stop and remove the active 1.0 container (preserving image for rollback)
docker stop netrisk-app || true
docker rm netrisk-app || true

# 5. Launch the v2.0 container on port 8000 with persistent SQLite volume
docker run -d \
  --name netrisk-app \
  --restart unless-stopped \
  -p 8000:8000 \
  -v /home/ubuntu/netrisk/database:/app/database \
  public.ecr.aws/u2v8m6a3/netrisk:2.0

# 6. Verify container health and startup logs
docker ps
docker logs --tail 30 netrisk-app
curl -s http://localhost:8000/health
```

### Step 4: Verification in Browser
Open: **`http://35.154.143.72:8000`**
1. Enter identity (`kalpita.gharat`) or click **1-Click Capstone Demo Profiles**.
2. Click **Authenticate Session**.
3. Verify that the Executive Dashboard immediately renders without errors, displaying all risk analytics, SDLC charts, and system gauges.

### Emergency Rollback Procedure (Back to v1.0)
If rollback is needed for any reason, revert immediately using the preserved `1.0` image:
```bash
docker stop netrisk-app
docker rm netrisk-app
docker run -d \
  --name netrisk-app \
  --restart unless-stopped \
  -p 8000:8000 \
  -v /home/ubuntu/netrisk/database:/app/database \
  public.ecr.aws/u2v8m6a3/netrisk:1.0
```
