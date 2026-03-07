import React from 'react';
import { Chrome, Facebook, Plane } from 'lucide-react';
import { translations } from '../../constants/translations';
import { authService } from '../../services/auth';

interface WelcomeScreenProps {
  onSignup: () => void;
  onLogin: () => void;
  language: string;
}

export const WelcomeScreen = ({ onSignup, onLogin, language }: WelcomeScreenProps) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const url = await authService.getSocialAuthUrl(provider);
      const authWindow = window.open(url, 'oauth_popup', 'width=600,height=700');
      
      if (!authWindow) {
        alert('Please allow popups for this site to connect your account.');
      }
    } catch (error) {
      console.error(`${provider} auth error:`, error);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[90] flex flex-col">
      <div className="relative h-[65%] w-full overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg" 
          alt="Traveler" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>
      
      <div className="flex-1 px-8 flex flex-col items-center -mt-24 relative z-10">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">{t('welcome')}</h2>
        <p className="text-slate-500 text-center mb-10 max-w-[260px] text-sm leading-relaxed">{t('exploreExperience')}</p>
        
        <div className="w-full space-y-4">
          <button 
            onClick={() => handleSocialLogin('google')}
            className="w-full py-4 rounded-full border border-slate-100 flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          >
            <Chrome size={20} className="text-red-500" />
            {t('continueWithGoogle')}
          </button>
          
          <button 
            onClick={() => handleSocialLogin('facebook')}
            className="w-full py-4 rounded-full border border-slate-100 flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          >
            <Facebook size={20} className="text-blue-600" />
            {t('continueWithFacebook')}
          </button>
        </div>
        
        <div className="mt-auto mb-10 flex gap-1 text-sm">
          <span className="text-slate-400">{t('noAccount').split('?')[0]}?</span>
          <button onClick={onSignup} className="text-red-500 font-bold">{t('noAccount').split('?')[1].trim()}</button>
          <span className="text-slate-400 mx-1">or</span>
          <button onClick={onLogin} className="text-primary font-bold">{t('alreadyAccount').split('?')[1].trim()}</button>
        </div>
      </div>
    </div>
  );
};
