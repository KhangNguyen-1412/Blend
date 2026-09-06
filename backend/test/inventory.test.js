import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Inventory Stock & Alert Management API', () => {
  it('GET /api/inventory returns inventory items array with computed status', async () => {
    const res = await request(app).get('/api/inventory');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      const firstItem = res.body.data[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('qty');
      expect(['ok', 'warning']).toContain(firstItem.status);
    }
  });

  it('POST /api/inventory rejects item creation without name or unit', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .send({ qty: 10 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/inventory creates item and correctly flags low stock warning', async () => {
    const testItemId = `INV-TEST-${Date.now()}`;
    const newItem = {
      id: testItemId,
      name: 'Hạt Cà Phê Mộc Arabica Cầu Đất',
      unit: 'kg',
      qty: 2,
      min: 5 // Qty <= Min should trigger warning status
    };

    const createRes = await request(app)
      .post('/api/inventory')
      .send(newItem);
    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.status).toBe('warning');

    // Update stock to safe level (10 kg > 5 kg min)
    const updateRes = await request(app)
      .put(`/api/inventory/${testItemId}`)
      .send({ qty: 10, min: 5 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.status).toBe('ok');

    // Cleanup
    await request(app).delete(`/api/inventory/${testItemId}`);
  });
});
