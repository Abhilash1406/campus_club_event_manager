import { useEffect, useState } from 'react';
import StudentLayout from './StudentLayout';
import { getClubs } from '../../services/clubService';
import { createEvent } from '../../services/eventService';
import { getMyProposals } from '../../services/eventService';
import { statusBadge } from '../../components/EventCard';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { PlusCircle, Tag, Calendar } from 'lucide-react';

const ProposeEvent = () => {
  const [clubs, setClubs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', date: '', club: '', maxParticipants: 100, registrationFee: 0
  });

  useEffect(() => {
    getClubs().then(r => setClubs(r.data)).catch(() => {});
    getMyProposals().then(r => setProposals(r.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.club) return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      await createEvent(form);
      toast.success('Event proposal submitted successfully!');
      setForm({ title: '', description: '', date: '', club: '', maxParticipants: 100, registrationFee: 0 });
      const r = await getMyProposals();
      setProposals(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="page-header">
        <h1 className="page-title">Propose an Event</h1>
        <p className="page-subtitle">Submit a new event proposal for your club organizer to review.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <PlusCircle size={18} className="text-blue-600" /> New Proposal
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="label">Event Title *</label>
              <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="e.g. Annual Tech Fest 2024" required />
            </div>
            <div className="form-group">
              <label className="label">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="textarea" rows={4} placeholder="Describe the event in detail..." required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Date *</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} className="input" required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label className="label">Club *</label>
                <select name="club" value={form.club} onChange={handleChange} className="select" required>
                  <option value="">Select club</option>
                  {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Max Participants</label>
                <input name="maxParticipants" type="number" value={form.maxParticipants} onChange={handleChange} className="input" min={1} />
              </div>
              <div className="form-group">
                <label className="label">Fee (₹)</label>
                <input name="registrationFee" type="number" value={form.registrationFee} onChange={handleChange} className="input" min={0} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3">
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </form>
        </div>

        {/* My Proposals */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">My Proposals</h2>
          {proposals.length === 0 ? (
            <p className="text-sm text-gray-400">No proposals submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {proposals.map((p) => (
                <div key={p._id} className="card !p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Tag size={10} /> {p.club?.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={10} /> {format(new Date(p.date), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                    {statusBadge(p.status)}
                  </div>
                  {p.rejectionReason && (
                    <p className="text-xs text-red-500 mt-2 pt-2 border-t border-gray-100">
                      Reason: {p.rejectionReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default ProposeEvent;
