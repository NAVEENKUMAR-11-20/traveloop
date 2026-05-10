const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('traveloop_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

// ─── Authentication ──────────────────────────────────────────
export async function loginUser(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signupUser(name, email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function googleLogin(tokenId) {
  return request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ tokenId }),
  });
}

// ─── Trips ───────────────────────────────────────────────────
export async function createTrip(tripData) {
  return request('/trips', {
    method: 'POST',
    body: JSON.stringify(tripData),
  });
}

export async function getTrips() {
  return request('/trips');
}

export async function updateTrip(id, updates) {
  return request(`/trips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteTrip(id) {
  return request(`/trips/${id}`, { method: 'DELETE' });
}

// ─── Cities & Activities ─────────────────────────────────────
export async function getCities(query = '') {
  return request(`/cities?q=${encodeURIComponent(query)}`);
}

export async function getActivities(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return request(`/activities?${params}`);
}

// ─── Itinerary ───────────────────────────────────────────────
export async function saveItinerary(tripId, itinerary) {
  return request(`/trips/${tripId}/itinerary`, {
    method: 'PUT',
    body: JSON.stringify({ itinerary }),
  });
}

// ─── Budget ──────────────────────────────────────────────────
export async function getBudget(tripId) {
  return request(`/trips/${tripId}/budget`);
}

// ─── Checklist ───────────────────────────────────────────────
export async function saveChecklist(tripId, checklist) {
  return request(`/trips/${tripId}/checklist`, {
    method: 'PUT',
    body: JSON.stringify({ checklist }),
  });
}

// ─── Notes / Journal ─────────────────────────────────────────
export async function saveNotes(tripId, notes) {
  return request(`/trips/${tripId}/notes`, {
    method: 'PUT',
    body: JSON.stringify({ notes }),
  });
}

// ─── Admin ───────────────────────────────────────────────────
export async function getAdminAnalytics() {
  return request('/admin/analytics');
}
