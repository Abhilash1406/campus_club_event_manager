import api from './api';

/**
 * Fetch real-time platform statistics from the backend.
 * Calls GET /api/stats which returns:
 *  - totalUsers          : number of registered users
 *  - totalEvents         : number of approved events
 *  - totalRegistrations  : total registrations across all events
 *  - totalCertificates   : total certificates issued (0 if none yet)
 *
 * @returns {Promise<AxiosResponse>} Axios response with the stats object
 */
export const getStats = () => api.get('/stats');
