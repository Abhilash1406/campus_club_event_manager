import Sidebar from '../../components/Sidebar';
import { LayoutDashboard, Calendar, PlusCircle, Award, ListChecks } from 'lucide-react';

const studentLinks = [
  { to: '/student/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/student/registrations', icon: <ListChecks size={18} />, label: 'My Registrations' },
  { to: '/student/propose', icon: <PlusCircle size={18} />, label: 'Propose Event' },
  { to: '/student/certificates', icon: <Award size={18} />, label: 'My Certificates' },
];

const StudentLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar links={studentLinks} title="Student Portal" />
    <main className="flex-1 p-8 overflow-y-auto">{children}</main>
  </div>
);

export default StudentLayout;
