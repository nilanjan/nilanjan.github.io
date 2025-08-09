# Multi-stage build for the portfolio application

# Stage 1: Build the Rust backend
FROM rust:1.75 as backend-builder
WORKDIR /app
COPY backend/Cargo.toml backend/Cargo.lock ./
RUN cargo build --release

# Stage 2: Build the React frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Stage 3: Final runtime image
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the backend binary
COPY --from=backend-builder /app/target/release/portfolio-backend ./backend

# Copy the frontend build
COPY --from=frontend-builder /app/dist ./frontend

# Create a simple nginx config to serve the frontend
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /app/frontend; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://localhost:3001; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/sites-available/default

# Install nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Expose ports
EXPOSE 80 3001

# Start both nginx and the backend
CMD ["sh", "-c", "./backend & nginx -g 'daemon off;'"] 