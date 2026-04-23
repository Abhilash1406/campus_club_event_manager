import api from './api';

export const submitFeedback = (data) => api.post('/feedback', data);
export const getEventFeedback = (eventId) => api.get(`/feedback/${eventId}`);
