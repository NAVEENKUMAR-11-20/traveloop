import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrips } from '../context/TripContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import {
  Calendar, IndianRupee, MapPin, Clock, PlusCircle, Trash2, Share2,
  ClipboardList, BookOpen, ArrowLeft, Download, Check, X, Map, Pencil,
} from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'itinerary', label: 'Itinerary', icon: Map },
  { id: 'packing', label: 'Packing', icon: ClipboardList },
  { id: 'journal', label: 'Journal', icon: BookOpen },
];
const activityTypes = {
  sightseeing: { color: 'bg-blue-500/15 text-blue-400', emoji: '🏛️' },
  food: { color: 'bg-orange-500/15 text-orange-400', emoji: '🍜' },
  accommodation: { color: 'bg-purple-500/15 text-purple-400', emoji: '🏨' },
  entertainment: { color: 'bg-pink-500/15 text-pink-400', emoji: '🎭' },
  shopping: { color: 'bg-green-500/15 text-green-400', emoji: '🛍️' },
  transport: { color: 'bg-cyan-500/15 text-cyan-400', emoji: '🚄' },
  other: { color: 'bg-gray-500/15 text-gray-400', emoji: '📌' },
};
const packingCategories = ['documents', 'electronics', 'clothing', 'medicines', 'toiletries', 'other'];

export default function TripDetailPage() {
  const { id } = useParams();
  const {
    getTrip, updateItinerary, addPackingItem, togglePackingItem,
    removePackingItem, addJournalEntry, deleteJournalEntry,
    loading
  } = useTrips();
  const trip = getTrip(id);
  const [activeTab, setActiveTab] = useState('itinerary');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-dark-700 border-t-accent-500 rounded-full animate-spin" />
      </div>
    );
  }
  const [showAddAct, setShowAddAct] = useState(null);
  const [newAct, setNewAct] = useState({ time: '', name: '', cost: '', type: 'sightseeing' });
  const [showAddDay, setShowAddDay] = useState(false);
  const [newDayTitle, setNewDayTitle] = useState('');
  const [newPackItem, setNewPackItem] = useState('');
  const [newPackCat, setNewPackCat] = useState('other');
  const [showJForm, setShowJForm] = useState(false);
  const [jTitle, setJTitle] = useState('');
  const [jContent, setJContent] = useState('');
  const [viewMode, setViewMode] = useState('timeline');

  if (!trip) {
    return (
      <div className="text-center py-20">
        <Map className="w-16 h-16 text-dark-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Trip Not Found</h2>
        <Link to="/trips" className="btn-primary inline-flex items-center gap-2 mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to Trips
        </Link>
      </div>
    );
  }

  const itinerary = trip.itinerary || [];
  const packing = trip.packing || [];
  const journal = trip.journal || [];

  const safeParseDate = (d) => {
    try {
      return d ? parseISO(d) : new Date();
    } catch (e) {
      return new Date();
    }
  };

  const totalDays = differenceInDays(safeParseDate(trip.end_date), safeParseDate(trip.start_date)) + 1;
  const itineraryCost = itinerary.reduce((s, d) => s + (d.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);
  const packProgress = packing.length > 0 ? Math.round((packing.filter(p => p.checked).length / packing.length) * 100) : 0;

  const handleAddAct = (dayIdx) => {
    if (!newAct.name) return;
    const updated = [...trip.itinerary];
    updated[dayIdx] = { ...updated[dayIdx], activities: [...updated[dayIdx].activities, { time: newAct.time || '12:00', name: newAct.name, cost: Number(newAct.cost) || 0, type: newAct.type }] };
    updateItinerary(trip.id, updated);
    setNewAct({ time: '', name: '', cost: '', type: 'sightseeing' });
    setShowAddAct(null);
    toast.success('Activity added');
  };

  const removeAct = (dayIdx, actIdx) => {
    const updated = [...trip.itinerary];
    updated[dayIdx] = { ...updated[dayIdx], activities: updated[dayIdx].activities.filter((_, i) => i !== actIdx) };
    updateItinerary(trip.id, updated);
    toast.success('Activity removed');
  };

  const handleAddDay = () => {
    if (!newDayTitle) return;
    const dayNum = trip.itinerary.length + 1;
    const date = new Date(parseISO(trip.start_date));
    date.setDate(date.getDate() + dayNum - 1);
    updateItinerary(trip.id, [...trip.itinerary, { day: dayNum, date: format(date, 'yyyy-MM-dd'), title: newDayTitle, activities: [] }]);
    setNewDayTitle('');
    setShowAddDay(false);
    toast.success('Day added');
  };

  const handleAddPack = (e) => {
    e.preventDefault();
    if (!newPackItem) return;
    addPackingItem(trip.id, { item: newPackItem, category: newPackCat, checked: false });
    setNewPackItem('');
    toast.success('Item added');
  };

  const handleAddJ = (e) => {
    e.preventDefault();
    if (!jTitle) return;
    addJournalEntry(trip.id, { date: format(new Date(), 'yyyy-MM-dd'), title: jTitle, content: jContent });
    setJTitle(''); setJContent(''); setShowJForm(false);
    toast.success('Entry added');
  };

  const handleShare = () => {
    const url = `${window.location.origin}/shared/${trip.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  return (
    <div>
      <Link to="/trips" className="inline-flex items-center gap-1 text-sm text-dark-400 hover:text-accent-400 transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to trips
      </Link>

      {/* Header card */}
      <div className="card overflow-hidden mb-6">
        <div className="relative h-40 sm:h-52">
          <img src={trip.cover_image} alt={trip.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,15,24,0.95)] via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display mb-1">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-white/60 text-xs sm:text-sm">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{trip.destination}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />
                {trip.start_date && trip.end_date ? (
                  <>{format(safeParseDate(trip.start_date), 'MMM d')} – {format(safeParseDate(trip.end_date), 'MMM d, yyyy')}</>
                ) : 'Dates TBD'}
              </span>
              <span>{totalDays} days</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/5">
          {[
            { label: 'Budget', value: `₹${(trip.budget || 0).toLocaleString('en-IN')}` },
            { label: 'Spent', value: `₹${(trip.spent || 0).toLocaleString('en-IN')}` },
            { label: 'Activities', value: itinerary.reduce((s, d) => s + (d.activities || []).length, 0) },
            { label: 'Packing', value: `${packProgress}%` },
          ].map(s => (
            <div key={s.label} className="p-3 sm:p-4 text-center">
              <p className="text-[10px] sm:text-xs text-dark-400 uppercase tracking-wider mb-0.5">{s.label}</p>
              <p className="text-lg sm:text-xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={handleShare} className="btn-secondary text-sm flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</button>
        <button className="btn-secondary text-sm flex items-center gap-2"><Download className="w-4 h-4" /> Export PDF</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
              activeTab === tab.id ? 'bg-white/6 text-white' : 'text-dark-400 hover:text-dark-200'
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
        {activeTab === 'itinerary' && (
          <div className="ml-auto flex gap-1">
            {['timeline', 'list'].map(m => (
              <button key={m} onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${viewMode === m ? 'bg-accent-500/15 text-accent-400' : 'text-dark-500'}`}>
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'itinerary' && (
          <motion.div key="it" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-4">
              {itinerary.map((day, dayIdx) => (
                <div key={dayIdx} className="card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-white">Day {day.day}: {day.title}</h3>
                      <p className="text-xs text-dark-400">{day.date ? format(safeParseDate(day.date), 'EEEE, MMM d, yyyy') : 'Date TBD'}</p>
                    </div>
                    <span className="text-xs text-dark-400 bg-dark-700 px-2 py-1 rounded-lg">₹{day.activities.reduce((s, a) => s + (a.cost || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="space-y-3 relative">
                    {day.activities.length > 1 && <div className="absolute left-[18px] top-3 bottom-3 w-px bg-white/5" />}
                    {day.activities.map((act, actIdx) => {
                      const t = activityTypes[act.type] || activityTypes.other;
                      return (
                        <div key={actIdx} className="flex items-start gap-3 relative group">
                          <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center flex-shrink-0 text-sm z-10`}>{t.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-dark-400 flex items-center gap-1"><Clock className="w-3 h-3" />{act.time}</span>
                              {act.cost > 0 && <span className="text-xs text-dark-400">₹{act.cost.toLocaleString('en-IN')}</span>}
                            </div>
                            <p className="text-sm font-medium text-dark-200 truncate">{act.name}</p>
                          </div>
                          <button onClick={() => removeAct(dayIdx, actIdx)}
                            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-dark-500 hover:text-red-400 transition-all">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {showAddAct === dayIdx ? (
                    <div className="mt-4 p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <input type="time" value={newAct.time} onChange={e => setNewAct(p => ({ ...p, time: e.target.value }))} className="input-field text-sm py-2" />
                        <input type="text" value={newAct.name} onChange={e => setNewAct(p => ({ ...p, name: e.target.value }))} placeholder="Activity name" className="input-field text-sm py-2 col-span-2 sm:col-span-1" />
                        <input type="number" value={newAct.cost} onChange={e => setNewAct(p => ({ ...p, cost: e.target.value }))} placeholder="Cost (₹)" className="input-field text-sm py-2" min="0" />
                        <select value={newAct.type} onChange={e => setNewAct(p => ({ ...p, type: e.target.value }))} className="input-field text-sm py-2">
                          {Object.keys(activityTypes).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAddAct(dayIdx)} className="btn-primary text-xs py-2">Add</button>
                        <button onClick={() => setShowAddAct(null)} className="btn-ghost text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddAct(dayIdx)} className="mt-4 flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 font-medium transition-colors">
                      <PlusCircle className="w-4 h-4" /> Add Activity
                    </button>
                  )}
                </div>
              ))}
              {showAddDay ? (
                <div className="card p-4"><div className="flex gap-2">
                  <input type="text" value={newDayTitle} onChange={e => setNewDayTitle(e.target.value)} placeholder="Day title (e.g., Beach Day)" className="input-field text-sm flex-1" />
                  <button onClick={handleAddDay} className="btn-primary text-sm">Add Day</button>
                  <button onClick={() => setShowAddDay(false)} className="btn-ghost text-sm">Cancel</button>
                </div></div>
              ) : (
                <button onClick={() => setShowAddDay(true)}
                  className="w-full card p-4 flex items-center justify-center gap-2 text-accent-400 hover:bg-accent-500/5 transition-colors text-sm font-medium border-dashed !border-accent-500/20" style={{ borderStyle: 'dashed' }}>
                  <PlusCircle className="w-5 h-5" /> Add Day
                </button>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'packing' && (
          <motion.div key="pk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="card p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-dark-200">Packing Progress</span>
                <span className="text-sm font-bold text-white">{packProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-dark-700 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${packProgress}%` }} className="h-full bg-accent-500 rounded-full" transition={{ duration: 0.8 }} />
              </div>
            </div>
            <form onSubmit={handleAddPack} className="card p-4 mb-4 flex flex-col sm:flex-row gap-2">
              <input type="text" value={newPackItem} onChange={e => setNewPackItem(e.target.value)} placeholder="Add item..." className="input-field text-sm flex-1" />
              <select value={newPackCat} onChange={e => setNewPackCat(e.target.value)} className="input-field text-sm w-full sm:w-40">
                {packingCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" className="btn-primary text-sm whitespace-nowrap">Add Item</button>
            </form>
            {packingCategories.map(cat => {
              const items = packing.filter(p => p.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat} className="mb-4">
                  <h3 className="text-sm font-semibold text-dark-200 capitalize mb-2">{cat} <span className="text-xs text-dark-400 font-normal">({items.filter(i => i.checked).length}/{items.length})</span></h3>
                  <div className="card divide-y divide-white/5">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 group">
                        <button onClick={() => togglePackingItem(trip.id, item.id)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'bg-accent-500 border-accent-500' : 'border-dark-500 hover:border-accent-400'}`}>
                          {item.checked && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`flex-1 text-sm ${item.checked ? 'line-through text-dark-500' : 'text-dark-200'}`}>{item.item}</span>
                        <button onClick={() => removePackingItem(trip.id, item.id)}
                          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-dark-500 hover:text-red-400 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'journal' && (
          <motion.div key="jn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Travel Journal</h2>
              <button onClick={() => setShowJForm(!showJForm)} className="btn-primary text-sm flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> New Entry
              </button>
            </div>
            {showJForm && (
              <form onSubmit={handleAddJ} className="card p-4 mb-4 space-y-3">
                <input type="text" value={jTitle} onChange={e => setJTitle(e.target.value)} placeholder="Entry title..." required className="input-field text-sm" />
                <textarea value={jContent} onChange={e => setJContent(e.target.value)} placeholder="Write your thoughts..." rows={4} className="input-field text-sm resize-none" />
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary text-sm">Save Entry</button>
                  <button type="button" onClick={() => setShowJForm(false)} className="btn-ghost text-sm">Cancel</button>
                </div>
              </form>
            )}
            {journal.length === 0 ? (
              <div className="card p-8 text-center">
                <BookOpen className="w-12 h-12 text-dark-500 mx-auto mb-3" />
                <p className="text-dark-400 text-sm">No journal entries yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {journal.map(entry => (
                  <div key={entry.id} className="card p-4 group">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{entry.title}</h3>
                        <p className="text-xs text-dark-400">{entry.date ? format(safeParseDate(entry.date), 'EEEE, MMM d, yyyy') : 'Date TBD'}</p>
                      </div>
                      <button onClick={() => deleteJournalEntry(trip.id, entry.id)}
                        className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-dark-500 hover:text-red-400 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-dark-300 leading-relaxed">{entry.content}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
