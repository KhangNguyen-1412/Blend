const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, '') + '/api';
  }
  return '/api';
};

const API_BASE_URL = getBaseUrl();

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    let data;
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || `Lỗi phản hồi máy chủ (HTTP ${response.status})` };
    }

    if (!response.ok) {
      throw new Error(data.message || `Lỗi kết nối máy chủ (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  forgotPassword: (data) => request('/auth/forgot-password', { method: 'POST', body: data })
};

export const categoriesApi = {
  getAll: () => request('/categories'),
  getById: (id) => request(`/categories/${id}`),
  create: (data) => request('/categories', { method: 'POST', body: data }),
  update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
};

export const statsApi = {
  getOverview: () => request('/stats/overview')
};

export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/products/${id}`),
  create: (data) => request('/products', { method: 'POST', body: data }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

export const ordersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/orders/${id}`),
  create: (data) => request('/orders', { method: 'POST', body: data }),
  update: (id, data) => request(`/orders/${id}`, { method: 'PUT', body: data }),
  advanceStatus: (id) => request(`/orders/${id}/status`, { method: 'PATCH' }),
  refund: (id) => request(`/orders/${id}/refund`, { method: 'POST' }),
  delete: (id) => request(`/orders/${id}`, { method: 'DELETE' }),
};

export const inventoryApi = {
  getAll: () => request('/inventory'),
  getById: (id) => request(`/inventory/${id}`),
  create: (data) => request('/inventory', { method: 'POST', body: data }),
  update: (id, data) => request(`/inventory/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/inventory/${id}`, { method: 'DELETE' }),
  getDockets: () => request('/inventory/dockets'),
  createDocket: (data) => request('/inventory/dockets', { method: 'POST', body: data }),
};

export const customersApi = {
  getAll: () => request('/customers'),
  getById: (id) => request(`/customers/${id}`),
  create: (data) => request('/customers', { method: 'POST', body: data }),
  update: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/customers/${id}`, { method: 'DELETE' }),
};

export const promotionsApi = {
  getAll: () => request('/promotions'),
  getById: (id) => request(`/promotions/${id}`),
  create: (data) => request('/promotions', { method: 'POST', body: data }),
  update: (id, data) => request(`/promotions/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/promotions/${id}`, { method: 'DELETE' }),
};

export const staffApi = {
  getAll: () => request('/staff'),
  getById: (id) => request(`/staff/${id}`),
  create: (data) => request('/staff', { method: 'POST', body: data }),
  update: (id, data) => request(`/staff/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/staff/${id}`, { method: 'DELETE' }),
};

export const reportsApi = {
  getSummary: () => request('/reports/summary'),
  getExportUrl: (type = 'orders') => `/api/reports/export?type=${type}`,
  getExcelExportUrl: (type = 'full', date = '') => `/api/reports/export-excel?type=${type}${date ? `&date=${date}` : ''}`,
};

export const reservationsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reservations${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/reservations/${id}`),
  create: (data) => request('/reservations', { method: 'POST', body: data }),
  update: (id, data) => request(`/reservations/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),
};

export const suppliersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/suppliers${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/suppliers/${id}`),
  create: (data) => request('/suppliers', { method: 'POST', body: data }),
  update: (id, data) => request(`/suppliers/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/suppliers/${id}`, { method: 'DELETE' }),
};

export const articlesApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/articles${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/articles/${id}`),
  getBySlug: (slug) => request(`/articles/slug/${slug}`),
  create: (data) => request('/articles', { method: 'POST', body: data }),
  update: (id, data) => request(`/articles/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/articles/${id}`, { method: 'DELETE' }),
};


