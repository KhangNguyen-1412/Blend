import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('API Infrastructure & Healthcheck', () => {
  it('GET /health returns HTTP 200 with healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET / returns HTTP 200 (serving SPA or API info)', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});
