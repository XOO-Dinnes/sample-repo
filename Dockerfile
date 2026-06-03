# Stage 1 - Build the Next.js app
FROM node:18-alpine AS builder
WORKDIR /app
COPY gitfolio/package*.json ./
RUN npm install
COPY gitfolio/ .
RUN npm run build

# Stage 2 - Serve static files with nginx
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
