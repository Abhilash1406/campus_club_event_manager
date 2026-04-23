import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getAllEventsAdmin } from '../../services/eventService';
import { statusBadge } from '../../components/EventCard';
import { format } from 'date-fns';
import { List } from 'lucide-react';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllEventsAdmin().then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = events
    .filter(e => filter === 'all' || e.status === filter)
    .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.club?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-title">All Events</h1>
        <p className="page-subtitle">View and monitor all events across all clubs.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search events or clubs..."
          className="input max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          {['all', 'submitted', 'forwarded_to_admin', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {f === 'all' ? 'All' : f === 'forwarded_to_admin' ? 'Forwarded' : f.charAt(0).toUpperCase() + f.slice(1)}
              {' '}({f === 'all' ? events.length : events.filter(e => e.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={<List size={40} />} title="No events found" />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Club</th>
                <th>Date</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Venue</th>
                <th>Proposed By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => (
                <tr key={ev._id}>
                  <td className="font-medium text-gray-900 max-w-xs"><p className="truncate">{ev.title}</p></td>
                  <td className="text-gray-500 whitespace-nowrap">{ev.club?.name}</td>
                  <td className="whitespace-nowrap">{format(new Date(ev.date), 'dd MMM yyyy')}</td>
                  <td>{statusBadge(ev.status)}</td>
                  <td>{ev.budget > 0 ? `₹${ev.budget.toLocaleString()}` : '—'}</td>
                  <td className="text-gray-500">{ev.venue || '—'}</td>
                  <td className="text-gray-500">{ev.createdBy?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminEvents;
