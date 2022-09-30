FROM node:latest

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app/

# install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm i -P

# build
COPY . .
RUN pnpm run build

CMD pnpm start