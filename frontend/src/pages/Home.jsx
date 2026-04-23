import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getApprovedEvents } from '../services/eventService';
import { getClubs } from '../services/clubService';
import { ArrowRight, Calendar, Users, Award, Shield } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    getApprovedEvents().then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoadingEvents(false));
    getClubs().then(r => setClubs(r.data)).catch(() => {}).finally(() => setLoadingClubs(false));
  }, []);

  const stats = [
    { label: 'Active Clubs', value: clubs.length || '10+' },
    { label: 'Events Hosted', value: '50+' },
    { label: 'Students Enrolled', value: '2000+' },
    { label: 'Certificates Issued', value: '1500+' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
            Internal Campus Platform
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Discover & Participate in<br />
            <span className="text-blue-600">Campus Club Events</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            Explore events from all campus clubs, register with ease, and track your participation — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary text-base !px-7 !py-3">
              Get Started <ArrowRight size={17} />
            </Link>
            <Link to="#events" className="btn-secondary text-base !px-7 !py-3">
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-blue-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs */}
      <section className="py-16 border-b border-gray-100" id="clubs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Campus Clubs</h2>
              <p className="text-sm text-gray-500 mt-1">Join a club that matches your interests</p>
            </div>
            <Link to="/clubs" className="btn-secondary !py-2 !px-4 text-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loadingClubs ? (
            <LoadingSpinner message="Loading clubs..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {clubs.map((club) => (
                <div key={club._id} className="card hover:shadow-md transition-shadow duration-200">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Award size={20} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{club.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{club.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Approved Events */}
      <section className="py-16" id="events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-sm text-gray-500 mt-1">Register now and secure your spot</p>
          </div>
          {loadingEvents ? (
            <LoadingSpinner message="Loading events..." />
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming events at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} showActions={false} showStatus={false} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Users size={24} className="text-blue-600" />, title: 'Register', desc: 'Create your account and join the campus event platform.' },
              { icon: <Calendar size={24} className="text-blue-600" />, title: 'Discover Events', desc: 'Browse approved events from all campus clubs.' },
              { icon: <Award size={24} className="text-blue-600" />, title: 'Earn Certificates', desc: 'Participate and download your event certificates.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield size={36} className="text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to get involved?</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">Join hundreds of students who are already participating in campus events.</p>
          <Link to="/register" className="btn-primary !px-8 !py-3 text-base">
            Create Account <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">© 2024 CampusEvents. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">Home</Link>
            <Link to="/clubs" className="text-sm text-gray-400 hover:text-gray-600">Clubs</Link>
            <Link to="/login" className="text-sm text-gray-400 hover:text-gray-600">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
