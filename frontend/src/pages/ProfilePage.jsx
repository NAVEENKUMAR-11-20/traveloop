import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import {
  User, Mail, Camera, Globe, Check, Settings,
  Bell, Shield, Trash2, Languages,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const { trips } = useTrips();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('Passionate traveler exploring the world one city at a time.');
  const [language, setLanguage] = useState('English');
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = () => {
    setSaved(true);
    toast.success('Profile updated');
    setTimeout(() => setSaved(false), 2000);
  };

  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const totalCountries = new Set(trips.map(t => t.destination.split(',').pop()?.trim())).size;

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Profile</h1>
        <p className="section-subtitle">Manage your account and preferences</p>
      </div>

      {/* Profile header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'T'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center hover:bg-dark-600 transition-colors"
              style={{ background: 'rgba(20,23,35,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Camera className="w-4 h-4 text-dark-300" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">{user?.name || 'Traveler'}</h2>
            <p className="text-sm text-dark-400">{user?.email || 'user@traveloop.com'}</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
              {[
                { value: trips.length, label: 'Trips' },
                { value: completedTrips, label: 'Completed' },
                { value: totalCountries, label: 'Countries' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-dark-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {[
          { id: 'profile', label: 'Edit Profile', icon: User },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeTab === tab.id ? 'bg-white/6 text-white' : 'text-dark-400 hover:text-dark-200'
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-400" />
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field pl-11" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-11" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="input-field resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">
              <Languages className="inline w-4 h-4 mr-1" /> Language Preference
            </label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="input-field text-sm">
              {['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">
              <Globe className="inline w-4 h-4 mr-1" /> Saved Destinations
            </label>
            <div className="flex flex-wrap gap-2">
              {['Tokyo', 'Jaipur', 'Bali', 'Manali', 'Goa'].map(d => (
                <span key={d} className="badge-primary">{d}</span>
              ))}
            </div>
          </div>

          <button onClick={handleSave}
            className={`btn-primary flex items-center gap-2 ${saved ? '!bg-emerald-500 !text-white' : ''}`}>
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
          </button>
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent-400" /> Notifications
            </h3>
            {['Email notifications', 'Trip reminders', 'Budget alerts', 'Newsletter'].map(item => (
              <div key={item} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <span className="text-sm text-dark-200">{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-5 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-dark-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-500 peer-checked:after:bg-white"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-400" /> Security
            </h3>
            <div className="space-y-2">
              <button className="btn-secondary text-sm w-full sm:w-auto">Change Password</button>
              <button className="btn-secondary text-sm w-full sm:w-auto ml-0 sm:ml-2">Enable Two-Factor Auth</button>
            </div>
          </div>

          <div className="card p-5" style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
            <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Danger Zone
            </h3>
            <p className="text-sm text-dark-400 mb-3">Permanently delete your account and all data.</p>
            <button className="btn-danger text-sm">Delete Account</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
