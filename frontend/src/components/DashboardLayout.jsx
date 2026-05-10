import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const BACKGROUNDS = {
  '/dashboard': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
  '/trips': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
  '/create-trip': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
  '/budget': 'https://images.unsplash.com/photo-1434031215662-72ee3399c15f?q=80&w=2070&auto=format&fit=crop',
  '/profile': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
  '/city-search': 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=2070&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop'
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const bgImage = useMemo(() => {
    return BACKGROUNDS[location.pathname] || BACKGROUNDS.default;
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#05060b' }}>
      {/* Cinematic Nature Background */}
      <div className="fixed inset-0 z-0 transition-all duration-1000">
        <img 
          src={bgImage} 
          alt="Nature Background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#05060b]/90 via-[#05060b]/40 to-[#05060b]/80" />
        <div className="absolute inset-0 backdrop-blur-[4px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Navbar />

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
          style={{ background: 'rgba(20, 23, 35, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Menu className="w-5 h-5 text-dark-200" />
        </button>

        {/* Main content area */}
        <main className="pt-16 lg:pl-60 xl:pl-64 flex-1">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
