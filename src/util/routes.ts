import express from 'express';
import logs from '../routes/v1/logs';
import customer from '../routes/v1/customer';
import account from '../routes/v1/account';
import transaction from '../routes/v1/transaction';

const routes = (app: express.Application): void => {
  app.use('/v1/log', logs);
  app.use('/v1/customer', customer);
  app.use('/v1/account', account);
  app.use('/v1/transaction', transaction);
};

export default routes;
