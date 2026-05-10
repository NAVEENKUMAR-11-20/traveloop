import { motion } from 'framer-motion';
import { useTrips } from '../context/TripContext';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart3, Users, Globe, IndianRupee, Eye, Star, Calendar, TrendingUp } from 'lucide-react';

const COLORS = ['#5a9fff', '#3ec5b8', '#f87171', '#34d399', '#fbbf24', '#a78bfa'];
const monthlyUsers = [
  { month: 'Jan', users: 1200 }, { month: 'Feb', users: 1800 },
  { month: 'Mar', users: 2400 }, { month: 'Apr', users: 3100 },
  { month: 'May', users: 4200 }, { month: 'Jun', users: 5800 },
];
const monthlyRevenue = [
  { month: 'Jan', revenue: 340000 }, { month: 'Feb', revenue: 480000 },
  { month: 'Mar', revenue: 590000 }, { month: 'Apr', revenue: 750000 },
  { month: 'May', revenue: 940000 }, { month: 'Jun', revenue: 1170000 },
];
const recentActivity = [
  { user: 'Priya S.', action: 'Created trip to Manali', time: '2 min ago' },
  { user: 'Rahul K.', action: 'Shared Rajasthan itinerary', time: '15 min ago' },
  { user: 'Anita M.', action: 'Exported PDF for Goa trip', time: '1h ago' },
  { user: 'Vikram L.', action: 'Signed up', time: '2h ago' },
];
const popularDests = [
  { name: 'Manali', trips: 1240, trend: '+12%' },
  { name: 'Goa', trips: 1180, trend: '+8%' },
  { name: 'Jaipur', trips: 950, trend: '+22%' },
  { name: 'Kerala', trips: 870, trend: '+15%' },
];
const popularActivities = [
  { name: 'Trekking', count: 3200, trend: '+15%' },
  { name: 'Temple Tour', count: 2800, trend: '+10%' },
  { name: 'Scuba Diving', count: 1950, trend: '+28%' },
  { name: 'Desert Safari', count: 1600, trend: '+12%' },
];
const platformDist = [
  { name: 'Free', value: 62 }, { name: 'Pro', value: 28 }, { name: 'Team', value: 10 },
];
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};
const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-sm" style={{ background: 'rgba(20,23,35,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {payload.map((p, i) => <p key={i} className="text-dark-200">{p.dataKey}: {p.value?.toLocaleString('en-IN')}</p>)}
    </div>
  );
};

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-subtitle">Platform analytics and management</p>
      </div>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Users', value: '5,847', change: '+12.3%', icon: Users, color: 'text-accent-400', bg: 'from-accent-500/15 to-accent-600/5' },
            { label: 'Active Trips', value: '2,341', change: '+8.7%', icon: Globe, color: 'text-teal-400', bg: 'from-teal-500/15 to-teal-600/5' },
            { label: 'Revenue', value: '₹11.7L', change: '+23.5%', icon: IndianRupee, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-600/5' },
            { label: 'Page Views', value: '124K', change: '+6.1%', icon: Eye, color: 'text-amber-400', bg: 'from-amber-500/15 to-amber-600/5' },
          ].map(s => (
            <div key={s.label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{s.change}</span>
              </div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-accent-400" /> User Growth</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyUsers}>
                <defs><linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5a9fff" stopOpacity={0.15}/><stop offset="95%" stopColor="#5a9fff" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b6f82' }} /><YAxis tick={{ fontSize: 11, fill: '#6b6f82' }} />
                <Tooltip content={<Tip />} /><Area type="monotone" dataKey="users" stroke="#5a9fff" strokeWidth={2} fill="url(#ug)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-emerald-400" /> Revenue (₹)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.15}/><stop offset="95%" stopColor="#34d399" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b6f82' }} /><YAxis tick={{ fontSize: 11, fill: '#6b6f82' }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
                <Tooltip content={<Tip />} /><Area type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} fill="url(#rg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4">Plan Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={platformDist} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {platformDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie><Tooltip content={<Tip />} /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-amber-400" /> Top Destinations</h3>
          <div className="space-y-3">{popularDests.map((d, i) => (
            <div key={d.name} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center text-xs font-bold text-dark-300">{i + 1}</span>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{d.name}</p><p className="text-xs text-dark-400">{d.trips} trips</p></div>
              <span className="text-xs font-medium text-emerald-400">{d.trend}</span>
            </div>
          ))}</div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-teal-400" /> Top Activities</h3>
          <div className="space-y-3">{popularActivities.map((a, i) => (
            <div key={a.name} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center text-xs font-bold text-dark-300">{i + 1}</span>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{a.name}</p><p className="text-xs text-dark-400">{a.count} bookings</p></div>
              <span className="text-xs font-medium text-emerald-400">{a.trend}</span>
            </div>
          ))}</div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-accent-400" /> Recent Activity</h3>
          <div className="space-y-3">{recentActivity.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-400 text-xs font-bold flex-shrink-0">{a.user.charAt(0)}</div>
              <div className="min-w-0"><p className="text-sm text-dark-200"><strong className="text-white">{a.user}</strong> {a.action}</p><p className="text-[10px] text-dark-500">{a.time}</p></div>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}
