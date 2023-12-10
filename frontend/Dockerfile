FROM node:alpine AS base

RUN npm i -g pnpm
RUN apk --no-cache add --virtual build-deps build-base python3

FROM base AS dependencies

WORKDIR /app/
COPY package.json pnpm-lock.yaml ./
RUN pnpm i -P
RUN apk del build-deps

FROM base AS build

WORKDIR /app/
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build

FROM nginx:alpine-slim AS deploy

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /data/www

