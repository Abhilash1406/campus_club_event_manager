import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { verifyOTP } from '../services/authService';
import toast from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';

const VerifyOTP = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Email missing for verification');
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return toast.error('Please enter a valid 6-digit OTP');
    }
    setLoading(true);
    try {
      const { data } = await verifyOTP({ email, otp });
      loginUser(data);
      toast.success('Email verified successfully!');
      if (data.role === 'student') navigate('/student/dashboard');
      else if (data.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
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
        <div className="w-full max-w-md">
          <div className="card">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">Verify your email</h1>
              <p className="text-sm text-gray-500 mt-1">We sent a 6-digit code to <strong>{email}</strong></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label">Verification Code</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="input tracking-[0.5em] text-center text-xl font-bold"
                  placeholder="------"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3">
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Didn't receive the code?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">Register again</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
