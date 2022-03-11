FROM node:17

WORKDIR /app/
COPY . .

WORKDIR /app/backend
RUN npm run docker
EXPOSE 3000
RUN ["npm", "start"]