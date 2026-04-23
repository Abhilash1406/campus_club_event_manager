import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getClubs, createClub, updateClub, deleteClub } from '../../services/clubService';
import toast from 'react-hot-toast';
import { Building2, PlusCircle, Edit2, Trash2, X, Check } from 'lucide-react';

const AdminClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    getClubs().then(r => setClubs(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Club name is required');
    setSaving(true);
    try {
      if (editId) {
        await updateClub(editId, form);
        toast.success('Club updated');
      } else {
        await createClub(form);
        toast.success('Club created');
      }
      setForm({ name: '', description: '' });
      setShowForm(false);
      setEditId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (club) => {
    setEditId(club._id);
    setForm({ name: club.name, description: club.description });
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete club "${name}"? This cannot be undone.`)) return;
    try {
      await deleteClub(id);
      toast.success('Club deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const resetForm = () => { setForm({ name: '', description: '' }); setEditId(null); setShowForm(false); };

  const icons = ['🖥️', '⚽', '🎨', '🔬', '📚', '🎭', '🎵', '🏆'];

  return (
    <AdminLayout>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Manage Clubs</h1>
          <p className="page-subtitle">Create and manage campus clubs.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">
          <PlusCircle size={16} /> Add Club
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{editId ? 'Edit Club' : 'New Club'}</h2>
            <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div><label className="label">Club Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="e.g. Tech Club" required /></div>
            <div><label className="label">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="textarea" rows={2} placeholder="Brief description..." /></div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary"><Check size={15} />{saving ? 'Saving...' : editId ? 'Update Club' : 'Create Club'}</button>
              <button type="button" onClick={resetForm} className="btn-ghost border border-gray-200">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <LoadingSpinner /> : clubs.length === 0 ? (
        <EmptyState icon={<Building2 size={40} />} title="No clubs yet" description="Create the first campus club." action={<button onClick={() => setShowForm(true)} className="btn-primary"><PlusCircle size={16} /> Add Club</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clubs.map((club, i) => (
            <div key={club._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{icons[i % icons.length]}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(club)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(club._id, club.name)} className="p-1.5 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{club.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{club.description || 'No description.'}</p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminClubs;
