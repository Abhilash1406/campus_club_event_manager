import Sidebar from '../../components/Sidebar';
import { LayoutDashboard, Clock, List, Users, BarChart2, Award } from 'lucide-react';

const organizerLinks = [
  { to: '/organizer/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/organizer/pending', icon: <Clock size={18} />, label: 'Pending Approvals' },
  { to: '/organizer/events', icon: <List size={18} />, label: 'All Club Events' },
  { to: '/organizer/certificates', icon: <Award size={18} />, label: 'Certificates' },
  { to: '/organizer/reports', icon: <BarChart2 size={18} />, label: 'Reports' },
];

const OrganizerLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar links={organizerLinks} title="Organizer Portal" />
    <main className="flex-1 p-8 overflow-y-auto">{children}</main>
  </div>
);

export default OrganizerLayout;
