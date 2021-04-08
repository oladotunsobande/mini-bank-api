import appRootPath from 'app-root-path';
import dotenv from 'dotenv';
import { throwIfUndefined } from '../helpers';

dotenv.config({ path: `${appRootPath.path}/.env` });

export const NODE_ENV = throwIfUndefined(
  process.env.NODE_ENV,
  'NODE_ENV',
);

export const APP_PORT = throwIfUndefined(
  process.env.APP_PORT,
  'APP_PORT',
);