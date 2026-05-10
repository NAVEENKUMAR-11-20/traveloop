import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, PlusCircle, MapPin, Globe } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const allCities = [
  { id: 1, name: 'Jaipur', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', rating: 4.8, costIndex: '₹₹', description: 'The Pink City of royal palaces and vibrant bazaars' },
  { id: 4, name: 'Goa', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', rating: 4.5, costIndex: '₹₹', description: 'Sun-kissed beaches and Portuguese heritage' },
  { id: 5, name: 'Manali', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', rating: 4.7, costIndex: '₹₹', description: 'Snow-capped peaks and adventure sports' },
  { id: 10, name: 'Varanasi', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80', rating: 4.6, costIndex: '₹', description: 'The spiritual capital of India' },
  { id: 11, name: 'Udaipur', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', rating: 4.8, costIndex: '₹₹', description: 'City of Lakes with royal palaces' },
  { id: 13, name: 'Chennai', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', rating: 4.4, costIndex: '₹₹', description: 'Gateway to South India with rich Dravidian culture' },
  { id: 14, name: 'Pondicherry', country: 'India', continent: 'Asia', image: '/pondy.webp', rating: 4.7, costIndex: '₹₹', description: 'French colonial charm and serene spiritual centers' },
  { id: 15, name: 'Ooty', country: 'India', continent: 'Asia', image: '/ooty.webp', rating: 4.6, costIndex: '₹₹', description: 'Queen of Hill Stations with misty tea gardens' },
  { id: 16, name: 'Munnar', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=800&q=80', rating: 4.8, costIndex: '₹₹', description: 'Lush green tea plantations and rolling hills' },
  { id: 17, name: 'Bengaluru', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80', rating: 4.5, costIndex: '₹₹₹', description: 'The Garden City and Silicon Valley of India' },
  { id: 18, name: 'Hyderabad', country: 'India', continent: 'Asia', image: '/hydra.webp', rating: 4.6, costIndex: '₹₹', description: 'City of Pearls and iconic Charminar' },
  { id: 19, name: 'Mumbai', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80', rating: 4.7, costIndex: '₹₹₹', description: 'The City of Dreams and Bollywood' },
  { id: 20, name: 'Delhi', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', rating: 4.5, costIndex: '₹₹', description: 'The historic and political heart of India' },
  { id: 21, name: 'Mysore', country: 'India', continent: 'Asia', image: '/mysore.webp', rating: 4.8, costIndex: '₹₹', description: 'Royal heritage and magnificent palaces' },
  { id: 22, name: 'Agra', country: 'India', continent: 'Asia', image: '/agra.webp', rating: 4.9, costIndex: '₹₹', description: 'Home to the eternal Taj Mahal' },
  { id: 23, name: 'Kochi', country: 'India', continent: 'Asia', image: '/kochi.webp', rating: 4.6, costIndex: '₹₹', description: 'Queen of the Arabian Sea and historic spice port' },
  { id: 2, name: 'Tokyo', country: 'Japan', continent: 'Asia', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', rating: 4.9, costIndex: '₹₹₹₹', description: 'A dazzling blend of tradition and modernity' },
  { id: 3, name: 'Paris', country: 'France', continent: 'Europe', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', rating: 4.8, costIndex: '₹₹₹₹', description: 'The city of love and lights' },
  { id: 6, name: 'Santorini', country: 'Greece', continent: 'Europe', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80', rating: 4.9, costIndex: '₹₹₹₹', description: 'Iconic white-washed cliffs and sunsets' },
];

const continents = ['All', 'Asia', 'Europe'];

export default function CitySearchPage() {
  const [search, setSearch] = useState('');
  const [continent, setContinent] = useState('All');
  const { trips } = useTrips();
  const [added, setAdded] = useState(new Set());

  const filtered = useMemo(() => {
    return allCities.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase());
      const matchContinent = continent === 'All' || c.continent === continent;
      return matchSearch && matchContinent;
    });
  }, [search, continent]);

  // Sync existing stops from database on load
  useEffect(() => {
    if (trips && trips.length > 0) {
      const latestTrip = trips[0];
      const existingStops = latestTrip.itinerary || [];
      const stopCityNames = new Set(existingStops.map(s => s.city));
      
      const newAdded = new Set();
      allCities.forEach(city => {
        if (stopCityNames.has(city.name)) {
          newAdded.add(city.id);
        }
      });
      setAdded(newAdded);
    }
  }, [trips]);

  const toggleAdd = async (city) => {
    if (!trips || trips.length === 0) {
      toast.error('Please create a trip first from the "Create Trip" page!');
      return;
    }

    const latestTrip = trips[0];

    if (added.has(city.id)) {
      setAdded(prev => {
        const next = new Set(prev);
        next.delete(city.id);
        return next;
      });
      toast.success('Removed from your trip');
    } else {
      try {
        console.log('SUPABASE: Adding city stop to trip:', latestTrip.id);
        
        const { data, error } = await supabase
          .from('trip_stops')
          .insert([{
            trip_id: latestTrip.id,
            user_id: String(latestTrip.user_id),
            city: city.name,
            country: city.country,
            day: 1, // Default to Day 1
            date: latestTrip.start_date,
            title: `Visit ${city.name}`
          }])
          .select()
          .single();

        if (error) throw error;

        setAdded(prev => {
          const next = new Set(prev);
          next.add(city.id);
          return next;
        });
        toast.success(`Added ${city.name} to your trip: ${latestTrip.title}`);
      } catch (error) {
        console.error('SUPABASE CITY ERROR:', error);
        toast.error('Failed to add city to database');
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Explore Destinations</h1>
        <p className="section-subtitle">Find your next dream destination</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search cities or countries..." className="input-field pl-10 text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {continents.map(c => (
            <button key={c} onClick={() => setContinent(c)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                continent === c
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'text-dark-400 border border-white/6 hover:bg-white/5'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((city, i) => (
          <motion.div key={city.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}>
            <div className="card overflow-hidden group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={city.image} alt={city.name} loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 border border-white/10">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-white text-xs font-medium">{city.rating}</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-bold text-lg">{city.name}</h3>
                  <p className="text-white/60 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {city.country}
                  </p>
                </div>
                <div className="absolute top-3 left-3 badge bg-black/30 backdrop-blur-sm text-white border border-white/10">
                  {city.costIndex}
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-dark-300 mb-3 line-clamp-2">{city.description}</p>
                <button onClick={() => toggleAdd(city)}
                  className={`w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    added.has(city.id)
                      ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                      : 'bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 border border-accent-500/20'
                  }`}>
                  <PlusCircle className="w-4 h-4" />
                  {added.has(city.id) ? 'Added to Trip' : 'Add to Trip'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Globe className="w-12 h-12 text-dark-500 mx-auto mb-3" />
          <p className="text-dark-200 font-medium">No destinations found</p>
          <p className="text-dark-400 text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
