import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Smartphone } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface VerifyScreenProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
}

export const VerifyScreen = ({ email, onVerify, onResend, onBack }: VerifyScreenProps) => {
  const { t } = useTranslation();
  const [checking, setChecking] = useState(false);
  
  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      await onVerify(''); // The code is not used for link verification
    } finally {
      setChecking(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-white z-[90] flex overflow-hidden">
        {/* Left Side - Branding/Image (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-100 relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg" 
              alt="Verify" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="relative z-10 max-w-md text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg">Verify your email.</h1>
            <p className="text-lg text-white leading-relaxed font-medium drop-shadow-md">
              We've sent a verification link to your email. Please click the link to activate your account.
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
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Check your email</h2>
              <p className="text-slate-500 leading-relaxed text-lg">
                We sent a verification link to: <br/>
                <span className="text-slate-900 font-bold">{email}</span>
              </p>
              <p className="mt-4 text-sm text-slate-400 italic">
                Please click the link in the email, then come back here and click "I've Verified My Email".
              </p>
            </div>
          
          <div className="text-center mb-10">
            <p className="text-sm text-slate-500">
              {t('didntReceive')} <button onClick={onResend} className="text-primary font-bold hover:underline">{t('resendCode')}</button>
            </p>
          </div>
          
          <button 
            disabled={checking}
            onClick={handleCheckStatus}
            className="w-full py-4 rounded-2xl bg-primary font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {checking && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            I've Verified My Email
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
