FROM node:17

WORKDIR /app/
COPY . .
RUN curl -v https://registry.npmjs.com/
RUN npm run docker
EXPOSE 3000