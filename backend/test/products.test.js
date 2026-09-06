import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Products & Categories Catalog API', () => {
  it('GET /api/categories returns seeded categories list', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some(c => c.name === 'Cà phê')).toBe(true);
  });

  it('GET /api/products returns products list array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/products rejects invalid payload with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Chỉ có tên, thiếu danh mục và giá' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/products creates product successfully', async () => {
    const testId = `TEST_${Date.now()}`;
    const newProduct = {
      id: testId,
      name: 'Cold Brew Đặc Tuyển Blend Roastery',
      category: 'Cà phê',
      price: '55.000đ',
      variants: 'M, L',
      status: 'Còn hàng'
    };

    const createRes = await request(app)
      .post('/api/products')
      .send(newProduct);
    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);

    const getRes = await request(app).get(`/api/products/${testId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.name).toBe('Cold Brew Đặc Tuyển Blend Roastery');

    // Cleanup
    await request(app).delete(`/api/products/${testId}`);
  });
});
