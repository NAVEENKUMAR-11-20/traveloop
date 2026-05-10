import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Plane } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast.success('Reset link sent to your email');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-3xl p-8 sm:p-10"
          style={{
            background: 'rgba(13, 15, 24, 0.65)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
          }}>
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-teal-500/20 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-6 h-6 text-accent-400" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white mb-1">Reset Password</h1>
            <p className="text-sm text-dark-300">Enter your email to receive a reset link</p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-teal-400" />
              </div>
              <p className="text-dark-200 mb-1">Check your email</p>
              <p className="text-sm text-dark-400 mb-6">We've sent a reset link to <strong className="text-dark-200">{email}</strong></p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                Back to Login <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email address" required className="input-field pl-11" />
              </div>
              <button type="submit" className="btn-primary w-full py-3 font-semibold">
                Send Reset Link
              </button>
              <p className="text-center text-sm text-dark-400">
                Remember your password?{' '}
                <Link to="/login" className="text-accent-400 font-medium hover:text-accent-300">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
