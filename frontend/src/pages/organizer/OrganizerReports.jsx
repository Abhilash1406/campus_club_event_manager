import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrganizerLayout from './OrganizerLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getOrganizerReports } from '../../services/reportService';
import { BarChart2, IndianRupee, Users, Tag } from 'lucide-react';
import { format } from 'date-fns';

const OrganizerReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrganizerReports().then(r => setReports(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totRevenue = reports.reduce((s, r) => s + r.revenue, 0);
  const totParticipants = reports.reduce((s, r) => s + r.totalRegistrations, 0);

  return (
    <OrganizerLayout>
      <div className="page-header">
        <h1 className="page-title">Event Reports</h1>
        <p className="page-subtitle">Revenue and participation summary for your club events.</p>
      </div>

      {loading ? <LoadingSpinner /> : reports.length === 0 ? (
        <EmptyState icon={<BarChart2 size={40} />} title="No reports yet" description="Reports appear once events are approved and registrations happen." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="stat-card">
              <p className="stat-label">Total Revenue</p>
              <p className="stat-value">₹{totRevenue.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total Participants</p>
              <p className="stat-value">{totParticipants}</p>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Total Registered</th>
                  <th>Paid</th>
                  <th>Revenue</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={i}>
                    <td className="font-medium text-gray-900 max-w-xs"><p className="truncate">{r.event?.title}</p></td>
                    <td className="whitespace-nowrap">{format(new Date(r.event?.date), 'dd MMM yyyy')}</td>
                    <td>{r.totalRegistrations}</td>
                    <td>{r.paidRegistrations}</td>
                    <td className="text-green-700 font-medium">₹{r.revenue.toLocaleString()}</td>
                    <td className="text-red-600">₹{r.cost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </OrganizerLayout>
  );
};

export default OrganizerReports;
