import http from './http';

export const searchService = {
  search: async (query) => {
    const { data } = await http.get('/search/', { params: { q: query } });
    return data;
  },
};
