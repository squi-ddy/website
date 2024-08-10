FROM nginx:alpine-slim AS deploy

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public /data/www