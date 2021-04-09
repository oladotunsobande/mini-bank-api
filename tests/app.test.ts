import request from 'supertest';
import expect from 'expect';
import app from '../src/server.app';

describe('Root path (GET /)', () => {
  it('should respond with 200 if root path is specified', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should respond with 404 if a wrong route is specified', async () => {
    const response = await request(app).get('/non_existent_route');
    expect(response.status).toBe(404);
  });
});