import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { translations } from '../../constants/translations';

interface SignupScreenProps {
  onSignup: (name: string, email: string, pass: string) => void;
  onLogin: () => void;
  onBack: () => void;
  language: string;
}

export const SignupScreen = ({ onSignup, onLogin, onBack, language }: SignupScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  
  return (
    <div className="fixed inset-0 bg-white z-[90] p-8 flex flex-col overflow-y-auto hide-scrollbar">
      <button onClick={onBack} className="mb-10 w-12 h-12 flex items-center justify-center rounded-full border border-slate-50 hover:bg-slate-50 transition-colors">
        <ArrowLeft size={20} className="text-slate-600" />
      </button>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-12">{t('signUp')}</h2>
      
      <div className="space-y-8 flex-1">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('fullName')}</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="input-field"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('email')}</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="input-field"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('password')}</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
            className="input-field"
          />
        </div>
        
        <button 
          onClick={() => onSignup(name, email, password)}
          className="btn-primary w-full"
        >
          {t('createAccount')}
        </button>
        
        <div className="text-center pb-10">
          <p className="text-sm text-slate-400">
            {t('alreadyAccount').split('?')[0]}? <button onClick={onLogin} className="text-primary font-bold">{t('alreadyAccount').split('?')[1].trim()}</button>
          </p>
        </div>
      </div>
    </div>
  );
};
