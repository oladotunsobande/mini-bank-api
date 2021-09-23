FROM node:14.17-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i -g pm2

RUN npm install

COPY . .

ENV NODE_ENV=dev
ENV APP_PORT=8090
ENV SOCKET_PORT=8091
ENV MONGO_URL=mongodb://localhost:27017/mono-local
ENV MONGO_URL_TEST=mongodb://localhost:27017/mono-local
ENV TOKEN_SECRET=bmbv6pXjC4E2noyTZH9RtlPMSAt3Mmc3XMc
ENV REDIS_HOST=127.0.0.1
ENV REDIS_PORT=6379

EXPOSE 8090
EXPOSE 8091

CMD ["pm2", "start"]