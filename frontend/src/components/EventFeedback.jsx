import { useEffect, useState } from 'react';
import { getEventFeedback, submitFeedback } from '../services/feedbackService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const EventFeedback = ({ eventId, isRegistered }) => {
  const { user } = useAuth();
  const [feedbackData, setFeedbackData] = useState({ feedback: [], averageRating: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadFeedback = () => {
    getEventFeedback(eventId)
      .then(r => setFeedbackData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFeedback();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitFeedback({ eventId, rating, comment });
      toast.success('Thank you for your feedback!');
      setComment('');
      setRating(5);
      loadFeedback(); // refresh
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const hasSubmitted = feedbackData.feedback.some(f => f.user?._id === user?._id) || false;
  const canSubmit = user?.role === 'student' && isRegistered && !hasSubmitted;

  if (loading) return <div className="py-8 flex justify-center"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Event Feedback</h2>
          <p className="text-sm text-gray-500 mt-1">See what participants are saying</p>
        </div>
        {feedbackData.totalCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <Star size={18} className="text-yellow-500 fill-current" />
            <span className="font-bold text-blue-900">{feedbackData.averageRating}</span>
            <span className="text-xs text-blue-600 font-medium">({feedbackData.totalCount} reviews)</span>
          </div>
        )}
      </div>

      {canSubmit && (
        <div className="card mb-8 bg-gray-50 border-transparent">
          <h3 className="font-semibold text-gray-900 mb-3">Leave a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="label">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={24}
                      className={star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="label">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="textarea !bg-white"
                rows={3}
                placeholder="Share your experience..."
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              <MessageSquare size={16} />
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      )}

      {feedbackData.feedback.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No feedback submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackData.feedback.map((f, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 bg-white">
              <div className="flex items-start justify-between mb-2">
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
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < f.rating ? "text-yellow-500 fill-current" : "text-gray-200"}
                    />
                  ))}
                </div>
              </div>
              {f.comment && (
                <p className="text-sm text-gray-700 mt-3 pl-10">{f.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventFeedback;
