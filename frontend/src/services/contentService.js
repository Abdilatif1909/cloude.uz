import http from './http';

const formHeaders = { headers: { 'Content-Type': 'multipart/form-data' } };

export const contentService = {
  getLectures: async (params = {}) => (await http.get('/lectures/', { params })).data,
  getPracticals: async (params = {}) => (await http.get('/practicals/', { params })).data,
  getBooks: async (params = {}) => (await http.get('/books/', { params })).data,
  uploadLecture: async (formData) => (await http.post('/lectures/', formData, formHeaders)).data,
  uploadPractical: async (formData) => (await http.post('/practicals/', formData, formHeaders)).data,
  uploadBook: async (formData) => (await http.post('/books/', formData, formHeaders)).data,
};
