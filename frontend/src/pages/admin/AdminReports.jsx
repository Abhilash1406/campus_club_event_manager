import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getAllReports } from '../../services/reportService';
import { format } from 'date-fns';
import { BarChart2, TrendingUp, IndianRupee, Users } from 'lucide-react';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReports().then(r => setReports(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalRevenue = reports.reduce((s, r) => s + r.revenue, 0);
  const totalCost = reports.reduce((s, r) => s + r.cost, 0);
  const totalParticipants = reports.reduce((s, r) => s + r.totalRegistrations, 0);
  const totalProfit = totalRevenue - totalCost;

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-subtitle">Platform-wide revenue, cost, and participation summary.</p>
      </div>

      {loading ? <LoadingSpinner /> : reports.length === 0 ? (
        <EmptyState icon={<BarChart2 size={40} />} title="No data yet" description="Reports appear once events are approved and students register." />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <IndianRupee size={20} className="text-green-600" />, color: 'bg-green-50' },
              { label: 'Total Cost', value: `₹${totalCost.toLocaleString()}`, icon: <TrendingUp size={20} className="text-red-500" />, color: 'bg-red-50' },
              { label: 'Net Profit', value: `₹${totalProfit.toLocaleString()}`, icon: <TrendingUp size={20} className="text-blue-600" />, color: 'bg-blue-50' },
              { label: 'Total Participants', value: totalParticipants, icon: <Users size={20} className="text-purple-600" />, color: 'bg-purple-50' },
            ].map(s => (
              <div key={s.label} className="stat-card flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Club</th>
                  <th>Date</th>
                  <th>Registered</th>
                  <th>Paid</th>
                  <th>Revenue</th>
                  <th>Cost</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={i}>
                    <td className="font-medium text-gray-900 max-w-xs"><p className="truncate">{r.event?.title}</p></td>
                    <td className="text-gray-500 whitespace-nowrap">{r.event?.club?.name}</td>
                    <td className="whitespace-nowrap">{format(new Date(r.event?.date), 'dd MMM yyyy')}</td>
                    <td>{r.totalRegistrations}</td>
                    <td>{r.paidRegistrations}</td>
                    <td className="text-green-700 font-medium">₹{r.revenue.toLocaleString()}</td>
                    <td className="text-red-600">₹{r.cost.toLocaleString()}</td>
                    <td className={r.profit >= 0 ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>
                      {r.profit >= 0 ? '+' : ''}₹{r.profit?.toLocaleString() || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminReports;
