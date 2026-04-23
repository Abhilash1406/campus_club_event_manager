import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/authService';
import { getClubs } from '../services/clubService';
import toast from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';

const Register = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    club: '', rollNo: '', className: '', section: ''
  });

  useEffect(() => {
    getClubs().then(r => setClubs(r.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await register(form);
      loginUser(data);
      toast.success('Account created successfully!');
      if (data.role === 'student') navigate('/student/dashboard');
      else if (data.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-lg">
          <GraduationCap size={24} />
          CampusEvents
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="card">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
              <p className="text-sm text-gray-500 mt-1">Join the campus event management platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Your full name" required />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="you@campus.edu" required />
                </div>
              </div>

              <div>
                <label className="label">Password *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="input" placeholder="Min 6 characters" required />
              </div>

              <div>
                <label className="label">Role *</label>
                <select name="role" value={form.role} onChange={handleChange} className="select">
                  <option value="student">Student</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>

              {form.role === 'organizer' && (
                <div>
                  <label className="label">Club *</label>
                  <select name="club" value={form.club} onChange={handleChange} className="select" required>
                    <option value="">Select your club</option>
                    {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {form.role === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Roll No.</label>
                    <input name="rollNo" value={form.rollNo} onChange={handleChange} className="input" placeholder="CS2021001" />
                  </div>
                  <div>
                    <label className="label">Class</label>
                    <input name="className" value={form.className} onChange={handleChange} className="input" placeholder="B.Tech CSE" />
                  </div>
                  <div>
                    <label className="label">Section</label>
                    <input name="section" value={form.section} onChange={handleChange} className="input" placeholder="A" />
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3 mt-2">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
