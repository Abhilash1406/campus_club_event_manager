import { useEffect, useState } from 'react';
import OrganizerLayout from './OrganizerLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getOrganizerPendingEvents, organizerApprove, organizerReject } from '../../services/eventService';
import { statusBadge } from '../../components/EventCard';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, Calendar, Users, IndianRupee } from 'lucide-react';

const OrganizerPendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [reason, setReason] = useState('');

  const load = () => {
    getOrganizerPendingEvents().then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await organizerApprove(id);
      toast.success('Event forwarded to admin for final approval!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) return toast.error('Please provide a rejection reason');
    setActionId(rejectModal);
    try {
      await organizerReject(rejectModal, reason);
      toast.success('Event rejected.');
      setRejectModal(null);
      setReason('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  return (
    <OrganizerLayout>
      <div className="page-header">
        <h1 className="page-title">Pending Approvals</h1>
        <p className="page-subtitle">Review submitted event proposals from your club members.</p>
      </div>

      {loading ? <LoadingSpinner /> : events.length === 0 ? (
        <EmptyState
          icon={<Clock size={40} />}
          title="No pending proposals"
          description="All event proposals from your club have been reviewed."
        />
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <div key={ev._id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {statusBadge(ev.status)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{ev.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{ev.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(ev.date), 'dd MMM yyyy')}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> Max {ev.maxParticipants}</span>
                    <span className="flex items-center gap-1"><IndianRupee size={12} /> {ev.registrationFee > 0 ? `₹${ev.registrationFee}` : 'Free'}</span>
                    <span className="text-gray-400">By: {ev.createdBy?.name}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(ev._id)}
                    disabled={actionId === ev._id}
                    className="btn-success !py-2 !px-4 text-sm"
                  >
                    <CheckCircle size={15} /> Approve
                  </button>
                  <button
                    onClick={() => { setRejectModal(ev._id); setReason(''); }}
                    disabled={actionId === ev._id}
                    className="btn-danger !py-2 !px-4 text-sm"
                  >
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="font-semibold text-gray-900 mb-1">Reject Event</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejection.</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="textarea mb-4"
              rows={3}
              placeholder="Reason for rejection..."
            />
            <div className="flex gap-3">
              <button onClick={handleReject} disabled={actionId === rejectModal} className="btn-danger flex-1 justify-center">
                {actionId === rejectModal ? 'Rejecting...' : 'Confirm Reject'}
              </button>
              <button onClick={() => setRejectModal(null)} className="btn-ghost flex-1 justify-center border border-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </OrganizerLayout>
  );
};

export default OrganizerPendingEvents;
