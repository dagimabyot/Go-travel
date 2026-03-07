import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { translations } from '../../constants/translations';

interface ForgotScreenProps {
  onSend: (email: string) => void;
  onBack: () => void;
  language: string;
}

export const ForgotScreen = ({ onSend, onBack, language }: ForgotScreenProps) => {
  const [email, setEmail] = useState('');
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  
  return (
    <div className="fixed inset-0 bg-white z-[90] p-8 flex flex-col">
      <button onClick={onBack} className="mb-10 w-12 h-12 flex items-center justify-center rounded-full border border-slate-50 hover:bg-slate-50 transition-colors">
        <ArrowLeft size={20} className="text-slate-600" />
      </button>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('forgotPassword')}</h2>
      <p className="text-slate-400 text-sm mb-12">{t('enterEmail')}</p>
      
      <div className="space-y-8 flex-1">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('email')}</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="input-field"
          />
        </div>
        
        <button 
          onClick={() => onSend(email)}
          className="btn-primary w-full"
        >
          {t('send')}
        </button>
      </div>
    </div>
  );
};
