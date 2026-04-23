import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getEvent } from '../services/eventService';
import { registerForEvent, getMyRegistrations } from '../services/registrationService';
import EventFeedback from '../components/EventFeedback';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Tag, IndianRupee, ArrowLeft } from 'lucide-react';
import { statusBadge } from '../components/EventCard';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    getEvent(id).then(r => setEvent(r.data)).catch(() => toast.error('Event not found')).finally(() => setLoading(false));
    
    if (user?.role === 'student') {
      getMyRegistrations()
        .then(r => {
          const registered = r.data.some(reg => reg.event?._id === id);
          setIsRegistered(registered);
        })
        .catch(() => {});
    }
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'student') { toast.error('Only students can register'); return; }
    setRegistering(true);
    try {
      await registerForEvent(event._id);
      toast.success('Registered successfully! Complete payment in My Registrations.');
      navigate('/student/registrations');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white"><Navbar /><LoadingSpinner /></div>;
  if (!event) return <div className="min-h-screen bg-white"><Navbar /><p className="p-8 text-gray-500">Event not found.</p></div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                <Tag size={11} /> {event.club?.name}
              </span>
              {statusBadge(event.status)}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <Calendar size={20} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Date</p>
                  <p className="text-sm font-semibold text-gray-800">{format(new Date(event.date), 'dd MMM yyyy')}</p>
                </div>
              </div>
              {event.venue && (
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <MapPin size={20} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Venue</p>
                    <p className="text-sm font-semibold text-gray-800">{event.venue}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <Users size={20} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Capacity</p>
                  <p className="text-sm font-semibold text-gray-800">{event.maxParticipants} participants</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <IndianRupee size={20} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Entry Fee</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}
              </p>
              <p className="text-sm text-gray-400 mb-5">per participant</p>

              {event.status === 'approved' ? (
                <button
                  onClick={handleRegister}
                  disabled={registering || !user || user?.role !== 'student'}
                  className="btn-primary w-full justify-center !py-3"
                >
                  {registering ? 'Registering...' : 'Register Now'}
                </button>
              ) : (
                <button disabled className="btn-primary w-full justify-center !py-3 opacity-50 cursor-not-allowed">
                  Registration Closed
                </button>
              )}

              {!user && <p className="text-xs text-center text-gray-400 mt-3">Please <a href="/login" className="text-blue-600 hover:underline">login</a> to register</p>}
              {user?.role === 'organizer' && <p className="text-xs text-center text-gray-400 mt-3">Organizers cannot register for events</p>}

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Organized by</span>
                  <span className="font-medium text-gray-800">{event.createdBy?.name}</span>
                </div>
                {event.budget > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium text-gray-800">₹{event.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="lg:col-span-3">
          <EventFeedback eventId={id} isRegistered={isRegistered} />
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
