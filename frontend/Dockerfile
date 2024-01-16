FROM node:alpine AS base

FROM base AS dependencies

RUN apk --no-cache add --virtual build-deps build-base python3
WORKDIR /app/
COPY package.json package-lock.json ./
RUN npm ci --include=dev

FROM base AS build

WORKDIR /app/
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

FROM nginx:alpine-slim AS deploy

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /data/www

