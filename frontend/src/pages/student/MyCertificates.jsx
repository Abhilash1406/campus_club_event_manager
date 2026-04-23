import { useEffect, useState } from 'react';
import StudentLayout from './StudentLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getMyCertificates } from '../../services/certificateService';
import { format } from 'date-fns';
import { Award, Download, Tag, Calendar } from 'lucide-react';

const MyCertificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCertificates().then(r => setCerts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <StudentLayout>
      <div className="page-header">
        <h1 className="page-title">My Certificates</h1>
        <p className="page-subtitle">Download participation certificates for completed events.</p>
      </div>

      {loading ? <LoadingSpinner /> : certs.length === 0 ? (
        <EmptyState
          icon={<Award size={40} />}
          title="No certificates yet"
          description="Certificates are issued after paying for an event and the organizer generates them."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((cert) => (
            <div key={cert._id} className="card hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Award size={22} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  <Tag size={10} /> {cert.event?.club?.name}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{cert.event?.title}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                <Calendar size={11} /> Issued: {format(new Date(cert.issuedAt), 'dd MMM yyyy')}
              </p>
              <a
                href={cert.fileUrl}
                download
                className="btn-secondary w-full justify-center text-xs !py-2"
              >
                <Download size={14} /> Download Certificate
              </a>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
};

export default MyCertificates;
