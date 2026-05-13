import http from './http';

export const testService = {
  getTests: async (params = {}) => (await http.get('/tests/', { params })).data,
  createTest: async (payload) => (await http.post('/tests/', payload)).data,
  getTestById: async (id) => (await http.get(`/tests/${id}/`)).data,
  updateTest: async (id, payload) => (await http.put(`/tests/${id}/`, payload)).data,
  deleteTest: async (id) => (await http.delete(`/tests/${id}/`)).data,
  getTestStart: async (id) => (await http.get(`/tests/${id}/start/`)).data,
  submitTest: async (id, payload) => (await http.post(`/tests/${id}/submit/`, payload)).data,
  createQuestion: async (payload) => (await http.post('/questions/', payload)).data,
  updateQuestion: async (id, payload) => (await http.put(`/questions/${id}/`, payload)).data,
  deleteQuestion: async (id) => (await http.delete(`/questions/${id}/`)).data,
  getResults: async (params = {}) => (await http.get('/results/', { params })).data,
  getResultById: async (id) => (await http.get(`/results/${id}/`)).data,
  getTeacherResults: async () => (await http.get('/tests/teacher_results/')).data,
};
