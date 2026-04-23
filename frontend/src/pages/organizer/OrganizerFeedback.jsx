import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrganizerLayout from './OrganizerLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getEventFeedback } from '../../services/feedbackService';
import { getEvent } from '../../services/eventService';
import { ArrowLeft, MessageSquare, Star } from 'lucide-react';
import { format } from 'date-fns';

const OrganizerFeedback = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState({ feedback: [], averageRating: 0, totalCount: 0 });
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEventFeedback(eventId),
      getEvent(eventId)
    ]).then(([f, e]) => {
      setFeedbackData(f.data);
      setEvent(e.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [eventId]);

  return (
    <OrganizerLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Feedback: {event?.title || 'Event'}</h1>
          <p className="page-subtitle">View student reviews and comments</p>
        </div>
        {feedbackData.totalCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <Star size={18} className="text-yellow-500 fill-current" />
            <span className="font-bold text-blue-900">{feedbackData.averageRating}</span>
            <span className="text-xs text-blue-600 font-medium">({feedbackData.totalCount} reviews)</span>
          </div>
        )}
      </div>

      {loading ? <LoadingSpinner /> : feedbackData.feedback.length === 0 ? (
        <EmptyState icon={<MessageSquare size={40} />} title="No feedback yet" description="No students have submitted feedback for this event." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbackData.feedback.map((f, i) => (
            <div key={i} className="card bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {f.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{f.user?.name}</p>
                    <p className="text-xs text-gray-400">{format(new Date(f.createdAt), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-bold text-gray-700">{f.rating}</span>
                </div>
              </div>
              {f.comment ? (
                <p className="text-sm text-gray-700 mt-2">{f.comment}</p>
              ) : (
                <p className="text-sm text-gray-400 italic mt-2">No comment provided</p>
              )}
            </div>
          ))}
        </div>
      )}
    </OrganizerLayout>
  );
};

export default OrganizerFeedback;
