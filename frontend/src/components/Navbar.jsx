import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Bell, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <nav className="fixed top-0 right-0 z-50 h-16 flex items-center px-4 sm:px-6 lg:px-8 lg:left-60 xl:left-64 left-0"
      style={{
        background: 'rgba(13, 15, 24, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
      <div className="flex items-center justify-between w-full">
        {/* Left spacer for mobile menu button */}
        <div className="lg:hidden w-10" />

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
            <Bell className="w-[18px] h-[18px] text-dark-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
          </button>

          {/* Profile */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'T'}
                </div>
                <span className="hidden sm:block text-sm font-medium text-dark-100 max-w-[120px] truncate">
                  {user?.name || 'Traveler'}
                </span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
                    style={{
                      background: 'rgba(20, 23, 35, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div className="p-4 border-b border-white/5">
                      <p className="font-semibold text-dark-50 truncate">{user?.name}</p>
                      <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/profile" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-dark-200 hover:bg-white/5 transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
