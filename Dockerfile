# Stage 1 — Build the Vite frontend
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 — Serve with nginx
FROM nginx:1.25-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

# nginx.conf is mounted at runtime via docker-compose
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
