import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Trash2, Check, RotateCcw, ShoppingBag, FileText, Smartphone, Pill, Shirt } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { id: 'clothing', label: 'Clothing', icon: Shirt },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'electronics', label: 'Electronics', icon: Smartphone },
  { id: 'medicines', label: 'Medicines', icon: Pill },
  { id: 'toiletries', label: 'Toiletries', icon: ShoppingBag },
  { id: 'other', label: 'Other', icon: ClipboardList },
];

export default function PackingPage() {
  const { trips, addPackingItem, togglePackingItem, removePackingItem, resetChecklist } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState(trips[0]?.id || null);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('other');

  const trip = trips.find(t => t.id === selectedTrip);
  const packing = trip?.packing || [];
  const progress = packing.length > 0 ? Math.round((packing.filter(p => p.checked).length / packing.length) * 100) : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.trim() || !selectedTrip) return;
    addPackingItem(selectedTrip, { item: newItem, category: newCategory, checked: false });
    setNewItem('');
    toast.success('Item added');
  };

  const handleReset = () => {
    if (!selectedTrip) return;
    resetChecklist(selectedTrip);
    toast.success('Checklist reset');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Packing Checklist</h1>
          <p className="section-subtitle">Never forget essentials again</p>
        </div>
        {packing.length > 0 && (
          <button onClick={handleReset} className="btn-secondary flex items-center gap-2 text-sm">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* Trip selector */}
      <div className="card p-4 mb-6">
        <label className="block text-sm font-medium text-dark-200 mb-2">Select Trip</label>
        <select value={selectedTrip || ''} onChange={e => setSelectedTrip(Number(e.target.value))}
          className="input-field text-sm">
          {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      {/* Progress */}
      {packing.length > 0 && (
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-dark-200">Packing Progress</span>
            <span className="text-sm font-bold text-white">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-dark-700 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
              className="h-full bg-accent-500 rounded-full" transition={{ duration: 0.8 }} />
          </div>
          <p className="text-xs text-dark-400 mt-1">{packing.filter(p => p.checked).length} of {packing.length} items packed</p>
        </div>
      )}

      {/* Add item */}
      <form onSubmit={handleAdd} className="card p-4 mb-6 flex flex-col sm:flex-row gap-2">
        <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)}
          placeholder="Add item..." className="input-field text-sm flex-1" />
        <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
          className="input-field text-sm w-full sm:w-40">
          {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button type="submit" className="btn-primary text-sm whitespace-nowrap flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </form>

      {/* Items by category */}
      {packing.length === 0 ? (
        <div className="card p-8 text-center">
          <ClipboardList className="w-12 h-12 text-dark-500 mx-auto mb-3" />
          <p className="text-dark-300 text-sm">No items yet. Add items to your packing checklist.</p>
        </div>
      ) : (
        categories.map(cat => {
          const items = packing.filter(p => p.category === cat.id);
          if (items.length === 0) return null;
          const CatIcon = cat.icon;
          return (
            <div key={cat.id} className="mb-4">
              <h3 className="text-sm font-semibold text-dark-200 capitalize mb-2 flex items-center gap-2">
                <CatIcon className="w-4 h-4 text-accent-400" />
                {cat.label}
                <span className="text-xs text-dark-400 font-normal">({items.filter(i => i.checked).length}/{items.length})</span>
              </h3>
              <div className="card divide-y divide-white/5">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 group">
                    <button onClick={() => togglePackingItem(selectedTrip, item.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        item.checked ? 'bg-accent-500 border-accent-500' : 'border-dark-500 hover:border-accent-400'
                      }`}>
                      {item.checked && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`flex-1 text-sm ${item.checked ? 'line-through text-dark-500' : 'text-dark-200'}`}>
                      {item.item}
                    </span>
                    <button onClick={() => { removePackingItem(selectedTrip, item.id); toast.success('Item removed'); }}
                      className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-dark-500 hover:text-red-400 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
