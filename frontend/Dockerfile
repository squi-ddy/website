FROM node:latest

WORKDIR /app/

# install deps
COPY package.json yarn.lock ./
RUN yarn --prod

# build
COPY . .
RUN yarn run build