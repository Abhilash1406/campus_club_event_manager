import api from './api';

export const getAllReports = () => api.get('/reports');
export const getOrganizerReports = () => api.get('/reports/organizer');
export const getEventReport = (eventId) => api.get(`/reports/event/${eventId}`);
