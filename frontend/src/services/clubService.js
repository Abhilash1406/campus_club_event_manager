import api from './api';

export const getClubs = () => api.get('/clubs');
export const getClub = (id) => api.get(`/clubs/${id}`);
export const createClub = (data) => api.post('/clubs', data);
export const updateClub = (id, data) => api.put(`/clubs/${id}`, data);
export const deleteClub = (id) => api.delete(`/clubs/${id}`);
