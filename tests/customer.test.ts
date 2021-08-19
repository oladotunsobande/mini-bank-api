import request from 'supertest';
import expect from 'expect';
import mongoose from 'mongoose';
import { db } from '../src/util/mongo';
import app from '../src/server.app';
import CustomerRepository from '../src/repositories/CustomerRepository';
import AccountRepository from '../src/repositories/AccountRepository';

let token: string;
let accountNumber: string = '3749383773';

describe('Customer Tests', () => {
  describe('Customer Creation', () => {
    it('should respond with HTTP status code 400 if name is omitted', async () => {
      const payload = {
        email: 'user@gmail.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/v1/customer/create')
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('\"name\" is required');
    });

    it('should respond with HTTP status code 400 if email is omitted', async () => {
      const payload = {
        name: 'Test User',
        password: 'password123',
      };

      const response = await request(app)
        .post('/v1/customer/create')
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('\"email\" is required');
    });

    it('should respond with HTTP status code 400 if password is omitted', async () => {
      const payload = {
        name: 'Test User',
        email: 'user@gmail.com',
      };

      const response = await request(app)
        .post('/v1/customer/create')
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('\"password\" is required');
    });

    it('should respond with HTTP status code 400 if email is invalid', async () => {
      const payload = {
        name: 'Test User',
        email: 'user@gmail',
        password: 'password123',
      };

      const response = await request(app)
        .post('/v1/customer/create')
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('\"email\" must be a valid email');
    });

    it('should respond with HTTP status code 200 if payload is valid', async () => {
      const payload = {
        name: 'Test User',
        email: 'user@gmail.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/v1/customer/create')
        .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should respond with HTTP status code 400 if email exists', async () => {
      const payload = {
        name: 'Test User',
        email: 'user@gmail.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/v1/customer/create')
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('The email provided already exists');
    });
  });

  describe('Login', () => {
    it('should response with HTTP status code 400 if email is omitted', async () => {
      const payload = {
        password: 'password123',
      };

      const response = await request(app)
        .post('/v1/customer/login')
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('\"email\" is required');
    });

    it('should response with HTTP status code 400 if password is omitted', async () => {
      const payload = {
        email: 'user@gmail.com',
      };

      const response = await request(app)
        .post('/v1/customer/login')
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('\"password\" is required');
    });

    it('should respond with HTTP status code 400 if email is invalid', async () => {
      const payload = {
        email: 'user@gmail',
        password: 'password123',
      };

      const response = await request(app)
        .post('/v1/customer/login')
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('\"email\" must be a valid email');
    });

    it('should respond with HTTP status code 400 if email/password is wrong', async () => {
      const payload = {
        email: 'user@gmail.com',
        password: 'password122',
      };

      const response = await request(app)
        .post('/v1/customer/login')
        .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Invalid email/password');
    });

    it('should respond with HTTP status code 200 if email and password are correct', async () => {
      const payload = {
        email: 'user@gmail.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/v1/customer/login')
        .send(payload);

        token = response.body.data.token;

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
  });

  describe('Customer Search By Account Number', () => {
    it('should response with HTTP status code 400 if accountNumber is omitted', async () => {
      const response = await request(app)
        .get('/v1/customer/search');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should response with HTTP status code 400 if length of accountNumber is invalid', async () => {
      const response = await request(app)
        .get('/v1/customer/search?accountNumber=763834722')
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should response with HTTP status code 400 if accountNumber is not a number', async () => {
      const response = await request(app)
        .get('/v1/customer/search?accountNumber=53grhte839374')
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should response with HTTP status code 400 if accountNumber does not exist', async () => {
      const response = await request(app)
        .get('/v1/customer/search?accountNumber=5374839374')
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Customer account with account number provided does not exist');
    });

    it('should response with HTTP status code 200 if accountNumber is valid', async () => {
      const customer = await CustomerRepository.create({
        id: 234,
        name: 'Testing User',
        email: 'testing.user@gmail.com',
        password: 'password123',
      });
      await AccountRepository.create({
        customerId: customer._id,
        category: 'savings',
        accountNumber,
      });

      const response = await request(app)
        .get(`/v1/customer/search?accountNumber=${accountNumber}`)
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
  });
});