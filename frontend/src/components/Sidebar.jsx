import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, PlusCircle, Search, Compass,
  IndianRupee, ClipboardList, BookOpen, User, BarChart3,
  Settings, X, Plane,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Trips', path: '/trips', icon: Map },
  { name: 'Create Trip', path: '/create-trip', icon: PlusCircle },
  { name: 'City Search', path: '/city-search', icon: Search },
  { name: 'Activities', path: '/activities', icon: Compass },
  { name: 'Budget', path: '/budget', icon: IndianRupee },
  { name: 'Packing', path: '/packing', icon: ClipboardList },
  { name: 'Journal', path: '/journal', icon: BookOpen },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Admin', path: '/admin', icon: BarChart3 },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo - mobile */}
      <div className="flex items-center justify-between px-5 py-5 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold font-display gradient-text">Traveloop</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <X className="w-5 h-5 text-dark-300" />
        </button>
      </div>

      {/* Logo - desktop */}
      <div className="hidden lg:flex items-center gap-2.5 px-5 py-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center">
          <Plane className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold font-display gradient-text">Traveloop</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <NavLink to="/settings" onClick={onClose} className="sidebar-link">
          <Settings className="w-[18px] h-[18px]" />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 xl:w-64 fixed top-0 bottom-0 left-0 z-40"
        style={{
          background: 'rgba(13, 15, 24, 0.95)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}>
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 lg:hidden"
              style={{
                background: 'rgba(13, 15, 24, 0.98)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
