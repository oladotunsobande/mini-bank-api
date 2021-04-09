import request from 'supertest';
import expect from 'expect';
import app from '../src/server.app';
import { Customer, Account } from '../src/models';

describe('Transaction', () => {
  it('should respond with HTTP status code 400 if customer id is omitted', async () => {
    const payload = {
      accountNumber: '7488765947',
    };

    const response = await request(app)
      .post('/v1/transaction')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if customer id is not a number', async () => {
    const payload = {
      customerId: 'jf',
      accountNumber: '7488765947',
    };

    const response = await request(app)
      .post('/v1/transaction')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 404 if customer id does not exist', async () => {
    const payload = {
      customerId: 10,
      accountNumber: '7488765947',
    };

    const response = await request(app)
      .post('/v1/transaction')
      .send(payload);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if account number does not belong to customer', async () => {
    const customer = await Customer.findOne({ id: 11 });
    const account = await Account.findOne({ customerId: customer!._id });

    const payload = {
      customerId: 10,
      accountNumber: account!.accountNumber,
    };

    const response = await request(app)
      .post('/v1/transaction')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if account number is not a number', async () => {
    const payload = {
      customerId: 10,
      accountNumber: '7488fy5947',
    };

    const response = await request(app)
      .post('/v1/transaction')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should return transactions if payload is valid', async () => {
    const customer = await Customer.findOne({ id: 10 });
    const account = await Account.findOne({ customerId: customer!._id });

    const payload = {
      customerId: 10,
      accountNumber: account!.accountNumber,
    };

    const response = await request(app)
      .post('/v1/transaction')
      .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.transactions)).toBe(true);
  });
});