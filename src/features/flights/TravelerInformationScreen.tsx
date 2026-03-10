import React, { useState } from 'react';
import { ChevronLeft, User } from 'lucide-react';
import { Traveler } from '../../types';
import { translations } from '../../constants/translations';

interface TravelerInformationScreenProps {
  guestCount: number;
  user: import('../../types').User | null;
  onBack: () => void;
  onContinue: (travelers: Traveler[]) => void;
  appearance: string;
  language: string;
  initialTravelers?: Traveler[];
}

export const TravelerInformationScreen = ({ guestCount, user, onBack, onContinue, appearance, language, initialTravelers }: TravelerInformationScreenProps) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  const [travelers, setTravelers] = useState<Traveler[]>(() => {
    if (initialTravelers && initialTravelers.length === guestCount) {
      return initialTravelers;
    }
    return Array(guestCount).fill(null).map(() => ({
      fullName: '',
      passportNumber: '',
      nationality: '',
      dateOfBirth: '',
      passportExpiration: '',
      gender: ''
    }));
  });

  const [errors, setErrors] = useState<Record<number, string>>({});

  const updateTraveler = (index: number, field: keyof Traveler, value: string) => {
    const newTravelers = [...travelers];
    newTravelers[index] = { ...newTravelers[index], [field]: value };
    setTravelers(newTravelers);

    if (field === 'passportExpiration') {
      const expiryDate = new Date(value);
      const today = new Date();
      if (expiryDate < today) {
        setErrors(prev => ({ ...prev, [index]: t('passportExpired') }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
      }
    }
  };

  const isComplete = travelers.every((t, idx) => 
    t.fullName.trim() && 
    t.passportNumber.trim() && 
    t.nationality.trim() && 
    t.dateOfBirth.trim() && 
    t.passportExpiration.trim() &&
    t.gender &&
    !errors[idx]
  );

  return (
    <div className={`min-h-screen pb-24 pt-8 px-4 sm:px-6 max-w-2xl mx-auto transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-between mb-10 relative">
        <button onClick={onBack} className={`w-10 h-10 sm:w-12 sm:h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-lg sm:text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('travelerDetails')}</h1>
        <div className="w-10 sm:w-12" />
      </header>

      <div className="space-y-8">
        <div className="flex items-center gap-3 text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-bold">{t('passengerInfo')}</p>
            <p className="text-[11px] opacity-70">{t('provideDetailsFor')} {guestCount} {t('traveler')}{guestCount > 1 ? 's' : ''}</p>
          </div>
        </div>

        {travelers.map((traveler, index) => (
          <div key={index} className={`p-5 sm:p-8 rounded-[32px] border transition-all ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={`text-base sm:text-lg font-bold flex items-center gap-3 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
                <span className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center text-sm">0{index + 1}</span>
                {t('traveler')} {index + 1}
              </h3>
              {errors[index] && (
                <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/30">
                  {errors[index]}
                </span>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('fullNamePassport')}</label>
                <input 
                  type="text" 
                  value={traveler.fullName} 
                  onChange={e => updateTraveler(index, 'fullName', e.target.value)} 
                  placeholder="e.g. Johnathan Doe"
                  className={`w-full text-sm font-bold px-5 py-4 rounded-2xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-600' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-600'}`} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('gender')}</label>
                  <select 
                    value={traveler.gender} 
                    onChange={e => updateTraveler(index, 'gender', e.target.value as any)} 
                    className={`w-full text-sm font-bold px-5 py-4 rounded-2xl border focus:outline-none transition-all appearance-none ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-600' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-600'}`}
                  >
                    <option value="">{t('selectGender')}</option>
                    <option value="Male">{t('male')}</option>
                    <option value="Female">{t('female')}</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('nationality')}</label>
                  <input 
                    type="text" 
                    value={traveler.nationality} 
                    onChange={e => updateTraveler(index, 'nationality', e.target.value)} 
                    placeholder="e.g. American"
                    className={`w-full text-sm font-bold px-5 py-4 rounded-2xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-600' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-600'}`} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('passportNumber')}</label>
                <input 
                  type="text" 
                  value={traveler.passportNumber} 
                  onChange={e => updateTraveler(index, 'passportNumber', e.target.value)} 
                  placeholder="e.g. A12345678"
                  className={`w-full text-sm font-bold px-5 py-4 rounded-2xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-600' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-600'}`} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('dob')}</label>
                  <input 
                    type="date" 
                    value={traveler.dateOfBirth} 
                    onChange={e => updateTraveler(index, 'dateOfBirth', e.target.value)} 
                    className={`w-full text-sm font-bold px-5 py-4 rounded-2xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-600' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-600'}`} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('passportExpiry')}</label>
                  <input 
                    type="date" 
                    value={traveler.passportExpiration} 
                    onChange={e => updateTraveler(index, 'passportExpiration', e.target.value)} 
                    className={`w-full text-sm font-bold px-5 py-4 rounded-2xl border focus:outline-none transition-all ${errors[index] ? 'border-red-500 focus:border-red-500' : appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-600' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-600'}`} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button 
            onClick={() => onContinue(travelers)}
            disabled={!isComplete}
            className={`w-full bg-blue-600 text-white py-6 rounded-[32px] font-bold text-lg shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
          >
            {t('confirmProceedPayment')}
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-6 font-medium uppercase tracking-widest">{t('securePaymentNote')}</p>
        </div>
      </div>
    </div>
  );
};
