import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, MapPin, IndianRupee, ClipboardList, Share2, BarChart3, ArrowRight, Star, ChevronRight } from 'lucide-react';

const features = [
  { icon: MapPin, title: 'Smart Itineraries', desc: 'Plan day-by-day itineraries with activities, timings, and costs.' },
  { icon: IndianRupee, title: 'Budget Tracking', desc: 'Track every rupee spent with visual breakdowns and alerts.' },
  { icon: ClipboardList, title: 'Packing Lists', desc: 'Never forget essentials with categorized checklists.' },
  { icon: Share2, title: 'Share & Collaborate', desc: 'Share your trips publicly or collaborate with travel buddies.' },
  { icon: BarChart3, title: 'Travel Analytics', desc: 'Insights on your travel patterns and spending habits.' },
  { icon: Star, title: 'Discover Places', desc: 'Explore cities and activities curated for Indian travelers.' },
];

const destinations = [
  { name: 'Manali', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=80', tag: 'Mountains' },
  { name: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80', tag: 'Beaches' },
  { name: 'Jaipur', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&q=80', tag: 'Heritage' },
  { name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80', tag: 'Tropical' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0d0f18' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
        style={{ background: 'rgba(13,15,24,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold font-display gradient-text">Traveloop</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm">Log in</Link>
            <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
          </div>
          <Link to="/signup" className="sm:hidden btn-primary text-sm py-2 px-4">Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" alt="Mountains" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0f18] via-transparent to-[#0d0f18]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-24 sm:py-36">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: 'rgba(59,125,255,0.1)', color: '#5a9fff', border: '1px solid rgba(59,125,255,0.2)' }}>
              <Plane className="w-3.5 h-3.5" /> Your travel companion
            </span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
            Personalized Travel<br />
            <span className="gradient-text">Planning Made Easy</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-dark-300 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Plan trips, build itineraries, track budgets in ₹, and share your adventures — all in one beautiful app.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
              Start Planning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3">
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-3">Everything You Need</h2>
          <p className="text-dark-400 max-w-lg mx-auto">Smart tools designed for the modern Indian traveler.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <div className="card p-6 h-full">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/15 to-teal-500/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-accent-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-3">Popular Destinations</h2>
          <p className="text-dark-400 max-w-lg mx-auto">Discover trending places loved by travelers.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((d, i) => (
            <motion.div key={d.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer">
                <img src={d.img} alt={d.name} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="badge bg-white/10 backdrop-blur-sm text-white text-[10px] mb-2 border border-white/10">{d.tag}</span>
                  <h3 className="text-white font-bold text-lg">{d.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(59,125,255,0.1), rgba(37,169,158,0.06))', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">Ready to Plan Your Next Trip?</h2>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">Join thousands of travelers who plan smarter with Traveloop.</p>
          <Link to="/signup" className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2">
            Get Started Free <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 border-t border-white/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold font-display gradient-text">Traveloop</span>
          </div>
          <p className="text-xs text-dark-500">© 2026 Traveloop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
