import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface EmailScreenProps {
  onContinue: (email: string) => void;
  onSignup: () => void;
  onBack: () => void;
}

export const EmailScreen = ({ onContinue, onSignup, onBack }: EmailScreenProps) => {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  
  const noAccountText = t('noAccount');
  const noAccountParts = noAccountText.includes('?') ? noAccountText.split('?') : [noAccountText, 'Sign Up'];

  return (
    <div className="fixed inset-0 bg-white z-[90] p-8 flex flex-col">
      <button onClick={onBack} className="mb-10 w-12 h-12 flex items-center justify-center rounded-full border border-slate-50 hover:bg-slate-50 transition-colors">
        <ArrowLeft size={20} className="text-slate-600" />
      </button>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-12">{t('whatsYourEmail')}</h2>
      
      <div className="space-y-8 flex-1">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('email')}</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="input-field"
          />
        </div>
        
        <button 
          onClick={() => onContinue(email)}
          className="btn-primary w-full"
        >
          {t('continue')}
        </button>
        
        <div className="text-center">
          <p className="text-sm text-slate-400">
            {noAccountParts[0].trim()}{noAccountText.includes('?') ? '?' : ''} <button onClick={onSignup} className="text-red-500 font-bold">{noAccountParts[1].trim()}</button>
          </p>
        </div>
      </div>
    </div>
  );
};
