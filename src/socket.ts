import Socket from './socket.app';
import * as env from './config/env';
import { logger } from './util/logger';

const socket = new Socket(env.SOCKET_PORT);

socket.startSocketServer();

logger.info(`Mono Bank Socket Server running on :${env.SOCKET_PORT}\n`);