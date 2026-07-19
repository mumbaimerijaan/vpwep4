# Stage 1: Build static assets
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine
# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy nginx template for dynamic port binding via envsubst
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Default PORT fallback is 8080 if not set
ENV PORT=8080
EXPOSE 8080
