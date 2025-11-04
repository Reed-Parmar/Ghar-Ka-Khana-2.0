type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

export class APIError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for auth
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);

  // Safely parse response as JSON when available; otherwise return text/empty
  const contentType = response.headers.get('content-type') || '';
  const raw = response.status !== 204 ? await response.text() : '';
  let data: any = null;
  if (raw) {
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = { error: raw };
      }
    } else {
      data = { error: raw };
    }
  }

  // Handle error responses with better message extraction
  if (!response.ok) {
    const fallbackByStatus = (status: number, statusText: string) => {
      switch (status) {
        case 400: return 'Bad request';
        case 401: return 'Unauthorized - please log in';
        case 403: return 'Forbidden - you do not have access';
        case 404: return 'Not found';
        case 405: return 'Method not allowed';
        case 408: return 'Request timeout';
        case 409: return 'Conflict';
        case 422: return 'Unprocessable entity';
        case 500: return 'Server error';
        case 502: return 'Bad gateway';
        case 503: return 'Service unavailable';
        default:  return statusText || `HTTP ${status}`;
      }
    };

    const message = (data && (data.error || data.message))
      || raw
      || fallbackByStatus(response.status, response.statusText);
    throw new APIError(message, response.status);
  }

  return data;
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    fetchAPI('/auth/login', {
      method: 'POST',
      body: { email, password },
    }).then(res => {
      if (!res.user) throw new Error('Invalid response format');
      return res;
    }),
  
  register: (userData: { name: string; email: string; password: string; role: string }) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: userData,
    }).then(res => {
      if (!res.user) throw new Error('Invalid response format');
      return res;
    }),
};

// Meals API
export const mealsAPI = {
  listAll: () => fetchAPI('/meals'),
  
  getById: (id: string) => fetchAPI(`/meals/${id}`),
  
  getChefMeals: (chefId: string) => fetchAPI(`/meals/chef/${chefId}`),
  
  create: (mealData: any) =>
    fetchAPI('/meals', {
      method: 'POST',
      body: mealData,
    }),
  
  delete: (id: string) =>
    fetchAPI(`/meals/${id}`, {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersAPI = {
  placeOrder: (orderData: any) =>
    fetchAPI('/orders/place', {
      method: 'POST',
      body: orderData,
    }),
  
  getUserOrders: (userId: string) => 
    fetchAPI(`/orders/user/${userId}`),
  
  getChefOrders: (chefId: string) =>
    fetchAPI(`/orders/chef/${chefId}`),
  
  updateStatus: (orderId: string, status: string) =>
    fetchAPI(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status },
    }),
};

// Admin API
export const adminAPI = {
  getUsers: () => fetchAPI('/admin/users'),
  
  getChefs: () => fetchAPI('/admin/chefs'),
  
  getOrders: () => fetchAPI('/admin/orders'),
  
  getStats: () => fetchAPI('/admin/stats'),
  
  approveChef: (chefId: string) =>
    fetchAPI(`/admin/chefs/${chefId}/approval`, {
      method: 'POST',
    }),
  
  deleteUser: (userId: string) =>
    fetchAPI(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),
};

// Users API
export const usersAPI = {
  list: () => fetchAPI('/users'),
  
  getById: (id: string) => fetchAPI(`/users/${id}`),
  
  update: (id: string, userData: any) =>
    fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: userData,
    }),
};