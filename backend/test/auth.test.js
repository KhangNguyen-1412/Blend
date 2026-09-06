import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Auth & Staff Access Control API', () => {
  it('POST /api/auth/login rejects empty payload with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('tên đăng nhập và mật khẩu');
  });

  it('POST /api/auth/login rejects non-existent username with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'non_existent_user_xyz', password: 'randompassword' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('không tồn tại');
  });

  it('POST /api/auth/login rejects incorrect password with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin_khang', password: 'incorrect_password_123' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('không chính xác');
  });

  it('POST /api/auth/login authenticates seeded admin and issues session token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin_khang', password: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.username).toBe('admin_khang');
    expect(res.body.data.role).toBe('Quản lý');
    expect(res.body.data.token).toBeDefined();
    expect(typeof res.body.data.token).toBe('string');
  });

  it('GET /api/staff returns staff directory', async () => {
    const res = await request(app).get('/api/staff');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
