import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../context/TripContext';
import { Image, Calendar, IndianRupee, MapPin, Pencil, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const coverImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
];

export default function CreateTripPage() {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedCover, setSelectedCover] = useState(coverImages[0]);
  const { addTrip } = useTrips();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('FORM: Submitting trip data...');
      const trip = await addTrip({
        title,
        destination,
        start_date: startDate,
        end_date: endDate,
        description,
        budget: Number(budget) || 0,
        cover_image: selectedCover,
      });
      
      console.log('FORM: Trip created successfully, redirecting...');
      toast.success('Trip created successfully! View it in My Trips.');
      navigate('/trips');
    } catch (error) {
      console.error('FORM SUBMIT ERROR:', error);
      toast.error(`Failed to create trip: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title mb-1">Create a New Trip</h1>
        <p className="section-subtitle mb-8">Fill in the details to start planning your adventure</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Selection */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Image className="w-5 h-5 text-accent-400" /> Cover Image
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
              {coverImages.map(img => (
                <button key={img} type="button" onClick={() => setSelectedCover(img)}
                  className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                    selectedCover === img ? 'border-accent-500 ring-2 ring-accent-500/20 scale-105' : 'border-transparent hover:border-white/10'
                  }`}>
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            <div className="aspect-video max-h-48 rounded-xl overflow-hidden">
              <img src={selectedCover} alt="Selected cover" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Trip Details */}
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-accent-400" /> Trip Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Trip Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Summer in Rajasthan" required className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">
                <MapPin className="inline w-4 h-4 mr-1" />Destination
              </label>
              <input type="text" value={destination} onChange={e => setDestination(e.target.value)}
                placeholder="e.g., Jaipur, India" required className="input-field" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">
                  <Calendar className="inline w-4 h-4 mr-1" />Start Date
                </label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">
                  <Calendar className="inline w-4 h-4 mr-1" />End Date
                </label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  required className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="What's this trip about?" rows={3} className="input-field resize-none" />
            </div>
          </div>

          {/* Budget */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-accent-400" /> Budget Planning
            </h3>
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Total Budget (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 font-medium">₹</span>
                <input type="number" value={budget} onChange={e => setBudget(e.target.value)}
                  placeholder="50000" min="0" className="input-field pl-8" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate('/trips')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2">
              Create Trip <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
