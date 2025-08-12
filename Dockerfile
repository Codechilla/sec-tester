# SEC-TESTER Full-stack Dockerfile
# --- Frontend (Vite/React) ---
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# --- Backend (FastAPI) ---
FROM continuumio/miniconda3:latest AS backend-build
WORKDIR /app/backend
COPY backend/ ./backend/
COPY requirements.txt ./
RUN conda env create -f environment.yml || conda create -n sec-tester-env python=3.11 && conda run -n sec-tester-env pip install -r requirements.txt

# --- Final Image ---
FROM python:3.11-slim AS final
WORKDIR /app
# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY --from=frontend-build /app/frontend/public ./frontend/public
# Copy backend
COPY --from=backend-build /app/backend ./backend
COPY requirements.txt ./
COPY environment.yml ./
# Install backend dependencies
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8001 5173
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port 8001 & npx serve -s frontend/dist -l 5173"]
