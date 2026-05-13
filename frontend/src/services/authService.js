import http from './http';

export const authService = {
  login: async (credentials) => {
    const { data } = await http.post('/auth/login/', credentials);
    return data;
  },
  register: async (payload) => {
    const { data } = await http.post('/auth/register/', payload);
    return data;
  },
  getProfile: async () => {
    const { data } = await http.get('/auth/profile/');
    return data;
  },
  updateProfile: async (payload) => {
    const { data } = await http.patch('/auth/profile/', payload);
    return data;
  },
  getUsers: async (params = {}) => {
    const { data } = await http.get('/auth/users/', { params });
    return data;
  },
  createUser: async (payload) => {
    const { data } = await http.post('/auth/users/', payload);
    return data;
  },
};
