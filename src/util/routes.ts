import express from 'express';
import account from '../routes/v1/account';
import transaction from '../routes/v1/transaction';

const routes = (app: express.Application): void => {
  app.use('/v1/account', account);
  app.use('/v1/transaction', transaction);
};

export default routes;
