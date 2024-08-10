import axios from 'axios';

const API_URL = 'https://laptop-483nic2i.tail7526d.ts.net';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google`;
};

export const getProfile = () => api.get('/profile');

export const logout = () => api.get('/logout');

export const postData = (data) => api.post('/data', data);

export const getSessionData = () => api.get('/session-data');