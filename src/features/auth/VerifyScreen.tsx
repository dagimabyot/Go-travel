import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { translations } from '../../constants/translations';

interface VerifyScreenProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  language: string;
}

export const VerifyScreen = ({ email, onVerify, onResend, onBack, language }: VerifyScreenProps) => {
  const [code, setCode] = useState(['', '', '', '']);
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  
  const handleChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
    
    if (val && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-white z-[90] p-8 flex flex-col">
      <button onClick={onBack} className="mb-10 w-12 h-12 flex items-center justify-center rounded-full border border-slate-50 hover:bg-slate-50 transition-colors">
        <ArrowLeft size={20} className="text-slate-600" />
      </button>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">{t('verification')}</h2>
      <p className="text-slate-400 text-sm mb-12 text-center leading-relaxed">
        Please enter the code we sent to <br/>
        <span className="text-slate-600 font-bold">{email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}</span>
      </p>
      
      <div className="flex justify-center gap-4 mb-12">
        {code.map((c, i) => (
          <input 
            key={i}
            id={`code-${i}`}
            type="text"
            value={c}
            maxLength={1}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-16 h-16 border border-slate-100 rounded-full text-center text-2xl font-bold focus:border-red-500 focus:ring-2 focus:ring-red-500/10 outline-none transition-all"
          />
        ))}
      </div>
      
      <div className="text-center mb-12">
        <p className="text-sm text-slate-400">
          {t('didntReceive')} <button onClick={onResend} className="text-red-500 font-bold">{t('resendCode')}</button>
        </p>
      </div>
      
      <button 
        onClick={() => onVerify(code.join(''))}
        className="btn-primary w-full"
      >
        {t('verify')}
      </button>
    </div>
  );
};
