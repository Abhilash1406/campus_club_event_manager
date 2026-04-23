import { useEffect, useState } from 'react';
import OrganizerLayout from './OrganizerLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getOrganizerAllEvents, uploadCertificateTemplate } from '../../services/eventService';
import { generateCertificates, getEventCertificates } from '../../services/certificateService';
import toast from 'react-hot-toast';
import { Award, Star, Upload } from 'lucide-react';
import { format } from 'date-fns';

const OrganizerCertificates = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    getOrganizerAllEvents()
      .then(r => setEvents(r.data.filter(e => e.status === 'approved')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async (eventId, title) => {
    setGenerating(eventId);
    try {
      const { data } = await generateCertificates(eventId);
      toast.success(`${data.message} for "${title}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(null);
    }
  };

  const handleUploadTemplate = async (eventId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('template', file);

    try {
      await uploadCertificateTemplate(eventId, formData);
      toast.success('Template uploaded successfully!');
      // Update local events to show it has a template
      setEvents(events.map(ev => ev._id === eventId ? { ...ev, certificateTemplate: true } : ev));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <OrganizerLayout>
      <div className="page-header">
        <h1 className="page-title">Certificate Management</h1>
        <p className="page-subtitle">Upload templates and generate participation certificates for paid registrants.</p>
      </div>

      {loading ? <LoadingSpinner /> : events.length === 0 ? (
        <EmptyState icon={<Award size={40} />} title="No approved events" description="Certificates can only be generated for approved events." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => (
            <div key={ev._id} className="card hover:shadow-md transition-shadow flex flex-col">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Award size={20} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{ev.title}</h3>
              <p className="text-xs text-gray-400 mb-4">{format(new Date(ev.date), 'dd MMM yyyy')} · {ev.club?.name}</p>
              
              <div className="mt-auto space-y-2">
                <div>
                  <input
                    type="file"
                    id={`template-${ev._id}`}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleUploadTemplate(ev._id, e)}
                  />
                  <label
                    htmlFor={`template-${ev._id}`}
                    className="btn-secondary w-full justify-center text-sm !py-2 cursor-pointer flex items-center gap-2"
                  >
                    <Upload size={14} />
                    {ev.certificateTemplate ? 'Update Template' : 'Upload Template'}
                  </label>
                </div>

                <button
                  onClick={() => handleGenerate(ev._id, ev.title)}
                  disabled={generating === ev._id || !ev.certificateTemplate}
                  className="btn-primary w-full justify-center text-sm !py-2 disabled:bg-blue-300"
                  title={!ev.certificateTemplate ? 'Upload a template first' : ''}
                >
                  <Star size={14} />
                  {generating === ev._id ? 'Generating...' : 'Generate Certificates'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </OrganizerLayout>
  );
};

export default OrganizerCertificates;
