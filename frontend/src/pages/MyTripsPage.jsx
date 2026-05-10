import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../context/TripContext';
import {
  PlusCircle, Search, Calendar, Trash2, Pencil,
  Eye, Filter, MapPin,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function MyTripsPage() {
  const { trips, deleteTrip, loading } = useTrips();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState(null);

  const filtered = useMemo(() => {
    return trips.filter(t => {
      const matchSearch = (t.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.destination || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [trips, search, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-dark-700 border-t-accent-500 rounded-full animate-spin" />
      </div>
    );
  }

  const statusColors = {
    planning: 'badge-primary',
    upcoming: 'badge-warning',
    completed: 'badge-success',
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(id);
      setDeleteModal(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">My Trips</h1>
          <p className="section-subtitle">{trips.length} {trips.length === 1 ? 'trip' : 'trips'} total</p>
        </div>
        <Link to="/create-trip" className="btn-primary flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
          <PlusCircle className="w-4 h-4" /> New Trip
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search trips..." className="input-field pl-10 text-sm" />
        </div>
        <div className="flex gap-2">
          {['all', 'planning', 'upcoming', 'completed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all capitalize ${
                statusFilter === s
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'text-dark-400 border border-white/6 hover:bg-white/5'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Trip cards */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Filter className="w-12 h-12 text-dark-500 mx-auto mb-3" />
          <p className="text-dark-200 font-medium">No trips found</p>
          <p className="text-dark-400 text-sm mt-1">Try adjusting your filters or create a new trip.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((trip, i) => {
            const budgetPercent = trip.budget > 0 ? Math.round((trip.spent / trip.budget) * 100) : 0;
            return (
              <motion.div key={trip.id} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                <div className="card overflow-hidden group">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={trip.cover_image} alt={trip.title} loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className={`absolute top-3 left-3 ${statusColors[trip.status] || 'badge-primary'} capitalize`}>
                      {trip.status}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold truncate">{trip.title}</h3>
                      <p className="text-white/60 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {trip.destination}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-3 text-xs text-dark-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(parseISO(trip.start_date), 'MMM d')} – {format(parseISO(trip.end_date), 'MMM d, yyyy')}
                      </span>
                    </div>

                    {/* Budget bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-dark-300">₹{trip.spent.toLocaleString('en-IN')} spent</span>
                        <span className="text-dark-400">₹{trip.budget.toLocaleString('en-IN')} budget</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${budgetPercent > 90 ? 'bg-red-500' : budgetPercent > 70 ? 'bg-amber-500' : 'bg-accent-500'}`}
                          style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link to={`/trips/${trip.id}`}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-accent-500/10 text-accent-400 text-xs font-medium hover:bg-accent-500/20 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                      <Link to={`/trips/${trip.id}/edit`}
                        className="p-2 rounded-xl hover:bg-white/5 text-dark-400 hover:text-dark-200 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteModal(trip.id)}
                        className="p-2 rounded-xl hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-6 max-w-sm w-full"
            style={{ background: 'rgba(20, 23, 35, 0.95)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
            <h3 className="font-bold text-white text-lg mb-2">Delete Trip?</h3>
            <p className="text-dark-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteModal)}
                className="btn-danger flex-1 text-sm">
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
