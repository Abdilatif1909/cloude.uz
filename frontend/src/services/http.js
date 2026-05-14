import axios from 'axios';

import { sessionStorageUtil } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

const http = axios.create({
  baseURL: API_BASE_URL,
});

http.interceptors.request.use((config) => {
  const token = sessionStorageUtil.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refresh = sessionStorageUtil.getRefreshToken();

    if (error.response?.status === 401 && refresh && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh });
        sessionStorageUtil.setSession({ access: data.access, refresh: data.refresh || refresh });
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return http(originalRequest);
      } catch (refreshError) {
        sessionStorageUtil.clearSession();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default http;
