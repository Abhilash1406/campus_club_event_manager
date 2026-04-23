import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrganizerLayout from './OrganizerLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getOrganizerAllEvents } from '../../services/eventService';
import { statusBadge } from '../../components/EventCard';
import { format } from 'date-fns';
import { List, Users, BarChart2, MessageSquare } from 'lucide-react';

const OrganizerAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getOrganizerAllEvents().then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? events : events.filter(e => e.status === filter);

  return (
    <OrganizerLayout>
      <div className="page-header">
        <h1 className="page-title">All Club Events</h1>
        <p className="page-subtitle">View all events submitted for your club.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
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

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={<List size={40} />} title="No events found" description="No events match the selected filter." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
                <th>Fee</th>
                <th>Proposed By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => (
                <tr key={ev._id}>
                  <td className="font-medium text-gray-900 max-w-xs"><p className="truncate">{ev.title}</p></td>
                  <td className="whitespace-nowrap">{format(new Date(ev.date), 'dd MMM yyyy')}</td>
                  <td>{statusBadge(ev.status)}</td>
                  <td>{ev.registrationFee > 0 ? `₹${ev.registrationFee}` : 'Free'}</td>
                  <td className="text-gray-500">{ev.createdBy?.name}</td>
                  <td>
                    <div className="flex gap-2">
                      {ev.status === 'approved' && (
                        <>
                          <Link to={`/organizer/participants/${ev._id}`} className="text-blue-600 text-xs hover:underline flex items-center gap-1">
                            <Users size={12} /> Participants
                          </Link>
                          <Link to={`/organizer/feedback/${ev._id}`} className="text-purple-600 text-xs hover:underline flex items-center gap-1">
                            <MessageSquare size={12} /> Feedback
                          </Link>
                          <Link to="/organizer/reports" className="text-gray-500 text-xs hover:underline flex items-center gap-1">
                            <BarChart2 size={12} /> Report
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </OrganizerLayout>
  );
};

export default OrganizerAllEvents;
