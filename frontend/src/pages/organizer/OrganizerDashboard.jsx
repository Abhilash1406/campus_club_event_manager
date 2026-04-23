import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrganizerLayout from './OrganizerLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { getOrganizerPendingEvents, getOrganizerAllEvents } from '../../services/eventService';
import { getOrganizerReports } from '../../services/reportService';
import { statusBadge } from '../../components/EventCard';
import { format } from 'date-fns';
import { Clock, List, BarChart2, Tag, Calendar } from 'lucide-react';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getOrganizerPendingEvents(),
      getOrganizerAllEvents(),
      getOrganizerReports()
    ]).then(([p, a, r]) => {
      setPending(p.data);
      setAllEvents(a.data);
      setReports(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalRevenue = reports.reduce((s, r) => s + (r.revenue || 0), 0);
  const totalParticipants = reports.reduce((s, r) => s + (r.totalRegistrations || 0), 0);

  const stats = [
    { label: 'Pending Reviews', value: pending.length, icon: <Clock size={20} className="text-yellow-600" />, to: '/organizer/pending', color: 'bg-yellow-50' },
    { label: 'Total Events', value: allEvents.length, icon: <List size={20} className="text-blue-600" />, to: '/organizer/events', color: 'bg-blue-50' },
    { label: 'Total Participants', value: totalParticipants, icon: <BarChart2 size={20} className="text-green-600" />, to: '/organizer/reports', color: 'bg-green-50' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <BarChart2 size={20} className="text-purple-600" />, to: '/organizer/reports', color: 'bg-purple-50' },
  ];

  return (
    <OrganizerLayout>
      <div className="page-header">
        <h1 className="page-title">Organizer Dashboard</h1>
        <p className="page-subtitle">
          {user?.club?.name} — Manage your club events and track participation.
        </p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((s) => (
              <Link key={s.label} to={s.to} className="stat-card hover:shadow-sm transition-shadow flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pending Events */}
          {pending.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Pending Approvals</h2>
                <Link to="/organizer/pending" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {pending.slice(0, 3).map((ev) => (
                  <div key={ev._id} className="card !p-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Tag size={10} />{ev.club?.name}</span>
                        {statusBadge(ev.status)}
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate">{ev.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5"><Calendar size={10} className="inline mr-1" />{format(new Date(ev.date), 'dd MMM yyyy')}</p>
                    </div>
                    <Link to="/organizer/pending" className="btn-primary !py-1.5 !px-3 text-xs flex-shrink-0">Review</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Recent Club Events</h2>
              <Link to="/organizer/events" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            {allEvents.length === 0 ? (
              <p className="text-sm text-gray-400">No events yet for your club.</p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allEvents.slice(0, 5).map((ev) => (
                      <tr key={ev._id}>
                        <td className="font-medium text-gray-900">{ev.title}</td>
                        <td>{format(new Date(ev.date), 'dd MMM yyyy')}</td>
                        <td>{statusBadge(ev.status)}</td>
                        <td>
                          {ev.status === 'approved' && (
                            <Link to={`/organizer/participants/${ev._id}`} className="text-blue-600 text-xs hover:underline">Participants</Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </OrganizerLayout>
  );
};

export default OrganizerDashboard;
