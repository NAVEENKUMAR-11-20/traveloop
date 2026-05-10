import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, IndianRupee, PlusCircle, Compass, X } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import toast from 'react-hot-toast';

const allActivities = [
  { id: 1, name: 'Scuba Diving', type: 'adventure', duration: '3h', cost: 4500, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80', description: 'Explore underwater coral reefs and marine life' },
  { id: 2, name: 'Heritage Walking Tour', type: 'culture', duration: '2h', cost: 800, image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&q=80', description: 'Walk through centuries-old streets with a local guide' },
  { id: 3, name: 'Cooking Class', type: 'food', duration: '3h', cost: 2500, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80', description: 'Learn authentic local recipes from a master chef' },
  { id: 4, name: 'Mountain Trekking', type: 'adventure', duration: '6h', cost: 3000, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80', description: 'Hike through scenic mountain trails' },
  { id: 5, name: 'Spa & Wellness', type: 'wellness', duration: '2h', cost: 5000, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80', description: 'Rejuvenating massage and ayurvedic treatments' },
  { id: 6, name: 'Street Food Tour', type: 'food', duration: '3h', cost: 1200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', description: 'Taste the best local street food delicacies' },
  { id: 7, name: 'Sunset Sailing', type: 'adventure', duration: '2h', cost: 3500, image: 'https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=400&q=80', description: 'Sail into the sunset with panoramic views' },
  { id: 8, name: 'Temple Tour', type: 'culture', duration: '4h', cost: 600, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80', description: 'Visit ancient temples and sacred shrines' },
  { id: 9, name: 'Photography Walk', type: 'culture', duration: '3h', cost: 1800, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80', description: 'Capture stunning landscapes and architecture' },
  { id: 10, name: 'Yoga Retreat', type: 'wellness', duration: '2h', cost: 1500, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80', description: 'Morning yoga session with mountain views' },
  { id: 11, name: 'Desert Safari', type: 'adventure', duration: '5h', cost: 3500, image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400&q=80', description: 'Dune bashing and camel rides in the desert' },
  { id: 12, name: 'Night Market Visit', type: 'food', duration: '2h', cost: 500, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', description: 'Explore vibrant local night markets' },
];

const types = ['All', 'adventure', 'culture', 'food', 'wellness'];

export default function ActivitySearchPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [added, setAdded] = useState(new Set());
  const { addTrip, trips } = useTrips();

  const filtered = useMemo(() => {
    return allActivities.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All' || a.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  const toggleAdd = async (activity) => {
    if (added.has(activity.id)) {
      setAdded(prev => {
        const next = new Set(prev);
        next.delete(activity.id);
        return next;
      });
      toast.success('Activity removed');
    } else {
      try {
        // Create a new trip plan from this activity
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 1);

        await addTrip({
          title: `Trip to ${activity.name}`,
          destination: activity.name,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          description: activity.description,
          budget: activity.cost,
          cover_image: activity.image,
          status: 'planning',
          spent: 0,
          itinerary: [
            {
              day: 1,
              date: startDate.toISOString().split('T')[0],
              title: 'Activity Day',
              activities: [
                {
                  time: '10:00',
                  name: activity.name,
                  cost: activity.cost,
                  type: activity.type
                }
              ]
            }
          ]
        });

        setAdded(prev => {
          const next = new Set(prev);
          next.add(activity.id);
          return next;
        });
      } catch (error) {
        console.error('Failed to save activity as trip:', error);
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Discover Activities</h1>
        <p className="section-subtitle">Find exciting things to do on your trip</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search activities..." className="input-field pl-10 text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all capitalize whitespace-nowrap ${
                typeFilter === t
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'text-dark-400 border border-white/6 hover:bg-white/5'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((act, i) => (
          <motion.div key={act.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}>
            <div className="card overflow-hidden group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={act.image} alt={act.name} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute top-3 left-3 badge bg-black/30 backdrop-blur-sm text-white capitalize border border-white/10">
                  {act.type}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">{act.name}</h3>
                <p className="text-sm text-dark-400 mb-3 line-clamp-2">{act.description}</p>
                <div className="flex items-center gap-4 text-xs text-dark-300 mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{act.duration}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />₹{act.cost.toLocaleString('en-IN')}</span>
                </div>
                <button onClick={() => toggleAdd(act)}
                  className={`w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    added.has(act.id)
                      ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                      : 'bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 border border-accent-500/20'
                  }`}>
                  {added.has(act.id) ? <><X className="w-4 h-4" /> Remove</> : <><PlusCircle className="w-4 h-4" /> Add to Trip</>}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Compass className="w-12 h-12 text-dark-500 mx-auto mb-3" />
          <p className="text-dark-200 font-medium">No activities found</p>
          <p className="text-dark-400 text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
