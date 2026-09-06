# ==============================================================================
# Enterprise Multi-Stage Dockerfile for Blend Management System
# Base Image: Node.js 22 Alpine (LTS with native node:sqlite support)
# ==============================================================================

# Stage 1: Frontend Build Stage
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY frontend/ ./
RUN npm run build

# Stage 2: Backend Dependencies Stage
FROM node:22-alpine AS backend-deps
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev --prefer-offline --no-audit

# Stage 3: Production Runtime Stage
FROM node:22-alpine AS runner
LABEL maintainer="Blend Roastery Engineering Team <engineering@blend-roastery.vn>"
LABEL description="Blend Coffee & Tea Fullstack Enterprise Management System"

ENV NODE_ENV=production \
    PORT=5000 \
    TZ=Asia/Ho_Chi_Minh

WORKDIR /app

# Install dumb-init for proper PID 1 signal forwarding and curl for healthchecks
RUN apk add --no-cache dumb-init curl tzdata

# Create application directories and establish non-root permissions
RUN mkdir -p /app/backend/data /app/frontend/dist && \
    chown -R node:node /app

# Copy production backend artifacts
COPY --from=backend-deps --chown=node:node /app/backend/node_modules ./backend/node_modules
COPY --chown=node:node backend/ ./backend/

# Copy built frontend distribution for static serving
COPY --from=frontend-builder --chown=node:node /app/frontend/dist ./frontend/dist

# Security Hardening: Switch to unprivileged user
USER node

# Healthcheck probe against express /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

EXPOSE 5000

# Use dumb-init to avoid zombie processes and ensure graceful SIGTERM handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "backend/src/server.js"]
