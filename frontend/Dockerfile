FROM node:16-alpine AS stage1-frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build \
    && rm -rf ./src \
    && rm -rf ./node_modules

FROM nginx:latest AS  stage2-frontend-production
COPY --from=stage1-frontend-builder /app/build /usr/share/nginx/html
COPY --from=stage1-frontend-builder /app/nginx/conf.d/default.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
