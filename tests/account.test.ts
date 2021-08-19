import request from 'supertest';
import expect from 'expect';
import app from '../src/server.app';
import CustomerRepository from '../src/repositories/CustomerRepository';
import { Customer, Account } from '../src/models';
import mongoose from 'mongoose';
import { db } from '../src/util/mongo';

let token: string;
let accountNumber: string;
let accountNumber2: string = '7394907323';
let customerId: mongoose.Types.ObjectId;

describe('Account Tests', () => {
  before(async () => {
    const customer = await CustomerRepository.create({
      id: 234,
      name: 'Testing User',
      email: 'testing.user3@gmail.com',
      password: 'password123',
    });
    customerId = customer._id;

    const newAccount = new Account({
      customerId: customer._id,
      category: 'savings',
      accountNumber: accountNumber2,
      openedAt: new Date(),
      status: 'active',
    });
    await newAccount.save();

    const payload = {
      email: 'testing.user3@gmail.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/v1/customer/login')
      .send(payload);

    token = response.body.data.token;
  });

  after(async () => {
    //await db.db.dropDatabase();
  });

  describe('Account Creation', () => {
    it('should respond with HTTP status code 400 if auth token is omitted', async () => {
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

    it('should respond with HTTP status code 404 if token is invalid', async () => {
      const payload = {
        category: 'savings',
        deposit: 1000000,
      };
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODU2NzQ5NjQzOSwiaWF0IjoxNjI5NDAxNTk2LCJleHAiOjE2Mjk0MDg3OTZ9.vYieqEm_xTiOl_PE6FuaNpefTl90B1okGtU71elW9Fg';

      const response = await request(app)
        .post('/v1/account/create')
        .set('Authorization', `Bearer ${fakeToken}`)
        .send(payload);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Invalid access token provided');
    });

    it('should respond with HTTP status code 400 if wrong category is specified', async () => {
      const payload = {
        category: 'fixed deposit',
        deposit: 1000000,
      };

      const response = await request(app)
        .post('/v1/account/create')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if category omitted', async () => {
      const payload = {
        deposit: 1000000,
      };

      const response = await request(app)
        .post('/v1/account/create')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if deposit amount is less than zero', async () => {
      const payload = {
        category: 'savings',
        deposit: -1000,
      };

      const response = await request(app)
        .post('/v1/account/create')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should create new account if payload is valid', async () => {
      const payload = {
        category: 'savings',
        deposit: 1000000,
      };

      const response = await request(app)
        .post('/v1/account/create')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        accountNumber = response.body.data.accountNumber;

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
  });

  describe('Account Balances', () => {
    it('should respond with HTTP status code 400 if account number length is wrong', async () => {
      const payload = {
        accountNumber: '7485947',
      };

      const response = await request(app)
        .post('/v1/account/balances')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if account number is not a number', async () => {
      const payload = {
        accountNumber: '74857gh947',
      };

      const response = await request(app)
        .post('/v1/account/balances')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if account number is omitted', async () => {
      const payload = {};

      const response = await request(app)
        .post('/v1/account/balances')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 404 if account number does not exist', async () => {
      const payload = {
        accountNumber: '1234567890',
      };

      const response = await request(app)
        .post('/v1/account/balances')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    it('should return balances if payload is valid', async () => {
      const payload = {
        accountNumber,
      };

      const response = await request(app)
        .post('/v1/account/balances')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
  });

  describe('Fund transfer', () => {
    it('should respond with HTTP status code 400 if sourceAccount is not a number', async () => {
      const payload = {
        sourceAccount: '748rhd5947',
        destinationAccount: '3738438384',
        amount: 100000,
        destinationAccountBelongsToCustomer: false,
      };

      const response = await request(app)
        .post('/v1/account/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if sourceAccount is omitted', async () => {
      const payload = {
        destinationAccount: '3738438384',
        amount: 100000,
        destinationAccountBelongsToCustomer: false,
      };

      const response = await request(app)
        .post('/v1/account/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if destinationAccount is not a number', async () => {
      const payload = {
        sourceAccount: '3738438384',
        destinationAccount: '748rhd5947',
        amount: 100000,
        destinationAccountBelongsToCustomer: false,
      };

      const response = await request(app)
        .post('/v1/account/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if destinationAccount is omitted', async () => {
      const payload = {
        sourceAccount: '3738438384',
        amount: 100000,
        destinationAccountBelongsToCustomer: false,
      };

      const response = await request(app)
        .post('/v1/account/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if amount is less than zero', async () => {
      const payload = {
        sourceAccount: '3738438384',
        destinationAccount: '748rhd5947',
        amount: -100000,
        destinationAccountBelongsToCustomer: false,
      };

      const response = await request(app)
        .post('/v1/account/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if amount is omitted', async () => {
      const payload = {
        sourceAccount: '3738438384',
        destinationAccount: '748rhd5947',
        destinationAccountBelongsToCustomer: false,
      };

      const response = await request(app)
        .post('/v1/account/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if destinationAccountBelongsToCustomer is omitted', async () => {
      const payload = {
        sourceAccount: '3738438384',
        destinationAccount: '748rhd5947',
        amount: 100000,
      };

      const response = await request(app)
        .post('/v1/account/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if destination account does not belong to customer', async () => {
      const customer2 = await CustomerRepository.create({ 
        id: 11, 
        name: 'Garba Shehu',
        email: 'g.shehu@aol.com',
        password: 'passworo',
      });

      const newAccount = new Account({
        customerId: customer2._id,
        category: 'savings',
        accountNumber: '8578438303',
        openedAt: new Date(),
        status: 'active',
      });
      const account2 = await newAccount.save();

      const payload = {
        sourceAccount: accountNumber,
        destinationAccount: account2.accountNumber,
        amount: 100000,
        destinationAccountBelongsToCustomer: true,
      };

      const response = await request(app)
        .post('/v1/account/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should respond with HTTP status code 400 if source account does not belong to customer', async () => {
      const customer2 = await Customer.findOne({ id: 11 });
      const account2 = await Account.findOne({ customerId: customer2!._id });

      const payload = {
        sourceAccount: account2!.accountNumber,
        destinationAccount: accountNumber,
        amount: 100000,
        destinationAccountBelongsToCustomer: true,
      };

      const response = await request(app)
        .post('/v1/account/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should transfer funds if payload is valid', async () => {
      console.log(`account1: ${accountNumber}, account2: ${accountNumber2}`);
      const payload = {
        sourceAccount: accountNumber,
        destinationAccount: accountNumber2,
        amount: 100000,
        destinationAccountBelongsToCustomer: true,
      };

      const response = await request(app)
        .post('/v1/account/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);
        console.log(`error: ${response.body.error}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
  });
});