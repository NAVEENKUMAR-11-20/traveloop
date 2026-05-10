import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Eye, EyeOff, User, Plane } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { handleGoogleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPw) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    // Note: We're using the mock signup for now, similar to login
    toast.success('Account created successfully!');
    navigate('/dashboard');
    setLoading(false);
  };

  const onGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      await handleGoogleLogin(credentialResponse);
      navigate('/dashboard');
    } catch (err) {
      setError('Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Full-screen background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-3xl p-8 sm:p-10"
          style={{
            background: 'rgba(13, 15, 24, 0.65)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
          }}>
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-teal-500/20 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-6 h-6 text-accent-400" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white mb-1">Join Traveloop</h1>
            <p className="text-sm text-dark-300">Create your account to start exploring</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-300"
              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-400" />
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Full name" required className="input-field pl-11" />
            </div>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" required className="input-field pl-11" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-400" />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password (min. 6 chars)" required className="input-field pl-11 pr-11" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors">
                {showPw ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-400" />
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="Confirm password" required className="input-field pl-11" />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="w-4 h-4 rounded border-dark-500 bg-dark-800 text-accent-500 mt-0.5" />
              <span className="text-xs text-dark-400">
                I agree to the <a href="#" className="text-accent-400 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-accent-400 hover:underline">Privacy Policy</a>
              </span>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base font-semibold">
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              ) : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-dark-400">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Login Component */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => setError('Google signup failed')}
              useOneTap
              theme="filled_black"
              shape="pill"
              size="large"
              width="100%"
            />
          </div>

          <p className="mt-5 text-center text-sm text-dark-400">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-400 font-medium hover:text-accent-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
