# ==============================================================================
# NETRISK — Enterprise Cybersecurity SDLC Platform v2.0
# Single-Stage Production Dockerfile (Frontend + Backend)
# ==============================================================================

# 1. Base Image: Supported official Python 3.11 image
FROM python:3.11-slim

# 2. Set container working directory
WORKDIR /app

# 3. Configure Python environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# 4. Install Node.js, npm, and curl (needed for building React UI and health checks)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# 5. Copy and install Python backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy frontend package files and install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# 7. Copy all project application source code and models
COPY . .

# 8. Build the React 18 production frontend bundle directly into frontend/dist
RUN cd frontend && npm run build

# 9. Create non-root user and persistent database directory with safe permissions
RUN groupadd -r netrisk && useradd -r -g netrisk -d /app -s /sbin/nologin netrisk \
    && mkdir -p /app/database \
    && chown -R netrisk:netrisk /app

# 10. Switch to non-root user for security
USER netrisk

# 11. Expose application port
EXPOSE 8000

# 12. Health check probe against the FastAPI health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# 13. Start FastAPI application with Uvicorn
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
