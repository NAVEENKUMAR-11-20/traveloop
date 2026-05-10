import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, PlusCircle, MapPin, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const allCities = [
  { id: 1, name: 'Jaipur', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&q=80', rating: 4.8, costIndex: '₹₹', description: 'The Pink City of royal palaces and vibrant bazaars' },
  { id: 2, name: 'Tokyo', country: 'Japan', continent: 'Asia', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80', rating: 4.9, costIndex: '₹₹₹₹', description: 'A dazzling blend of tradition and modernity' },
  { id: 3, name: 'Paris', country: 'France', continent: 'Europe', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80', rating: 4.8, costIndex: '₹₹₹₹', description: 'The city of love and lights' },
  { id: 4, name: 'Goa', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80', rating: 4.5, costIndex: '₹₹', description: 'Sun-kissed beaches and Portuguese heritage' },
  { id: 5, name: 'Manali', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=80', rating: 4.7, costIndex: '₹₹', description: 'Snow-capped peaks and adventure sports' },
  { id: 6, name: 'Santorini', country: 'Greece', continent: 'Europe', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500&q=80', rating: 4.9, costIndex: '₹₹₹₹', description: 'Iconic white-washed cliffs and sunsets' },
  { id: 7, name: 'Bali', country: 'Indonesia', continent: 'Asia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80', rating: 4.7, costIndex: '₹₹₹', description: 'Tropical paradise with stunning temples' },
  { id: 8, name: 'Dubai', country: 'UAE', continent: 'Asia', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80', rating: 4.7, costIndex: '₹₹₹₹', description: 'Futuristic skyline and desert adventures' },
  { id: 9, name: 'London', country: 'UK', continent: 'Europe', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&q=80', rating: 4.5, costIndex: '₹₹₹₹₹', description: 'Rich history meets modern culture' },
  { id: 10, name: 'Varanasi', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&q=80', rating: 4.6, costIndex: '₹', description: 'The spiritual capital of India' },
  { id: 11, name: 'Udaipur', country: 'India', continent: 'Asia', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80', rating: 4.8, costIndex: '₹₹', description: 'City of Lakes with royal palaces' },
  { id: 12, name: 'Kyoto', country: 'Japan', continent: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=80', rating: 4.9, costIndex: '₹₹₹₹', description: 'Ancient temples and serene gardens' },
];

const continents = ['All', 'Asia', 'Europe'];

export default function CitySearchPage() {
  const [search, setSearch] = useState('');
  const [continent, setContinent] = useState('All');
  const [added, setAdded] = useState(new Set());

  const filtered = useMemo(() => {
    return allCities.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase());
      const matchContinent = continent === 'All' || c.continent === continent;
      return matchSearch && matchContinent;
    });
  }, [search, continent]);

  const toggleAdd = (id) => {
    setAdded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.success('Removed from trip');
      } else {
        next.add(id);
        toast.success('Added to trip');
      }
      return next;
    });
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
                <button onClick={() => toggleAdd(city.id)}
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
