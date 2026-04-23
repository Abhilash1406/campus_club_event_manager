import api from './api';

export const generateCertificates = (eventId) => api.post(`/certificates/generate/${eventId}`);
export const getMyCertificates = () => api.get('/certificates/my');
export const getEventCertificates = (eventId) => api.get(`/certificates/event/${eventId}`);
