import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Chrome, Facebook, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { authService } from '../../services/auth';

interface LoginScreenProps {
  onLogin: (email: string, pass: string) => void;
  onSignup: () => void;
  onForgot: () => void;
  onGoogleLogin: () => void;
  onBack: () => void;
  initialEmail?: string;
}

export const LoginScreen = ({ onLogin, onSignup, onForgot, onGoogleLogin, onBack, initialEmail = '' }: LoginScreenProps) => {
  const [identifier, setIdentifier] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState<'email' | 'google' | 'facebook' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  
  const validate = () => {
    if (!identifier.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleEmailLogin = async () => {
    if (!validate()) return;
    setError(null);
    setLoading('email');
    try {
      await onLogin(identifier, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setLoading(null);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Authentication method not enabled. Please enable it in the Firebase Console.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setError(null);
    setLoading(provider);
    try {
      if (provider === 'google') {
        await onGoogleLogin();
      } else {
        setError('Facebook login is not configured yet. Please use Google or Email.');
        setLoading(null);
      }
    } catch (err) {
      console.error(`${provider} auth error:`, err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[90] flex overflow-hidden">
        {/* Left Side - Branding/Image (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-100 relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg" 
              alt="Travel" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="relative z-10 max-w-md text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg">Welcome back to your journey.</h1>
            <p className="text-lg text-white leading-relaxed font-medium drop-shadow-md">
              Access your bookings, saved destinations, and personalized travel recommendations.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 h-full bg-slate-50 overflow-y-auto hide-scrollbar relative">
          {/* Decorative Background Elements (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="hidden lg:block absolute bottom-1/4 -left-20 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="min-h-full w-full flex flex-col items-center py-12 lg:py-20 px-6 lg:px-12">
            <div className="w-full max-w-3xl lg:bg-white/70 lg:backdrop-blur-xl lg:rounded-[32px] lg:shadow-[0_20px_50px_rgba(0,0,0,0.1)] lg:p-12 lg:border lg:border-white/50 lg:bg-gradient-to-br lg:from-white lg:to-slate-50/50 animate-in fade-in zoom-in duration-700">
              <button onClick={onBack} className="mb-8 group flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                  <ArrowLeft size={18} />
                </div>
                <span className="text-sm font-medium">Back</span>
              </button>
              
              <div className="mb-10">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Welcome to <span className="text-primary">GoTravel</span></h2>
                <p className="text-slate-500 text-lg lg:text-xl leading-relaxed">Plan smarter trips and manage your journeys in one place.</p>
              </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-8">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
                <input 
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">{t('password')}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm pr-12"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-200 text-primary focus:ring-primary"
                  />
                  <span className="text-xs text-slate-500">Remember Me</span>
                </label>
                <button onClick={onForgot} className="text-xs text-red-500 font-bold hover:underline">Forgot Password?</button>
              </div>
              
              <div className="pt-4 flex flex-col items-center gap-6">
                <button 
                  disabled={loading !== null}
                  onClick={handleEmailLogin}
                  className="w-full py-4 rounded-2xl bg-primary font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading === 'email' && <Loader2 size={18} className="animate-spin" />}
                  {loading === 'email' ? 'Signing In...' : 'Sign In'}
                </button>
                
                <div className="relative py-4 w-full">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white lg:bg-transparent px-4 text-slate-400 font-bold tracking-widest">or sign in with</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <button 
                    disabled={loading !== null}
                    onClick={() => handleSocialLogin('google')}
                    className="group py-3 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-3 font-bold text-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading === 'google' ? (
                      <Loader2 size={18} className="animate-spin text-primary" />
                    ) : (
                      <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-sm">Google</span>
                  </button>
                  
                  <button 
                    disabled={loading !== null}
                    onClick={() => handleSocialLogin('facebook')}
                    className="group py-3 rounded-xl bg-[#1877F2] flex items-center justify-center gap-3 font-bold text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:bg-[#166fe5] transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading === 'facebook' ? (
                      <Loader2 size={18} className="animate-spin text-white" />
                    ) : (
                      <Facebook size={18} className="text-white group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-sm">Facebook</span>
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-500">
                    Don't have an account? <button onClick={onSignup} className="text-primary font-bold hover:underline">Create New Account</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
