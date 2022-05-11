FROM node:latest

WORKDIR /app/
COPY . .
RUN curl -v https://registry.npmjs.com/
RUN npm install
RUN npm run build
EXPOSE 3000