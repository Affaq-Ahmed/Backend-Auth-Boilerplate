const request = require('supertest');
const express = require('express');
const routes = require('../routes');

describe('User API', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', routes);
  });

  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test', email: 'test@example.com', password: 'password' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should get users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(401); // Auth required
  });
});
