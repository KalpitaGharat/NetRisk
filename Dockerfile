# ==============================================================================
# NETRISK — Enterprise Cybersecurity SDLC Platform
# Multi-Stage Dockerfile: React 18 / Node.js Frontend + Python FastAPI Backend
# ==============================================================================

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
