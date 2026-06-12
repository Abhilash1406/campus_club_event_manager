import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import EventDetail from './pages/EventDetail';
import ClubsPage from './pages/ClubsPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyRegistrations from './pages/student/MyRegistrations';
import ProposeEvent from './pages/student/ProposeEvent';
import MyCertificates from './pages/student/MyCertificates';

// Organizer pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerPendingEvents from './pages/organizer/OrganizerPendingEvents';
import OrganizerAllEvents from './pages/organizer/OrganizerAllEvents';
import OrganizerParticipants from './pages/organizer/OrganizerParticipants';
import OrganizerReports from './pages/organizer/OrganizerReports';
import OrganizerCertificates from './pages/organizer/OrganizerCertificates';
import OrganizerFeedback from './pages/organizer/OrganizerFeedback';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminPendingEvents from './pages/admin/AdminPendingEvents';
import AdminUsers from './pages/admin/AdminUsers';
import AdminClubs from './pages/admin/AdminClubs';
import AdminReports from './pages/admin/AdminReports';

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
  if (user.role === 'organizer') return <Navigate to="/organizer/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* Student */}
          <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/registrations" element={<ProtectedRoute roles={['student']}><MyRegistrations /></ProtectedRoute>} />
          <Route path="/student/propose" element={<ProtectedRoute roles={['student']}><ProposeEvent /></ProtectedRoute>} />
          <Route path="/student/certificates" element={<ProtectedRoute roles={['student']}><MyCertificates /></ProtectedRoute>} />

          {/* Organizer */}
          <Route path="/organizer/dashboard" element={<ProtectedRoute roles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="/organizer/pending" element={<ProtectedRoute roles={['organizer']}><OrganizerPendingEvents /></ProtectedRoute>} />
          <Route path="/organizer/events" element={<ProtectedRoute roles={['organizer']}><OrganizerAllEvents /></ProtectedRoute>} />
          <Route path="/organizer/participants/:eventId" element={<ProtectedRoute roles={['organizer']}><OrganizerParticipants /></ProtectedRoute>} />
          <Route path="/organizer/feedback/:eventId" element={<ProtectedRoute roles={['organizer']}><OrganizerFeedback /></ProtectedRoute>} />
          <Route path="/organizer/reports" element={<ProtectedRoute roles={['organizer']}><OrganizerReports /></ProtectedRoute>} />
          <Route path="/organizer/certificates" element={<ProtectedRoute roles={['organizer']}><OrganizerCertificates /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute roles={['admin']}><AdminEvents /></ProtectedRoute>} />
          <Route path="/admin/pending" element={<ProtectedRoute roles={['admin']}><AdminPendingEvents /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/clubs" element={<ProtectedRoute roles={['admin']}><AdminClubs /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminReports /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
