import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrganizerLayout from './OrganizerLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getEventParticipants } from '../../services/registrationService';
import { getEvent } from '../../services/eventService';
import { ArrowLeft, Users } from 'lucide-react';

const OrganizerParticipants = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEventParticipants(eventId),
      getEvent(eventId)
    ]).then(([p, e]) => {
      setParticipants(p.data);
      setEvent(e.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [eventId]);

  const paid = participants.filter(p => p.paymentStatus === 'paid').length;

  return (
    <OrganizerLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="page-header">
        <h1 className="page-title">{event?.title || 'Participants'}</h1>
        <p className="page-subtitle">{participants.length} registered · {paid} paid</p>
      </div>

      {loading ? <LoadingSpinner /> : participants.length === 0 ? (
        <EmptyState icon={<Users size={40} />} title="No participants yet" description="No students have registered for this event." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roll No.</th>
                <th>Class</th>
                <th>Section</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <tr key={p._id}>
                  <td className="text-gray-400">{i + 1}</td>
                  <td className="font-medium text-gray-900">{p.user?.name}</td>
                  <td className="text-gray-500">{p.user?.email}</td>
                  <td>{p.user?.rollNo || '—'}</td>
                  <td>{p.user?.className || '—'}</td>
                  <td>{p.user?.section || '—'}</td>
                  <td>
                    <span className={p.paymentStatus === 'paid' ? 'badge-paid' : 'badge-pending'}>
                      {p.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
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

export default OrganizerParticipants;
