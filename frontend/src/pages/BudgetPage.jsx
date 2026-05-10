import { useMemo } from 'react';
import { useTrips } from '../context/TripContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { IndianRupee, TrendingUp, AlertTriangle, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react';

const COLORS = ['#5a9fff', '#3ec5b8', '#f87171', '#fbbf24', '#a78bfa', '#34d399', '#fb923c', '#f472b6'];

export default function BudgetPage() {
  const { trips } = useTrips();

  const totalBudget = trips.reduce((s, t) => s + (t.budget || 0), 0);
  const totalSpent = trips.reduce((s, t) => s + (t.spent || 0), 0);
  const remaining = totalBudget - totalSpent;
  const budgetPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const totalDays = trips.reduce((s, t) => {
    const start = new Date(t.start_date);
    const end = new Date(t.end_date);
    return s + Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
  }, 0);
  const avgPerDay = totalDays > 0 ? Math.round(totalSpent / totalDays) : 0;

  const tripBudgetData = trips.map(t => ({
    name: t.title.length > 12 ? t.title.slice(0, 12) + '…' : t.title,
    budget: t.budget,
    spent: t.spent,
  }));

  const categoryData = useMemo(() => {
    const cats = {};
    trips.forEach(t => {
      t.itinerary?.forEach(day => {
        day.activities?.forEach(act => {
          const type = act.type || 'other';
          cats[type] = (cats[type] || 0) + (act.cost || 0);
        });
      });
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [trips]);

  const alerts = trips.filter(t => t.budget > 0 && (t.spent / t.budget) > 0.8);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl px-3 py-2 text-sm" style={{ background: 'rgba(20,23,35,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {payload.map((p, i) => (
          <p key={i} className="text-dark-200"><span style={{ color: p.color }}>●</span> {p.name}: ₹{p.value?.toLocaleString('en-IN')}</p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Budget Dashboard</h1>
        <p className="section-subtitle">Track your travel expenses in ₹</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Budget', value: `₹${totalBudget.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-accent-400', bg: 'from-accent-500/15 to-accent-600/5' },
          { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: ArrowUp, color: 'text-red-400', bg: 'from-red-500/15 to-red-600/5' },
          { label: 'Remaining', value: `₹${remaining.toLocaleString('en-IN')}`, icon: ArrowDown, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-600/5' },
          { label: 'Used', value: `${budgetPercent}%`, icon: TrendingUp, color: 'text-amber-400', bg: 'from-amber-500/15 to-amber-600/5' },
          { label: 'Avg / Day', value: `₹${avgPerDay.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-teal-400', bg: 'from-teal-500/15 to-teal-600/5' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-white">{s.value}</p>
            <span className="text-[10px] text-dark-400 uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}
                    dataKey="value" label={({ name, value }) => `${name}: ₹${value.toLocaleString('en-IN')}`}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-dark-400 text-sm">No spending data yet</p>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4">Budget vs Spent by Trip</h3>
          {tripBudgetData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tripBudgetData} barGap={4}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b6f82' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b6f82' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#9a9dab' }} />
                  <Bar dataKey="budget" fill="#5a9fff" radius={[4, 4, 0, 0]} name="Budget" />
                  <Bar dataKey="spent" fill="#f87171" radius={[4, 4, 0, 0]} name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-dark-400 text-sm">No trip data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Budget Alerts
        </h3>
        {alerts.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-emerald-300">All trips are within budget. Great job!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map(t => {
              const pct = Math.round((t.spent / t.budget) * 100);
              return (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: pct > 100 ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${pct > 100 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}` }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${pct > 100 ? 'text-red-400' : 'text-amber-400'}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{t.title}</p>
                      <p className="text-xs text-dark-400">₹{t.spent.toLocaleString('en-IN')} of ₹{t.budget.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${pct > 100 ? 'text-red-400' : 'text-amber-400'}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trip breakdown */}
      <div>
        <h3 className="font-semibold text-white mb-4">Trip Budget Details</h3>
        <div className="space-y-3">
          {trips.map(t => {
            const pct = t.budget > 0 ? Math.round((t.spent / t.budget) * 100) : 0;
            return (
              <div key={t.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white text-sm truncate mr-4">{t.title}</h4>
                  <span className="text-xs text-dark-400 whitespace-nowrap">{pct}% used</span>
                </div>
                <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden mb-1">
                  <div className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-accent-500'}`}
                    style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-dark-400">
                  <span>₹{t.spent.toLocaleString('en-IN')} spent</span>
                  <span>₹{t.budget.toLocaleString('en-IN')} budget</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
