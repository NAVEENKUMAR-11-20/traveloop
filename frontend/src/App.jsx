import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { Suspense, lazy } from 'react';

// Layouts
import DashboardLayout from './components/DashboardLayout';

// Pages (lazy loaded)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CreateTripPage = lazy(() => import('./pages/CreateTripPage'));
const MyTripsPage = lazy(() => import('./pages/MyTripsPage'));
const TripDetailPage = lazy(() => import('./pages/TripDetailPage'));
const CitySearchPage = lazy(() => import('./pages/CitySearchPage'));
const ActivitySearchPage = lazy(() => import('./pages/ActivitySearchPage'));
const BudgetPage = lazy(() => import('./pages/BudgetPage'));
const PackingPage = lazy(() => import('./pages/PackingPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SharedTripPage = lazy(() => import('./pages/SharedTripPage'));

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0f18' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-dark-700 border-t-accent-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-dark-400">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/shared/:id" element={<SharedTripPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-trip" element={<CreateTripPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/trips/:id/edit" element={<CreateTripPage />} />
          <Route path="/city-search" element={<CitySearchPage />} />
          <Route path="/activities" element={<ActivitySearchPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/packing" element={<PackingPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<ProfilePage />} />
          
          {/* Admin Only */}
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                background: 'rgba(20, 23, 35, 0.95)',
                color: '#f0f1f5',
                fontSize: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
              },
            }}
          />
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
