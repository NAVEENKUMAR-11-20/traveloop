import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import {
  PlusCircle, Map, IndianRupee, ClipboardList,
  Calendar, ArrowRight, TrendingUp, Globe, Plane,
} from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const recommendations = [
  { name: 'Manali', country: 'India', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80', tag: 'Mountains' },
  { name: 'Goa', country: 'India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80', tag: 'Beaches' },
  { name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80', tag: 'Culture' },
  { name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80', tag: 'Coastal' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { trips, loading } = useTrips();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-dark-700 border-t-accent-500 rounded-full animate-spin" />
      </div>
    );
  }

  const upcomingTrips = trips.filter(t => t.status === 'upcoming' || t.status === 'planning')
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  const totalBudget = trips.reduce((s, t) => s + (t.budget || 0), 0);
  const totalSpent = trips.reduce((s, t) => s + (t.spent || 0), 0);

  const quickActions = [
    { label: 'New Trip', icon: PlusCircle, path: '/create-trip', color: 'from-accent-500/20 to-accent-600/10', iconColor: 'text-accent-400' },
    { label: 'My Trips', icon: Map, path: '/trips', color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400' },
    { label: 'Budget', icon: IndianRupee, path: '/budget', color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
    { label: 'Packing', icon: ClipboardList, path: '/packing', color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(59,125,255,0.12), rgba(37,169,158,0.08))',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-teal-500/5 rounded-full translate-y-1/2" />
          <div className="relative z-10">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display mb-1">
              {greeting()}, {user?.name?.split(' ')[0] || 'Traveler'} ✈️
            </h1>
            <p className="text-dark-300 text-sm">
              You have {upcomingTrips.length} upcoming {upcomingTrips.length === 1 ? 'trip' : 'trips'}. Where to next?
            </p>
            <Link to="/create-trip"
              className="inline-flex items-center gap-2 mt-4 btn-primary text-sm">
              <PlusCircle className="w-4 h-4" /> Plan a Trip
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(a => (
            <Link key={a.label} to={a.path}
              className="card p-4 flex items-center gap-3 group hover:-translate-y-0.5 transition-transform">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center flex-shrink-0`}>
                <a.icon className={`w-5 h-5 ${a.iconColor}`} />
              </div>
              <span className="font-medium text-sm text-dark-200 group-hover:text-white transition-colors">{a.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Trips', value: trips.length, icon: Globe, iconColor: 'text-accent-400' },
            { label: 'Upcoming', value: upcomingTrips.length, icon: Calendar, iconColor: 'text-teal-400' },
            { label: 'Total Budget', value: `₹${totalBudget.toLocaleString('en-IN')}`, icon: IndianRupee, iconColor: 'text-emerald-400' },
            { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: TrendingUp, iconColor: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-dark-400 uppercase tracking-wider">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.iconColor}`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upcoming Trips */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white font-display">Upcoming Trips</h2>
            <Link to="/trips" className="text-sm text-accent-400 hover:text-accent-300 font-medium flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingTrips.length === 0 ? (
            <div className="card p-8 text-center">
              <Map className="w-12 h-12 text-dark-500 mx-auto mb-3" />
              <p className="text-dark-300 text-sm">No upcoming trips. Start planning!</p>
              <Link to="/create-trip" className="btn-primary inline-flex items-center gap-2 mt-4 text-sm">
                <PlusCircle className="w-4 h-4" /> Create Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTrips.slice(0, 3).map(trip => {
                const daysUntil = differenceInDays(parseISO(trip.start_date), new Date());
                const budgetPercent = trip.budget > 0 ? Math.round((trip.spent / trip.budget) * 100) : 0;
                return (
                  <Link key={trip.id} to={`/trips/${trip.id}`} className="card p-4 flex gap-4 group hover:-translate-y-0.5 transition-transform">
                    <div className="w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={trip.cover_image} alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-accent-400 transition-colors">{trip.title}</h3>
                      <p className="text-xs text-dark-400 mt-0.5">{trip.destination}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-dark-300 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(parseISO(trip.start_date), 'MMM d')} – {format(parseISO(trip.end_date), 'MMM d')}
                        </span>
                        <span className={`badge text-xs ${daysUntil > 30 ? 'badge-success' : daysUntil > 7 ? 'badge-warning' : 'badge-danger'}`}>
                          {daysUntil > 0 ? `${daysUntil}d away` : 'Now'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                          <div className="h-full bg-accent-500/60 rounded-full transition-all" style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recommendations */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white font-display">Recommended</h2>
            <Link to="/city-search" className="text-sm text-accent-400 hover:text-accent-300 font-medium flex items-center gap-1 transition-colors">
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {recommendations.map(d => (
              <Link key={d.name} to="/city-search"
                className="group relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer">
                <img src={d.image} alt={d.name} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="badge bg-white/10 backdrop-blur-sm text-white text-[10px] mb-1 border border-white/10">{d.tag}</span>
                  <h3 className="text-white font-semibold text-sm">{d.name}</h3>
                  <p className="text-white/50 text-[10px]">{d.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
