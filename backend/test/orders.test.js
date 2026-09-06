import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Orders Management API', () => {
  it('GET /api/orders returns orders array', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/orders fails validation when customer or total is missing', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ notes: 'Đơn thiếu thông tin' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/orders creates a new order and updates status correctly', async () => {
    const testOrderId = `ORD-TEST-${Date.now()}`;
    const newOrder = {
      id: testOrderId,
      customer: 'Khách hàng Thử Nghiệm Enterprise',
      total: '120.000đ',
      payment: 'Chuyển khoản',
      notes: 'Bàn số 04 - Đọc báo sáng',
      status: 'Chờ xác nhận'
    };

    const createRes = await request(app)
      .post('/api/orders')
      .send(newOrder);
    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.id).toBe(testOrderId);

    // Update status to 'Hoàn thành'
    const patchRes = await request(app)
      .patch(`/api/orders/${testOrderId}/status`)
      .send({ status: 'Hoàn thành' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.success).toBe(true);
    expect(patchRes.body.data.status).toBe('Hoàn thành');

    // Cleanup
    await request(app).delete(`/api/orders/${testOrderId}`);
  });
});
