/**
 * Axios API service — single source of truth for all backend calls.
 * Base URL points to Flask backend on port 5000.
 */

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// ── Attach JWT token to every request (if available) ──────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Health Records CRUD ───────────────────────────────────────

/** Add a new health record */
export const addRecord = (data) => API.post('/add', data);

/** Get all records sorted by date */
export const getRecords = () => API.get('/records');

/** Update a record by ID */
export const updateRecord = (id, data) => API.put(`/update/${id}`, data);

/** Delete a record by ID */
export const deleteRecord = (id) => API.delete(`/delete/${id}`);

// ── Analytics ─────────────────────────────────────────────────

/** Get summary statistics */
export const getStats = () => API.get('/stats');

/** Get ML predictions for next 7 days */
export const getPredictions = () => API.get('/predict');

// ── CSV Export ────────────────────────────────────────────────

/** Download records as CSV */
export const exportCSV = () =>
  API.get('/export/csv', { responseType: 'blob' });

// ── Authentication ────────────────────────────────────────────

/** Sign up a new user */
export const signup = (data) => API.post('/auth/signup', data);

/** Log in an existing user */
export const login = (data) => API.post('/auth/login', data);

export default API;
