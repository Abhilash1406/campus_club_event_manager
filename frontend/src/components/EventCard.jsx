import { format } from 'date-fns';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusBadge = (status) => {
  const map = {
    submitted: 'badge-submitted',
    forwarded_to_admin: 'badge-forwarded',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
  };
  const labels = {
    submitted: 'Submitted',
    forwarded_to_admin: 'Forwarded to Admin',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return <span className={map[status] || 'badge-pending'}>{labels[status] || status}</span>;
};

const EventCard = ({ event, showActions, onRegister, registering, showStatus }) => {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Club + Status Row */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          <Tag size={11} />
          {event.club?.name || 'Unknown Club'}
        </span>
        {showStatus && statusBadge(event.status)}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug line-clamp-2">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{event.description}</p>

      {/* Meta */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={13} className="text-gray-400" />
          {format(new Date(event.date), 'dd MMM yyyy')}
        </div>
        {event.venue && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={13} className="text-gray-400" />
            {event.venue}
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Users size={13} className="text-gray-400" />
          Max {event.maxParticipants} participants
        </div>
      </div>

      {/* Fee */}
      {event.registrationFee > 0 && (
        <p className="text-sm font-semibold text-blue-600 mb-4">
          ₹{event.registrationFee} <span className="font-normal text-gray-400">registration fee</span>
        </p>
      )}
      {event.registrationFee === 0 && (
        <p className="text-sm font-semibold text-green-600 mb-4">Free Entry</p>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 mt-auto">
          <Link to={`/events/${event._id}`} className="btn-secondary flex-1 justify-center text-xs !py-2">
            View Details
          </Link>
          <button
            onClick={() => onRegister(event._id)}
            disabled={registering}
            className="btn-primary flex-1 justify-center text-xs !py-2"
          >
            {registering ? 'Registering...' : 'Register'}
          </button>
        </div>
      )}
      {!showActions && (
        <Link to={`/events/${event._id}`} className="btn-secondary justify-center text-xs !py-2 mt-auto">
          View Details
        </Link>
      )}
    </div>
  );
};

export default EventCard;
export { statusBadge };
