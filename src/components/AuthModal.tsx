import React, { useState } from 'react';
import { 
  CheckSquare, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  HelpCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AuthModalProps {
  onOpenGuide: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onOpenGuide }) => {
  const { signInWithGoogle, signInWithEmail, registerWithEmail, authError, clearAuthError } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    clearAuthError();
    try {
      await signInWithGoogle();
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    clearAuthError();
    try {
      if (tab === 'login') {
        await signInWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name);
      }
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Top Banner with Beginner Guide button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl shadow-2xs transition-all"
        >
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Beginner Setup Guide</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* App Logo */}
        <div className="flex justify-center mb-3">
          <img
            src="/assets/aistudio/first_website-removebg-preview__1__7b41a140.png"
            alt="Malaika Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Task Manager
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Cloud-synced task management with strict per-user access control powered by Google Firebase.
        </p>

        {/* Free Tier Callout */}
        <div className="mt-3 inline-flex items-center justify-center w-full">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            100% Free Firebase Spark Plan &bull; No Card Required
          </span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200/90 space-y-6">
          
          {/* Auth Error Banner if any */}
          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{authError}</div>
            </div>
          )}

          {/* Primary Action: Google 1-Click Sign-In */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 active:scale-98 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Signing In...' : 'Continue with Google'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Instant 1-click access &bull; Verified Google email identity
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <button
                type="button"
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="bg-white px-2 text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium"
              >
                <span>{showEmailForm ? 'Hide Email Options' : 'Or use Email & Password'}</span>
              </button>
            </div>
          </div>

          {/* Email / Password Form (Collapsible) */}
          {showEmailForm && (
            <div className="space-y-4 pt-1 animate-in fade-in duration-150">
              
              {/* Tab Selector: Login vs Register */}
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    clearAuthError();
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    tab === 'login' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    clearAuthError();
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    tab === 'register' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                {tab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'Please wait...' : tab === 'login' ? 'Sign In to Task Manager' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Security Features Bullet Points */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Isolated database sandbox: only you can view your tasks</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Zero cleartext passwords stored: encrypted via Firebase Auth</span>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <p className="mt-4 text-center text-[11px] text-slate-400">
          Want to learn how this was built?{' '}
          <button
            onClick={onOpenGuide}
            className="text-indigo-600 hover:underline font-medium"
          >
            Read the Architecture Guide
          </button>
        </p>

      </div>
    </div>
  );
};
