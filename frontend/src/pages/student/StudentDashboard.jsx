import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from './StudentLayout';
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { getApprovedEvents } from '../../services/eventService';
import { getMyRegistrations } from '../../services/registrationService';
import { getMyCertificates } from '../../services/certificateService';
import { registerForEvent } from '../../services/registrationService';
import toast from 'react-hot-toast';
import { Calendar, ListChecks, Award, PlusCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);

  useEffect(() => {
    Promise.all([
      getApprovedEvents(),
      getMyRegistrations(),
      getMyCertificates()
    ]).then(([e, r, c]) => {
      setEvents(e.data);
      setMyRegs(r.data);
      setCerts(c.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const isRegistered = (eventId) => myRegs.some(r => r.event?._id === eventId);

  const handleRegister = async (eventId) => {
    setRegistering(eventId);
    try {
      await registerForEvent(eventId);
      const r = await getMyRegistrations();
      setMyRegs(r.data);
      toast.success('Registered! Go to My Registrations to complete payment.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(null);
    }
  };

  const stats = [
    { label: 'Available Events', value: events.length, icon: <Calendar size={20} className="text-blue-600" />, to: '/student/dashboard' },
    { label: 'My Registrations', value: myRegs.length, icon: <ListChecks size={20} className="text-blue-600" />, to: '/student/registrations' },
    { label: 'Certificates', value: certs.length, icon: <Award size={20} className="text-blue-600" />, to: '/student/certificates' },
  ];

  return (
    <StudentLayout>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="page-subtitle">Discover events, register, and download your certificates.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="stat-card hover:shadow-sm transition-shadow flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              {s.icon}
            </div>
            <div>
              <p className="stat-value text-2xl">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Link to="/student/propose" className="btn-primary">
          <PlusCircle size={16} /> Propose an Event
        </Link>
        <Link to="/student/registrations" className="btn-secondary">
          <ListChecks size={16} /> My Registrations
        </Link>
      </div>

      {/* Approved Events */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
        {loading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <EmptyState
            icon={<Calendar size={40} />}
            title="No events available"
            description="Check back later for upcoming events."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                showActions={!isRegistered(event._id)}
                showStatus={false}
                onRegister={handleRegister}
                registering={registering === event._id}
              />
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
