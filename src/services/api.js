const API_URL = import.meta.env.VITE_BACKEND_URL || '/api';

function getToken() {
  return localStorage.getItem('calendar_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();

  // Handle FormData differently (don't set Content-Type header)
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers &&
      !isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

function buildQuery(params = {}) {
  const definedEntries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null,
  );
  if (!definedEntries.length) return '';
  const searchParams = new URLSearchParams();
  definedEntries.forEach(([key, value]) => searchParams.append(key, value));
  return `?${searchParams.toString()}`;
}

export const eventsApi = {
  getAll: ({ cityId, city, lang } = {}) => {
    const params = {
      ...(cityId && cityId !== 'all' ? { cityId } : {}),
      ...(city && city !== 'all' ? { city } : {}),
      ...(lang ? { lang } : {}),
    };
    return request(`/events${buildQuery(params)}`);
  },

  getById: (id, { lang } = {}) =>
    request(`/events/${id}${buildQuery({ lang })}`),

  getCities: () => request('/events/cities'),

  getStatuses: () => request('/events/statuses'),

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

  uploadImage: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return request('/events/upload-image', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

export default { authApi, eventsApi };
