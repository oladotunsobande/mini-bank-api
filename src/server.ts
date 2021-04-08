import { APP_PORT } from './config/env';
import app from './server.app';
import { logger } from './util/logger';

app.listen(APP_PORT, () => {
  logger.info(
    `Mono Banking API Service Started successfully on :${APP_PORT}\n`,
  );
});
