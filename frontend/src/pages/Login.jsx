import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { loginUser, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (user) {
    if (user.role === 'student') navigate('/student/dashboard');
    else if (user.role === 'organizer') navigate('/organizer/dashboard');
    else if (user.role === 'admin') navigate('/admin/dashboard');
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      if (data.role === 'student') navigate('/student/dashboard');
      else if (data.role === 'organizer') navigate('/organizer/dashboard');
      else if (data.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Admin', email: 'admin@campus.edu', password: 'admin123' },
    { label: 'Tech Organizer', email: 'ravi@campus.edu', password: 'organizer123' },
    { label: 'Student', email: 'arjun@campus.edu', password: 'student123' },
  ];

  const fillDemo = (acc) => setForm({ email: acc.email, password: acc.password });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-lg">
          <GraduationCap size={24} />
          CampusEvents
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">Sign in to your account</h1>
              <p className="text-sm text-gray-500 mt-1">Enter your credentials to access CampusEvents</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="you@campus.edu"
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    className="input pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">Register here</Link>
            </p>

            {/* Demo Accounts */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Demo Login</p>
              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.label}
                    type="button"
                    onClick={() => fillDemo(acc)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-2 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors text-center"
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
