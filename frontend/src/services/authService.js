import api from './api';

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const googleLogin = (data) => api.post('/auth/google', data);
export const verifyOTP = (data) => api.post('/auth/verify-otp', data);
export const getMe = () => api.get('/auth/me');
