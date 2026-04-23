import { useEffect, useState } from 'react';
import StudentLayout from './StudentLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getMyRegistrations, simulatePayment } from '../../services/registrationService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Calendar, Tag, CreditCard, ListChecks } from 'lucide-react';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);

  const load = () => {
    getMyRegistrations().then(r => setRegistrations(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePay = async (regId) => {
    setPaying(regId);
    try {
      await simulatePayment(regId);
      toast.success('Payment successful! ✅');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(null);
    }
  };

  return (
    <StudentLayout>
      <div className="page-header">
        <h1 className="page-title">My Registrations</h1>
        <p className="page-subtitle">Manage your event registrations and complete payments.</p>
      </div>

      {loading ? <LoadingSpinner /> : registrations.length === 0 ? (
        <EmptyState
          icon={<ListChecks size={40} />}
          title="No registrations yet"
          description="Register for an approved event from your dashboard."
        />
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg._id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Tag size={10} /> {reg.event?.club?.name}
                  </span>
                  <span className={reg.paymentStatus === 'paid' ? 'badge-paid' : 'badge-pending'}>
                    {reg.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-base">{reg.event?.title}</h3>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={12} />{format(new Date(reg.event?.date), 'dd MMM yyyy')}</span>
                  <span>Registered: {format(new Date(reg.createdAt), 'dd MMM yyyy')}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {reg.event?.registrationFee > 0 && (
                  <span className="text-sm font-semibold text-gray-800">₹{reg.event.registrationFee}</span>
                )}
                {reg.paymentStatus === 'pending' ? (
                  <button
                    onClick={() => handlePay(reg._id)}
                    disabled={paying === reg._id}
                    className="btn-primary !py-2 !px-4 text-xs"
                  >
                    <CreditCard size={14} />
                    {paying === reg._id ? 'Processing...' : 'Pay Now'}
                  </button>
                ) : (
                  <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                    ✓ Paid
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
};

export default MyRegistrations;
