import { useParams, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { format, parseISO } from 'date-fns';
import { MapPin, Calendar, Clock, Globe, Copy, Share2, Twitter, Facebook } from 'lucide-react';
import toast from 'react-hot-toast';

const activityTypes = {
  sightseeing: { color: 'bg-blue-500/15 text-blue-400', emoji: '🏛️' },
  food: { color: 'bg-orange-500/15 text-orange-400', emoji: '🍜' },
  accommodation: { color: 'bg-purple-500/15 text-purple-400', emoji: '🏨' },
  entertainment: { color: 'bg-pink-500/15 text-pink-400', emoji: '🎭' },
  shopping: { color: 'bg-green-500/15 text-green-400', emoji: '🛍️' },
  transport: { color: 'bg-cyan-500/15 text-cyan-400', emoji: '🚄' },
  other: { color: 'bg-gray-500/15 text-gray-400', emoji: '📌' },
};

export default function SharedTripPage() {
  const { id } = useParams();
  const { getTrip } = useTrips();
  const trip = getTrip(id);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0f18' }}>
        <div className="text-center">
          <Globe className="w-16 h-16 text-dark-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Trip Not Found</h2>
          <p className="text-dark-400 text-sm mb-4">This trip may have been removed or the link is invalid.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=Check out my trip: ${trip.title}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  return (
    <div className="min-h-screen" style={{ background: '#0d0f18' }}>
      {/* Header */}
      <div className="relative h-60 sm:h-72">
        <img src={trip.cover_image} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f18] via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{trip.destination}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />
              {format(parseISO(trip.start_date), 'MMM d')} – {format(parseISO(trip.end_date), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {trip.description && (
          <p className="text-dark-300 mb-6">{trip.description}</p>
        )}

        {/* Share buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={copyLink} className="btn-secondary text-sm flex items-center gap-2">
            <Copy className="w-4 h-4" /> Copy Link
          </button>
          <button onClick={shareTwitter} className="btn-secondary text-sm flex items-center gap-2">
            <Twitter className="w-4 h-4" /> Twitter
          </button>
          <button onClick={shareFacebook} className="btn-secondary text-sm flex items-center gap-2">
            <Facebook className="w-4 h-4" /> Facebook
          </button>
        </div>

        {/* Itinerary */}
        {trip.itinerary.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-display">Itinerary</h2>
            {trip.itinerary.map((day, dayIdx) => (
              <div key={dayIdx} className="card p-4 sm:p-6">
                <h3 className="font-bold text-white mb-1">Day {day.day}: {day.title}</h3>
                <p className="text-xs text-dark-400 mb-4">{format(parseISO(day.date), 'EEEE, MMM d, yyyy')}</p>
                <div className="space-y-3">
                  {day.activities.map((act, actIdx) => {
                    const t = activityTypes[act.type] || activityTypes.other;
                    return (
                      <div key={actIdx} className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center flex-shrink-0 text-sm`}>
                          {t.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-dark-400">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.time}</span>
                            {act.cost > 0 && <span>₹{act.cost.toLocaleString('en-IN')}</span>}
                          </div>
                          <p className="text-sm font-medium text-dark-200">{act.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 pt-6 border-t border-white/5">
          <p className="text-dark-400 text-sm mb-3">Powered by Traveloop</p>
          <Link to="/signup" className="btn-primary text-sm">Plan Your Own Trip</Link>
        </div>
      </div>
    </div>
  );
}
