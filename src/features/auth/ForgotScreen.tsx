import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Mail } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface ForgotScreenProps {
  onSend: (email: string) => void;
  onBack: () => void;
}

export const ForgotScreen = ({ onSend, onBack }: ForgotScreenProps) => {
  const [email, setEmail] = useState('dagim045@gmail.com');
  const [sent, setSent] = useState(false);
  const { t } = useTranslation();
  
  const handleSend = () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    onSend(email);
    setSent(true);
  };

  return (
    <div className="fixed inset-0 bg-white z-[90] flex overflow-hidden">
        {/* Left Side - Branding/Image (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-100 relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg" 
              alt="Security" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="relative z-10 max-w-md text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg">Secure your account.</h1>
            <p className="text-lg text-white leading-relaxed font-medium drop-shadow-md">
              We'll help you get back into your account in just a few steps.
            </p>
          </div>
        </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 h-full bg-slate-50 overflow-y-auto hide-scrollbar relative">
        {/* Decorative Background Elements (Desktop Only) */}
        <div className="hidden lg:block absolute top-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden lg:block absolute bottom-1/4 -left-20 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="min-h-full w-full flex flex-col items-center justify-center py-12 lg:py-20 px-6 lg:px-12">
          <div className="w-full max-w-2xl lg:bg-white/70 lg:backdrop-blur-xl lg:rounded-[32px] lg:shadow-[0_20px_50px_rgba(0,0,0,0.1)] lg:p-12 lg:border lg:border-white/50 lg:bg-gradient-to-br lg:from-white lg:to-slate-50/50 animate-in fade-in zoom-in duration-700">
            <button onClick={onBack} className="mb-8 group flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                <ArrowLeft size={18} />
              </div>
              <span className="text-sm font-medium">Back to Sign In</span>
            </button>
            
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{t('forgotPassword')}</h2>
              <p className="text-slate-500 text-lg leading-relaxed">{t('enterEmailReset')}</p>
            </div>
          
          {sent ? (
            <div className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-emerald-500/20">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check your email</h3>
              <p className="text-sm text-slate-600 mb-8">We've sent a password reset link to <span className="font-bold text-slate-900">{email}</span></p>
              <button 
                onClick={onBack}
                className="w-full py-4 rounded-2xl bg-primary font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">{t('email')}</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                />
              </div>

              <button 
                onClick={handleSend}
                className="w-full py-4 rounded-2xl bg-primary font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {t('sendCode')}
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
