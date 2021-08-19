import appRootPath from 'app-root-path';
import dotenv from 'dotenv';
import { throwIfUndefined, randomizeMongoURL } from '../helpers';

dotenv.config({ path: `${appRootPath.path}/.env` });

export const NODE_ENV = throwIfUndefined(process.env.NODE_ENV, 'NODE_ENV');

export const APP_PORT = throwIfUndefined(process.env.APP_PORT, 'APP_PORT');

export const SOCKET_PORT = throwIfUndefined(process.env.SOCKET_PORT, 'SOCKET_PORT');

export const REDIS_HOST = throwIfUndefined(process.env.REDIS_HOST, 'REDIS_HOST');

export const REDIS_PORT = throwIfUndefined(process.env.REDIS_PORT, 'REDIS_PORT');

export const MONGO_URL =
  NODE_ENV === 'test'
    ? randomizeMongoURL(
      throwIfUndefined(process.env.MONGO_URL_TEST, 'MONGO_URL_TEST'),
    )
    : throwIfUndefined(process.env.MONGO_URL, 'MONGO_URL');

export const TOKEN_SECRET = throwIfUndefined(process.env.TOKEN_SECRET, 'TOKEN_SECRET');