import { logger } from './util/logger';
import * as NotificationHelper from './helpers/notification';
import { NotificationType } from './types';
import { SOCKET_EVENTS, SOCKET_NOTIFICATION_CHANNEL } from './constants/notifications';

class Socket {
  private io: any;

  constructor(port: string) {
    this.io = require('socket.io')(port, {
      transports: ['polling','websockets'],
      cors: { origin: "*" },
    });
  }

  startSocketServer() {
    this.io.on('connection', (socket: any) => {
      socket.join(SOCKET_NOTIFICATION_CHANNEL);

      socket.on(SOCKET_EVENTS.BROADCAST, async (data: string) => {
        const payload: NotificationType = JSON.parse(data);
        NotificationHelper.log(payload);

        this.io.in(SOCKET_NOTIFICATION_CHANNEL).emit(SOCKET_EVENTS.NOTIFICATION, data);
        logger.info('Data broadcasted!');
      });
        
      socket.on('disconnect', async () => {
        socket.disconnect(true);
        logger.info('Client disconnected!');
      });
    
      socket.on('error', async () => {
        socket.disconnect(true);
        logger.info('Client disconnected!');
      });
    });
  }
}

export default Socket;