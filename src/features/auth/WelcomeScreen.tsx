import React, { useState } from 'react';
import { Chrome, Facebook, Plane, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { authService } from '../../services/auth';

interface WelcomeScreenProps {
  onSignup: () => void;
  onLogin: () => void;
  onGoogleLogin: () => void;
}

export const WelcomeScreen = ({ onSignup, onLogin, onGoogleLogin }: WelcomeScreenProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<'google' | 'facebook' | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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
      {/* Desktop Split Layout */}
      <div className="hidden lg:flex w-full h-full">
        {/* Left Side - Visual Section */}
        <div className="w-1/2 bg-slate-100 relative flex items-center justify-center p-16 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg" 
              alt="Professional Traveler" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="relative z-10 max-w-lg text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
              <Plane size={32} className="text-white" />
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight drop-shadow-lg">Welcome</h1>
            <p className="text-xl text-white leading-relaxed font-medium drop-shadow-md">
              Experience the world's most beautiful destinations with our premium travel planning and booking platform.
            </p>
            
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/80 font-medium drop-shadow-sm">Joined by 10k+ travelers this month</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-1/2 h-full bg-slate-50 overflow-y-auto hide-scrollbar relative">
          {/* Decorative Background Elements */}
          <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="min-h-full w-full flex flex-col items-center justify-center py-12 lg:py-20 px-6 lg:px-12">
            <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-12 border border-white/50 bg-gradient-to-br from-white to-slate-50/50 animate-in fade-in zoom-in duration-700">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                  Welcome to <span className="text-primary">GoTravel</span>
                </h2>
                <p className="text-slate-500 text-xl leading-relaxed max-w-md mx-auto">
                  Plan smarter trips and manage your journeys in one place.
                </p>
              </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm animate-in slide-in-from-top-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative py-4 mb-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/0 px-4 text-slate-400 font-bold tracking-widest">Quick & Secure Sign In</span>
                </div>
              </div>

              <button 
                disabled={loading !== null}
                onClick={() => handleSocialLogin('google')}
                className="group w-full py-4 rounded-2xl bg-white border border-slate-200 flex items-center px-6 gap-4 font-bold text-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  {loading === 'google' ? (
                    <Loader2 size={20} className="animate-spin text-primary" />
                  ) : (
                    <Chrome size={24} className="text-red-500 group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <span className="flex-1 text-left">{t('continueWithGoogle')}</span>
              </button>
              
              <button 
                disabled={loading !== null}
                onClick={() => handleSocialLogin('facebook')}
                className="group w-full py-4 rounded-2xl bg-[#1877F2] flex items-center px-6 gap-4 font-bold text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:bg-[#166fe5] transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
                  {loading === 'facebook' ? (
                    <Loader2 size={20} className="animate-spin text-[#1877F2]" />
                  ) : (
                    <Facebook size={20} className="text-[#1877F2] group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <span className="flex-1 text-left">{t('continueWithFacebook')}</span>
              </button>

              <div className="pt-6 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span>🔒 Secure login. We never share your data.</span>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <button onClick={onSignup} className="text-slate-500 hover:text-primary font-bold transition-colors">Create Account</button>
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <button onClick={onLogin} className="text-slate-500 hover:text-primary font-bold transition-colors">Sign In</button>
                </div>
              </div>
            </div>
            
            <p className="mt-10 text-center text-[11px] text-slate-400 leading-relaxed">
              By continuing, you agree to our <br/>
              <button className="text-slate-500 font-semibold hover:underline">Terms of Service</button> and <button className="text-slate-500 font-semibold hover:underline">Privacy Policy</button>
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Layout (Restored Previous Design) */}
      <div className="lg:hidden w-full h-full flex flex-col bg-white overflow-y-auto">
        <div className="relative h-[60%] w-full overflow-hidden shrink-0">
          <img 
            src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg" 
            alt="Traveler" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>
        
        <div className="flex-1 px-8 flex flex-col items-center -mt-24 relative z-10 pb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">{t('welcome')}</h2>
          <p className="text-slate-500 text-center mb-10 max-w-[260px] text-sm leading-relaxed">{t('exploreExperience')}</p>
          
          {error && (
            <div className="w-full mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="w-full space-y-4">
            <button 
              disabled={loading !== null}
              onClick={() => handleSocialLogin('google')}
              className="w-full py-4 rounded-full border border-slate-100 flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading === 'google' ? (
                <Loader2 size={20} className="animate-spin text-primary" />
              ) : (
                <Chrome size={20} className="text-red-500" />
              )}
              {t('continueWithGoogle')}
            </button>
            
            <button 
              disabled={loading !== null}
              onClick={() => handleSocialLogin('facebook')}
              className="w-full py-4 rounded-full border border-slate-100 flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading === 'facebook' ? (
                <Loader2 size={20} className="animate-spin text-primary" />
              ) : (
                <Facebook size={20} className="text-blue-600" />
              )}
              {t('continueWithFacebook')}
            </button>
          </div>
          
          <div className="mt-auto pt-8 flex gap-1 text-sm">
            <span className="text-slate-400">Don't have an account?</span>
            <button onClick={onSignup} className="text-red-500 font-bold">Sign Up</button>
            <span className="text-slate-400 mx-1">or</span>
            <button onClick={onLogin} className="text-primary font-bold">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
};
