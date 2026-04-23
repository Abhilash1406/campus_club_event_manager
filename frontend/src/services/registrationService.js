import api from './api';

export const registerForEvent = (eventId) => api.post('/registrations', { eventId });
export const simulatePayment = (id) => api.put(`/registrations/${id}/pay`);
export const getMyRegistrations = () => api.get('/registrations/my');
export const getEventParticipants = (eventId) => api.get(`/registrations/event/${eventId}`);
export const getEventParticipantsAdmin = (eventId) => api.get(`/registrations/admin/event/${eventId}`);
