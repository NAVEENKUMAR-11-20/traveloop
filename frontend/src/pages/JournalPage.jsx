import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { motion } from 'framer-motion';
import { BookOpen, PlusCircle, Trash2, Calendar, Pencil } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

export default function JournalPage() {
  const { trips, addJournalEntry, deleteJournalEntry, updateJournalEntry } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState(trips[0]?.id || null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const trip = trips.find(t => t.id === selectedTrip);
  const journal = trip?.journal || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedTrip) return;
    if (editingId) {
      updateJournalEntry(selectedTrip, editingId, { title, content });
      toast.success('Entry updated');
      setEditingId(null);
    } else {
      addJournalEntry(selectedTrip, {
        date: format(new Date(), 'yyyy-MM-dd'),
        title,
        content,
      });
      toast.success('Entry added');
    }
    setTitle('');
    setContent('');
    setShowForm(false);
  };

  const startEdit = (entry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (entryId) => {
    deleteJournalEntry(selectedTrip, entryId);
    toast.success('Entry deleted');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Trip Journal</h1>
          <p className="section-subtitle">Document your travel memories</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setTitle(''); setContent(''); }}
          className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle className="w-4 h-4" /> New Entry
        </button>
      </div>

      {/* Trip selector */}
      <div className="card p-4 mb-6">
        <label className="block text-sm font-medium text-dark-200 mb-2">Select Trip</label>
        <select value={selectedTrip || ''} onChange={e => setSelectedTrip(Number(e.target.value))}
          className="input-field text-sm">
          {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} className="card p-4 mb-6 space-y-3">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Entry title..." required className="input-field text-sm" />
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Write your thoughts..." rows={4} className="input-field text-sm resize-none" />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm">{editingId ? 'Update' : 'Save Entry'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-ghost text-sm">Cancel</button>
          </div>
        </motion.form>
      )}

      {/* Entries */}
      {journal.length === 0 ? (
        <div className="card p-8 text-center">
          <BookOpen className="w-12 h-12 text-dark-500 mx-auto mb-3" />
          <p className="text-dark-300 text-sm">No journal entries yet. Start documenting your memories!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {journal.map(entry => (
            <div key={entry.id} className="card p-4 group">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white">{entry.title}</h3>
                  <p className="text-xs text-dark-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {format(parseISO(entry.date), 'EEEE, MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(entry)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-dark-400 hover:text-accent-400 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-dark-300 leading-relaxed">{entry.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
