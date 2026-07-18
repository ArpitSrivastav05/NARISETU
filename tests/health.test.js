const request = require('supertest');
const app = require('../index');

describe('Health Route', () => {
  it('GET /api/health should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'operational');
  });
});
