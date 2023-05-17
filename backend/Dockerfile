FROM node:16-alpine AS stage1-backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build \
    && rm -rf ./src \
    && rm -rf ./node_modules

FROM node:16-alpine AS stage2-backend-production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm i -g pm2
COPY --from=stage1-backend-builder /app/dist ./dist
COPY ./ecosystem.config.js ./
EXPOSE 5000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
