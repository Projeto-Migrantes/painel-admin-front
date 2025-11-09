import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// Configura API REST 
// Build base API URL: if env var already contains a path like /api or /api/v2, use it as-is
const buildApiBaseUrl = () => {
  const raw = process.env.API_URL || 'http://localhost:3000';
  const trimmed = raw.replace(/\/$/, '');
  // If the URL already contains '/api', assume it's already pointed at the API path
  if (/\/api(\/|$)/.test(trimmed)) {
    return trimmed;
  }
  // Otherwise append the default API base path used by the OpenAPI spec
  return `${trimmed}/api/v2`;
};

export const api = axios.create({
    baseURL: buildApiBaseUrl(),
    timeout: 20000,
    headers: {
      'x-private-key': process.env.SECRET_KEY 
  },
});

// Nova função: cria instância axios com Authorization (Bearer token)
export const apiWithToken = (token) => {
  return axios.create({
    baseURL: buildApiBaseUrl(),
    timeout: 20000,
    headers: {
      'x-private-key': process.env.SECRET_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export default {
  apiUrl: process.env.API_URL,
  port: process.env.PORT || 3040,
};
