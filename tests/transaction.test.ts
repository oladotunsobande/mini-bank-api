import mongoose from 'mongoose';
import { db } from '../src/util/mongo';
import request from 'supertest';
import expect from 'expect';
import app from '../src/server.app';
import CustomerRepository from '../src/repositories/CustomerRepository';
import { Account } from '../src/models';

let token: string;
let customerId: mongoose.Types.ObjectId;

describe('Transaction', () => {
  before(async () => {
    const customer = await CustomerRepository.create({
      id: 235,
      name: 'Testing User',
      email: 'testing.user2@gmail.com',
      password: 'password123',
    });
    customerId = customer._id;

    const payload = {
      email: 'testing.user2@gmail.com',
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

  it('should respond with HTTP status code 400 if auth token is omitted', async () => {
    const payload = {
      accountNumber: '7488765947',
    };

    const response = await request(app)
      .post('/v1/transaction')
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if auth token is invalid', async () => {
    const payload = {
      customerId: 'jf',
      accountNumber: '7488765947',
    };
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODU2NzQ5NjQzOSwiaWF0IjoxNjI5NDAxNTk2LCJleHAiOjE2Mjk0MDg3OTZ9.vYieqEm_xTiOl_PE6FuaNpefTl90B1okGtU71elW9Fg';

    const response = await request(app)
      .post('/v1/transaction')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(payload);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if account number does not belong to customer', async () => {
    const customer2 = await CustomerRepository.create({ 
      id: 11, 
      name: 'Garba Shehu',
      email: 'g.shehu@gmail.com',
      password: 'password',
    });

    const newAccount = new Account({
      customerId: customer2._id,
      category: 'savings',
      accountNumber: '7347494959',
      openedAt: new Date(),
      status: 'active',
    });
    const account2 = await newAccount.save();

    const payload = {
      accountNumber: account2.accountNumber,
    };

    const response = await request(app)
      .post('/v1/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should respond with HTTP status code 400 if account number is not a number', async () => {
    const payload = {
      accountNumber: '7488fy5947',
    };

    const response = await request(app)
      .post('/v1/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
  });

  it('should return transactions if payload is valid', async () => {
    const newAccount = new Account({
      customerId,
      category: 'savings',
      accountNumber: '7347494900',
      openedAt: new Date(),
      status: 'active',
    });
    const account2 = await newAccount.save();

    const payload = {
      accountNumber: account2.accountNumber,
    };

    const response = await request(app)
      .post('/v1/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

      console.log(`error: ${response.body.error}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.transactions)).toBe(true);
  });
});