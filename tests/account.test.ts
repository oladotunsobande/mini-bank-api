import request from 'supertest';
import expect from 'expect';
import app from '../src/server.app';
import { Customer, Account } from '../src/models';

describe('Account Creation', () => {
  it('should respond with HTTP status code 404 if customer does not exist', async () => {
    const payload = {
      customerId: 10,
      category: 'savings',
      deposit: 1000000,
    };

    const response = await request(app)
      .post('/v1/account/create')
      .send(payload);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Customer record does not exist');
  });

  it('should respond with HTTP status code 400 if wrong category is specified', async () => {
    const customer = new Customer({ id: 10, name: 'Gbenga Adesina' });
    await customer.save();

    const payload = {
      customerId: 10,
      category: 'fixed deposit',
      deposit: 1000000,
    };

    const response = await request(app)
      .post('/v1/account/create')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if customer id is omitted', async () => {
    const payload = {
      category: 'savings',
      deposit: 1000000,
    };

    const response = await request(app)
      .post('/v1/account/create')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if category omitted', async () => {
    const payload = {
      customerId: 10,
      deposit: 1000000,
    };

    const response = await request(app)
      .post('/v1/account/create')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if deposit amount is less than zero', async () => {
    const payload = {
      customerId: 10,
      category: 'savings',
      deposit: -1000,
    };

    const response = await request(app)
      .post('/v1/account/create')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should create new account if payload is valid', async () => {
    const payload = {
      customerId: 10,
      category: 'savings',
      deposit: 100000,
    };

    const response = await request(app)
      .post('/v1/account/create')
      .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
  });
});

describe('Account Balances', () => {
  it('should respond with HTTP status code 400 if customer id is omitted', async () => {
    const payload = {
      accountNumber: '748rhd5947',
    };

    const response = await request(app)
      .post('/v1/account/balances')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if customer id is not a number', async () => {
    const payload = {
      customerId: 'jf',
      accountNumber: '3848393393',
    };

    const response = await request(app)
      .post('/v1/account/balances')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if account number length is wrong', async () => {
    const payload = {
      customerId: 10,
      accountNumber: '7485947',
    };

    const response = await request(app)
      .post('/v1/account/balances')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if account number is not a number', async () => {
    const payload = {
      customerId: 10,
      accountNumber: '74857gh947',
    };

    const response = await request(app)
      .post('/v1/account/balances')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if account number is omitted', async () => {
    const payload = {
      customerId: 10,
    };

    const response = await request(app)
      .post('/v1/account/balances')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 404 if account number does not exist', async () => {
    const payload = {
      customerId: 10,
      accountNumber: '1234567890',
    };

    const response = await request(app)
      .post('/v1/account/balances')
      .send(payload);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
  });

  it('should return balances if payload is valid', async () => {
    const customer = await Customer.findOne({ id: 10 });
    const account = await Account.findOne({ customerId: customer!._id });

    const payload = {
      customerId: 10,
      accountNumber: account!.accountNumber,
    };

    const response = await request(app)
      .post('/v1/account/balances')
      .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
  });
});

describe('Fund transfer', () => {
  it('should respond with HTTP status code 400 if customer id is omitted', async () => {
    const payload = {
      sourceAccount: '7488765947',
      destinationAccount: '3738438384',
      amount: 100000,
      destinationAccountBelongsToCustomer: false,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if customer id is not a number', async () => {
    const payload = {
      customerId: 'jf',
      sourceAccount: '7488765947',
      destinationAccount: '3738438384',
      amount: 100000,
      destinationAccountBelongsToCustomer: false,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if sourceAccount is not a number', async () => {
    const payload = {
      customerId: 10,
      sourceAccount: '748rhd5947',
      destinationAccount: '3738438384',
      amount: 100000,
      destinationAccountBelongsToCustomer: false,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if sourceAccount is omitted', async () => {
    const payload = {
      customerId: 10,
      destinationAccount: '3738438384',
      amount: 100000,
      destinationAccountBelongsToCustomer: false,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if destinationAccount is not a number', async () => {
    const payload = {
      customerId: 10,
      sourceAccount: '3738438384',
      destinationAccount: '748rhd5947',
      amount: 100000,
      destinationAccountBelongsToCustomer: false,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if destinationAccount is omitted', async () => {
    const payload = {
      customerId: 10,
      sourceAccount: '3738438384',
      amount: 100000,
      destinationAccountBelongsToCustomer: false,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if amount is less than zero', async () => {
    const payload = {
      customerId: 10,
      sourceAccount: '3738438384',
      destinationAccount: '748rhd5947',
      amount: -100000,
      destinationAccountBelongsToCustomer: false,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if amount is omitted', async () => {
    const payload = {
      customerId: 10,
      sourceAccount: '3738438384',
      destinationAccount: '748rhd5947',
      destinationAccountBelongsToCustomer: false,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if destinationAccountBelongsToCustomer is omitted', async () => {
    const payload = {
      customerId: 10,
      sourceAccount: '3738438384',
      destinationAccount: '748rhd5947',
      amount: 100000,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if destination account does not belong to customer', async () => {
    const customer = await Customer.findOne({ id: 10 });
    const account = await Account.findOne({ customerId: customer!._id });

    const newCustomer = new Customer({ id: 11, name: 'Garba Shehu' });
    const customer2 = await newCustomer.save();

    const newAccount = new Account({
      customerId: customer2._id,
      category: 'savings',
      accountNumber: '7347494937',
      openedAt: new Date(),
      status: 'active',
    });
    const account2 = await newAccount.save();

    const payload = {
      customerId: 10,
      sourceAccount: account!.accountNumber,
      destinationAccount: account2.accountNumber,
      amount: 100000,
      destinationAccountBelongsToCustomer: true,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if source account does not belong to customer', async () => {
    const customer = await Customer.findOne({ id: 10 });
    const account = await Account.findOne({ customerId: customer!._id });

    const customer2 = await Customer.findOne({ id: 11 });
    const account2 = await Account.findOne({ customerId: customer2!._id });

    const payload = {
      customerId: 10,
      sourceAccount: account2!.accountNumber,
      destinationAccount: account!.accountNumber,
      amount: 100000,
      destinationAccountBelongsToCustomer: true,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should transfer funds if payload is valid', async () => {
    const customer = await Customer.findOne({ id: 10 });
    const account = await Account.findOne({ customerId: customer!._id });

    const customer2 = await Customer.findOne({ id: 11 });
    const account2 = await Account.findOne({ customerId: customer2!._id });

    const payload = {
      customerId: 10,
      sourceAccount: account!.accountNumber,
      destinationAccount: account2!.accountNumber,
      amount: 100000,
      destinationAccountBelongsToCustomer: false,
    };

    const response = await request(app)
      .post('/v1/account/transfer')
      .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
  });
});