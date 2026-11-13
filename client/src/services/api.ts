const API_BASE = '/api';

export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('localroots_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.error || 'Network response was not ok', response.status);
  }

  return data;
}

export const api = {
  // Public
  getCategories: () => request<{ success: boolean; data: any[] }>('/categories'),
  getProducts: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          query.append(k, String(v));
        }
      });
    }
    const qs = query.toString();
    return request<{ success: boolean; count: number; data: any[] }>(`/products${qs ? `?${qs}` : ''}`);
  },
  getProductById: (id: string) => request<{ success: boolean; data: any }>(`/products/${id}`),
  getSellers: () => request<{ success: boolean; count: number; data: any[] }>('/sellers'),
  getSellerBySlug: (slug: string) => request<{ success: boolean; data: any }>(`/sellers/${slug}`),
  getSellerProducts: (slug: string) => request<{ success: boolean; count: number; data: any[] }>(`/sellers/${slug}/products`),

  // Checkout & Validation
  validateCheckout: (items: Array<{ productId: string; quantity: number }>, pinCode: string) =>
    request<{ success: boolean; allValid: boolean; items: any[]; sellerSummaries: any[] }>('/checkout/validate', {
      method: 'POST',
      body: JSON.stringify({ items, pinCode }),
    }),
  createOrder: (orderPayload: any) =>
    request<{ success: boolean; message: string; orderReference: string; trackingOtp: string; order: any }>('/checkout', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    }),

  // Order Tracking
  requestTrackingOtp: (orderReference: string) =>
    request<{ success: boolean; message: string; maskedPhone?: string; orderReference: string }>('/orders/track', {
      method: 'POST',
      body: JSON.stringify({ orderReference }),
    }),
  verifyTrackingOtp: (orderReference: string, otp: string) =>
    request<{ success: boolean; data: any }>('/orders/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ orderReference, otp }),
    }),

  // Payments
  createPaymentOrder: (orderReference: string, amount: number) =>
    request<{ success: boolean; data: any }>('/payments/create', {
      method: 'POST',
      body: JSON.stringify({ orderReference, amount }),
    }),
  verifyPaymentSignature: (paymentData: any) =>
    request<{ success: boolean; message: string; paymentStatus: string }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
  getPaymentArchitecture: () => request<any>('/payments/architecture'),

  // Seller Auth & Portal
  sellerRegister: (payload: any) =>
    request<{ success: boolean; token: string; seller: any }>('/seller/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  sellerLogin: (credentials: { email: string; password?: string }) =>
    request<{ success: boolean; token: string; seller: any }>('/seller/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getSellerProfile: () => request<{ success: boolean; data: any }>('/seller/profile'),
  updateSellerProfile: (profile: any) =>
    request<{ success: boolean; message: string; data: any }>('/seller/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),
  getSellerOwnProducts: () => request<{ success: boolean; count: number; data: any[] }>('/seller/products'),
  createSellerProduct: (productData: any) =>
    request<{ success: boolean; message: string; data: any }>('/seller/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
  updateSellerProduct: (id: string, productData: any) =>
    request<{ success: boolean; message: string; data: any }>(`/seller/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),
  deleteSellerProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/seller/products/${id}`, {
      method: 'DELETE',
    }),
  getSellerOrders: () => request<{ success: boolean; count: number; data: any[] }>('/seller/orders'),
  updateSuborderStatus: (id: string, status: string, reason?: string) =>
    request<{ success: boolean; message: string; data: any }>(`/seller/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    }),
  getSellerDeliveryAreas: () => request<{ success: boolean; data: any[] }>('/seller/delivery-areas'),
  addSellerDeliveryArea: (area: any) =>
    request<{ success: boolean; message: string; data: any }>('/seller/delivery-areas', {
      method: 'POST',
      body: JSON.stringify(area),
    }),
  deleteSellerDeliveryArea: (id: string) =>
    request<{ success: boolean; message: string }>(`/seller/delivery-areas/${id}`, {
      method: 'DELETE',
    }),
  getSellerAnalytics: () => request<{ success: boolean; data: any }>('/seller/analytics'),

  // Admin Portal
  adminLogin: (credentials: { email: string; password?: string }) =>
    request<{ success: boolean; token: string; admin: any }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getAdminDashboard: () => request<{ success: boolean; data: any }>('/admin/dashboard'),
  getAdminSellers: () => request<{ success: boolean; count: number; data: any[] }>('/admin/sellers'),
  updateAdminSellerStatus: (id: string, isApproved: boolean, isActive?: boolean) =>
    request<{ success: boolean; message: string; data: any }>(`/admin/sellers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isApproved, isActive }),
    }),
  getAdminProducts: () => request<{ success: boolean; count: number; data: any[] }>('/admin/products'),
  deleteAdminProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    }),
  getAdminOrders: () => request<{ success: boolean; count: number; data: any[] }>('/admin/orders'),
};
