import Sidebar from '../../components/Sidebar';
import { LayoutDashboard, Clock, List, Users, Building2, BarChart2 } from 'lucide-react';

const adminLinks = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/pending', icon: <Clock size={18} />, label: 'Pending Approvals' },
  { to: '/admin/events', icon: <List size={18} />, label: 'All Events' },
  { to: '/admin/users', icon: <Users size={18} />, label: 'Manage Users' },
  { to: '/admin/clubs', icon: <Building2 size={18} />, label: 'Manage Clubs' },
  { to: '/admin/reports', icon: <BarChart2 size={18} />, label: 'Reports' },
];

const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar links={adminLinks} title="Admin Portal" />
    <main className="flex-1 p-8 overflow-y-auto">{children}</main>
  </div>
);

export default AdminLayout;
