docker build -t dotunduro/mini-bank-api:1.0 .

docker run -d --name mini-bank-api \
  -p  8000:8090 -p 8001:8091 \
  -e  NODE_ENV=dev \
  -e  APP_PORT=8090 \
  -e  SOCKET_PORT=8091 \
  -e  MONGO_URL=mongodb://localhost:27017/mono-local \
  -e  MONGO_URL_TEST=mongodb://localhost:27017/mono-local \
  -e  TOKEN_SECRET=bmbv6pXjC4E2noyTZH9RtlPMSAt3Mmc3XMc \
  -e  REDIS_HOST=127.0.0.1 \
  -e  REDIS_PORT=6379 \
  dotunduro/mini-bank-api:1.0