import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllEventsAdmin, getAdminPendingEvents } from '../../services/eventService';
import { getAllUsers } from '../../services/userService';
import { getClubs } from '../../services/clubService';
import { getAllReports } from '../../services/reportService';
import { statusBadge } from '../../components/EventCard';
import { format } from 'date-fns';
import { Clock, List, Users, Building2, IndianRupee, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminPendingEvents(),
      getAllEventsAdmin(),
      getAllUsers(),
      getClubs(),
      getAllReports()
    ]).then(([p, a, u, c, r]) => {
      setPending(p.data);
      setAllEvents(a.data);
      setUsers(u.data);
      setClubs(c.data);
      setReports(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalRevenue = reports.reduce((s, r) => s + r.revenue, 0);
  const approvedEvents = allEvents.filter(e => e.status === 'approved').length;

  const stats = [
    { label: 'Pending Reviews', value: pending.length, icon: <Clock size={20} className="text-yellow-600" />, to: '/admin/pending', color: 'bg-yellow-50' },
    { label: 'Approved Events', value: approvedEvents, icon: <List size={20} className="text-blue-600" />, to: '/admin/events', color: 'bg-blue-50' },
    { label: 'Total Users', value: users.length, icon: <Users size={20} className="text-green-600" />, to: '/admin/users', color: 'bg-green-50' },
    { label: 'Total Clubs', value: clubs.length, icon: <Building2 size={20} className="text-purple-600" />, to: '/admin/clubs', color: 'bg-purple-50' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <IndianRupee size={20} className="text-emerald-600" />, to: '/admin/reports', color: 'bg-emerald-50' },
    { label: 'Total Events', value: allEvents.length, icon: <TrendingUp size={20} className="text-blue-600" />, to: '/admin/events', color: 'bg-blue-50' },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">System overview — manage events, users and clubs.</p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
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

          {/* Pending events */}
          {pending.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Awaiting Your Approval</h2>
                <Link to="/admin/pending" className="text-sm text-blue-600 hover:underline">View all ({pending.length})</Link>
              </div>
              <div className="space-y-3">
                {pending.slice(0, 3).map((ev) => (
                  <div key={ev._id} className="card !p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-blue-600 font-medium">{ev.club?.name}</span>
                        {statusBadge(ev.status)}
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">{ev.title}</p>
                      <p className="text-xs text-gray-400">{format(new Date(ev.date), 'dd MMM yyyy')} · By {ev.createdBy?.name}</p>
                    </div>
                    <Link to="/admin/pending" className="btn-primary !py-1.5 !px-3 text-xs flex-shrink-0">Review</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent events table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Recent Events</h2>
              <Link to="/admin/events" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Event</th><th>Club</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {allEvents.slice(0, 6).map((ev) => (
                    <tr key={ev._id}>
                      <td className="font-medium text-gray-900 max-w-xs"><p className="truncate">{ev.title}</p></td>
                      <td className="text-gray-500">{ev.club?.name}</td>
                      <td className="whitespace-nowrap">{format(new Date(ev.date), 'dd MMM yyyy')}</td>
                      <td>{statusBadge(ev.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
