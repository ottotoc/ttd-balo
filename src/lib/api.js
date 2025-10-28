// API client for FoodMart backend
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Generic API call helper
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include', // Important for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses (like 204 No Content)
    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ========== AUTH ==========
export const auth = {
  register: (data) => apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  login: (data) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  logout: () => apiCall('/api/auth/logout', { method: 'POST' }),
  
  me: () => apiCall('/api/auth/me'),
  
  refresh: () => apiCall('/api/auth/refresh', { method: 'POST' }),
};

// ========== PRODUCTS ==========
export const products = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/api/products${query ? '?' + query : ''}`);
  },
  
  getBySlug: (slug) => apiCall(`/api/products/${slug}`),
  
  create: (data) => apiCall('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/api/products/${id}`, { method: 'DELETE' }),
};

// ========== CART ==========
export const cart = {
  get: () => apiCall('/api/cart'),
  
  addItem: (data) => apiCall('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateItem: (id, data) => apiCall(`/api/cart/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  removeItem: (id) => apiCall(`/api/cart/items/${id}`, { method: 'DELETE' }),
  
  clear: () => apiCall('/api/cart', { method: 'DELETE' }),
};

// ========== ORDERS ==========
export const orders = {
  create: (data) => apiCall('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/api/orders${query ? '?' + query : ''}`);
  },
  
  getById: (id) => apiCall(`/api/orders/${id}`),
  
  updateStatus: (id, status, adminNotes) => apiCall(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, adminNotes }),
  }),
  
  confirmPayment: (id) => apiCall(`/api/orders/${id}/confirm-payment`, {
    method: 'POST',
  }),
};

// ========== DISCOUNTS ==========
export const discounts = {
  validate: (code, cartTotal) => apiCall('/api/discounts/validate', {
    method: 'POST',
    body: JSON.stringify({ code, cartTotal }),
  }),
  
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/api/discounts${query ? '?' + query : ''}`);
  },
  
  create: (data) => apiCall('/api/discounts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/api/discounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/api/discounts/${id}`, { method: 'DELETE' }),
};

// ========== REVIEWS ==========
export const reviews = {
  getProductReviews: (productId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/api/reviews/products/${productId}${query ? '?' + query : ''}`);
  },
  
  create: (productId, data) => apiCall(`/api/reviews/products/${productId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/api/reviews${query ? '?' + query : ''}`);
  },
  
  approve: (id) => apiCall(`/api/reviews/${id}/approve`, { method: 'PATCH' }),
  
  delete: (id) => apiCall(`/api/reviews/${id}`, { method: 'DELETE' }),
};

// ========== PUBLIC DATA ==========
export const catalog = {
  getCategories: () => apiCall('/api/categories'),
  getBrands: () => apiCall('/api/brands'),
  getTags: () => apiCall('/api/tags'),
  getBanners: (position) => {
    const query = position ? `?position=${position}` : '';
    return apiCall(`/api/banners${query}`);
  },
};

// ========== ANNOUNCEMENTS ==========
export const announcements = {
  getActive: () => apiCall('/api/announcements/active'),
};

// ========== TIKTOK VIDEOS ==========
export const tiktokVideos = {
  getActive: () => apiCall('/api/tiktok-videos/active'),
};

export const blog = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/api/blog${query ? '?' + query : ''}`);
  },
  
  getPublished: (limit) => {
    const query = limit ? `?limit=${limit}` : '';
    return apiCall(`/api/blog/published${query}`);
  },
  
  getBySlug: (slug) => apiCall(`/api/blog/${slug}`),
  
  getById: (id) => apiCall(`/api/blog/id/${id}`),
  
  create: (data) => apiCall('/api/blog', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/api/blog/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/api/blog/${id}`, { method: 'DELETE' }),
};

// ========== ADMIN ==========
export const admin = {
  // Categories
  categories: {
    getAll: () => apiCall('/api/admin/categories'),
    create: (data) => apiCall('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiCall(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiCall(`/api/admin/categories/${id}`, { method: 'DELETE' }),
  },
  
  // Brands
  brands: {
    getAll: () => apiCall('/api/admin/brands'),
    create: (data) => apiCall('/api/admin/brands', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiCall(`/api/admin/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiCall(`/api/admin/brands/${id}`, { method: 'DELETE' }),
  },
  
  // Tags
  tags: {
    getAll: () => apiCall('/api/admin/tags'),
    create: (data) => apiCall('/api/admin/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiCall(`/api/admin/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiCall(`/api/admin/tags/${id}`, { method: 'DELETE' }),
  },
  
  // Banners
  banners: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiCall(`/api/admin/banners${query ? '?' + query : ''}`);
    },
    create: (data) => apiCall('/api/admin/banners', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiCall(`/api/admin/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiCall(`/api/admin/banners/${id}`, { method: 'DELETE' }),
  },
  
  // Blog
  blog: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiCall(`/api/admin/blog${query ? '?' + query : ''}`);
    },
    getBySlug: (slug) => apiCall(`/api/admin/blog/${slug}`),
    create: (data) => apiCall('/api/admin/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiCall(`/api/admin/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiCall(`/api/admin/blog/${id}`, { method: 'DELETE' }),
  },
  
  // Announcements
  announcements: {
    getAll: () => apiCall('/api/announcements'),
    getById: (id) => apiCall(`/api/announcements/${id}`),
    create: (data) => apiCall('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiCall(`/api/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiCall(`/api/announcements/${id}`, { method: 'DELETE' }),
  },
  
  // TikTok Videos
  tiktokVideos: {
    getAll: () => apiCall('/api/tiktok-videos'),
    getById: (id) => apiCall(`/api/tiktok-videos/${id}`),
    create: (data) => apiCall('/api/tiktok-videos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => apiCall(`/api/tiktok-videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => apiCall(`/api/tiktok-videos/${id}`, { method: 'DELETE' }),
  },
};

// ========== UPLOADS ==========
export const uploads = {
  getSignedUrl: (filename, contentType) => apiCall('/api/uploads/signed-url', {
    method: 'POST',
    body: JSON.stringify({ filename, contentType }),
  }),
  
  deleteFile: (objectName) => apiCall('/api/uploads/file', {
    method: 'DELETE',
    body: JSON.stringify({ objectName }),
  }),
};

export default {
  auth,
  products,
  cart,
  orders,
  discounts,
  reviews,
  catalog,
  blog,
  admin,
  uploads,
  announcements,
  tiktokVideos,
};

