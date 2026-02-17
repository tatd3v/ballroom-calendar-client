const API_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('calendar_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request('/auth/me'),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

function buildQuery(params = {}) {
  const definedEntries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  if (!definedEntries.length) return ''
  const searchParams = new URLSearchParams()
  definedEntries.forEach(([key, value]) => searchParams.append(key, value))
  return `?${searchParams.toString()}`
}

export const eventsApi = {
  getAll: ({ city, lang } = {}) => {
    const params = {
      ...(city && city !== 'all' ? { city } : {}),
      ...(lang ? { lang } : {}),
    }
    return request(`/events${buildQuery(params)}`)
  },

  getById: (id, { lang } = {}) => request(`/events/${id}${buildQuery({ lang })}`),

  getCities: () => request('/events/cities'),

  create: (eventData) =>
    request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  update: (id, eventData) =>
    request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),

  delete: (id) =>
    request(`/events/${id}`, {
      method: 'DELETE',
    }),
};

export default { authApi, eventsApi };
