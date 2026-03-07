import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { translations } from '../../constants/translations';

interface PasswordScreenProps {
  onContinue: (password: string) => void;
  onForgot: () => void;
  onBack: () => void;
  language: string;
}

export const PasswordScreen = ({ onContinue, onForgot, onBack, language }: PasswordScreenProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  
  return (
    <div className="fixed inset-0 bg-white z-[90] p-8 flex flex-col">
      <button onClick={onBack} className="mb-10 w-12 h-12 flex items-center justify-center rounded-full border border-slate-50 hover:bg-slate-50 transition-colors">
        <ArrowLeft size={20} className="text-slate-600" />
      </button>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-12">{t('enterPassword')}</h2>
      
      <div className="space-y-8 flex-1">
        <div className="space-y-2 relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('password')}</label>
          <input 
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field pr-12"
          />
          <button 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 bottom-4 text-slate-400 p-1"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <button 
          onClick={() => onContinue(password)}
          className="btn-primary w-full"
        >
          {t('continue')}
        </button>
        
        <div className="text-center">
          <button onClick={onForgot} className="text-sm text-red-500 font-bold">{t('forgotPassword')}</button>
        </div>
      </div>
    </div>
  );
};
