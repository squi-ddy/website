FROM node:latest

WORKDIR /app/
COPY . .
RUN yarn
RUN yarn run build
EXPOSE 3001