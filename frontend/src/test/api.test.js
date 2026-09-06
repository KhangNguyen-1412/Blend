import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { categoriesApi, productsApi, authApi } from '../services/api';

describe('Frontend API Client Service', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('categoriesApi.getAll calls /api/categories with GET', async () => {
    const mockCategories = [{ id: 1, name: 'Cà phê' }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: mockCategories })
    });

    const result = await categoriesApi.getAll();
    expect(global.fetch).toHaveBeenCalledWith('/api/categories', expect.objectContaining({
      headers: expect.objectContaining({ 'Content-Type': 'application/json' })
    }));
    expect(result.data).toEqual(mockCategories);
  });

  it('productsApi.getAll appends query params correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: [] })
    });

    await productsApi.getAll({ category: 'Cà phê', search: 'Espresso' });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/products?category=C%C3%A0+ph%C3%AA&search=Espresso',
      expect.anything()
    );
  });

  it('authApi.login sends POST with credentials payload', async () => {
    const credentials = { username: 'admin_khang', password: 'secretpassword' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: { token: 'mock_token' } })
    });

    const result = await authApi.login(credentials);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(credentials)
      })
    );
    expect(result.data.token).toBe('mock_token');
  });

  it('throws structured error message on non-200 HTTP response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ success: false, message: 'Sai thông tin đăng nhập' })
    });

    await expect(authApi.login({ username: 'foo', password: 'bar' }))
      .rejects.toThrow('Sai thông tin đăng nhập');
  });
});
