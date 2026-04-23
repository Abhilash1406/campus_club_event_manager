import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getAllUsers, updateUser, deleteUser } from '../../services/userService';
import { getClubs } from '../../services/clubService';
import toast from 'react-hot-toast';
import { Users, Trash2, Edit2, X, Check } from 'lucide-react';

const roleColors = { student: 'badge-submitted', organizer: 'badge-forwarded', admin: 'badge-approved' };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const load = () => {
    Promise.all([getAllUsers(), getClubs()])
      .then(([u, c]) => { setUsers(u.data); setClubs(c.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (user) => {
    setEditModal(user._id);
    setEditForm({ name: user.name, email: user.email, role: user.role, club: user.club?._id || '' });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(editModal, editForm);
      toast.success('User updated successfully');
      setEditModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filtered = users
    .filter(u => roleFilter === 'all' || u.role === roleFilter)
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-title">Manage Users</h1>
        <p className="page-subtitle">View, edit roles, and manage all campus users.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="input max-w-xs" />
        <div className="flex gap-2">
          {['all', 'student', 'organizer', 'admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${roleFilter === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
              {r.charAt(0).toUpperCase() + r.slice(1)} ({r === 'all' ? users.length : users.filter(u => u.role === r).length})
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={<Users size={40} />} title="No users found" />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Club</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td className="font-medium text-gray-900">{u.name}</td>
                  <td className="text-gray-500">{u.email}</td>
                  <td><span className={roleColors[u.role]}>{u.role}</span></td>
                  <td className="text-gray-500">{u.club?.name || '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(u)} className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(u._id, u.name)} className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Edit User</h3>
              <button onClick={() => setEditModal(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="label">Name</label><input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input" /></div>
              <div><label className="label">Email</label><input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="input" /></div>
              <div>
                <label className="label">Role</label>
                <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="select">
                  <option value="student">Student</option>
                  <option value="organizer">Organizer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {editForm.role === 'organizer' && (
                <div>
                  <label className="label">Club</label>
                  <select value={editForm.club} onChange={e => setEditForm({...editForm, club: e.target.value})} className="select">
                    <option value="">Select club</option>
                    {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                <Check size={15} />{saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditModal(null)} className="btn-ghost flex-1 justify-center border border-gray-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
