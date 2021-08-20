# MONO BANKING API

REST API service for Mono Banking

## Prerequisites

To setup the app, you need the following dependencies installed on your computer/server.

- `Node.js`: min. v14.15.0 LTS
- `MongoDB`: min. v4.0
- `Redis`: min. v4.0.9

## Installation

Clone the following git repository:

```
$ git clone https://github.com/oladotunsobande/mono-bank-api.git
```

Install all dependencies:
```
$ npm install
```

Set the environment variables listed below:
```
NODE_ENV=
APP_PORT=
SOCKET_PORT=
MONGO_URL=
MONGO_URL_TEST=
TOKEN_SECRET=
REDIS_HOST=
REDIS_PORT=
```

Run the following command to run the test cases:
```
$ npm run test
```

You can start the app and socket servers by running the following commands:
```
$ npm run server
$ npm run socket
```

## API Documentation

The REST API documentation for this application is available via the following link:
`https://documenter.getpostman.com/view/7658548/TzCV2isP`

The documentation consists of all information needed to test the API.

## Author

* **Oladotun Sobande** - Backend development