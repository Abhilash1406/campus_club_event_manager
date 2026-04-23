import api from './api';

export const getApprovedEvents = () => api.get('/events/approved');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const getMyProposals = () => api.get('/events/my-proposals');

// Organizer
export const getOrganizerPendingEvents = () => api.get('/events/organizer/pending');
export const getOrganizerAllEvents = () => api.get('/events/organizer/all');
export const organizerApprove = (id) => api.put(`/events/${id}/organizer-approve`);
export const organizerReject = (id, reason) => api.put(`/events/${id}/organizer-reject`, { reason });
export const uploadCertificateTemplate = (id, formData) =>
  api.put(`/events/${id}/certificate-template`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Admin
export const getAdminPendingEvents = () => api.get('/events/admin/pending');
export const getAllEventsAdmin = () => api.get('/events/admin/all');
export const adminApprove = (id, data) => api.put(`/events/${id}/admin-approve`, data);
export const adminReject = (id, reason) => api.put(`/events/${id}/admin-reject`, { reason });
