import React, { useState } from 'react';
import { ChevronLeft, Plane, Calendar, Users, Search } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface FlightSearchScreenProps {
  onBack: () => void;
  onSearch: (searchParams: any) => void;
  appearance: string;
}

export const FlightSearchScreen = ({ onBack, onSearch, appearance }: FlightSearchScreenProps) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState('');

  const { t } = useTranslation();

  return (
    <div className={`min-h-screen pb-24 pt-8 px-6 max-w-4xl mx-auto transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-between mb-12 relative">
        <button 
          onClick={onBack}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-100'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold absolute left-1/2 -translate-x-1/2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('flight')}</h1>
        <div className="w-12" /> {/* Spacer */}
      </header>

      <div className="space-y-6">
        {/* From */}
        <div className={`flex items-center gap-4 p-6 border rounded-[32px] shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 ${appearance === 'Dark Mode' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <Plane size={24} className="rotate-45" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('from')}</p>
            <div className="flex items-center justify-between gap-2">
              <input 
                type="text" 
                value={from} 
                onChange={(e) => setFrom(e.target.value)}
                placeholder={t('fromPlaceholder')}
                className={`text-lg font-bold bg-transparent focus:outline-none w-full truncate ${appearance === 'Dark Mode' ? 'text-white placeholder:text-slate-700' : 'text-slate-900 placeholder:text-slate-300'}`}
              />
              <div className="w-6 h-4 bg-green-600 rounded-sm relative flex items-center justify-center overflow-hidden shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* To */}
        <div className={`flex items-center gap-4 p-6 border rounded-[32px] shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 ${appearance === 'Dark Mode' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <Plane size={24} className="rotate-[135deg]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('to')}</p>
            <div className="flex items-center justify-between gap-2">
              <input 
                type="text" 
                value={to} 
                onChange={(e) => setTo(e.target.value)}
                placeholder={t('toPlaceholder')}
                className={`text-lg font-bold bg-transparent focus:outline-none w-full truncate ${appearance === 'Dark Mode' ? 'text-white placeholder:text-slate-700' : 'text-slate-900 placeholder:text-slate-300'}`}
              />
              <div className="w-6 h-4 bg-green-600 rounded-sm relative flex flex-col shrink-0 overflow-hidden">
                <div className="h-1/3 bg-green-600 w-full" />
                <div className="h-1/3 bg-white w-full" />
                <div className="h-1/3 bg-red-600 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className={`flex items-center gap-6 p-6 border rounded-[32px] shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 ${appearance === 'Dark Mode' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <Calendar size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('date')}</p>
            <input 
              type="text" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              placeholder={t('datePlaceholder')}
              className={`text-lg font-bold bg-transparent focus:outline-none w-full ${appearance === 'Dark Mode' ? 'text-white placeholder:text-slate-700' : 'text-slate-900 placeholder:text-slate-300'}`}
            />
          </div>
        </div>

        {/* Return Date */}
        <div className={`flex items-center gap-6 p-6 border rounded-[32px] shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 ${appearance === 'Dark Mode' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <Calendar size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('returnDate')}</p>
            <input 
              type="text" 
              value={returnDate} 
              onChange={(e) => setReturnDate(e.target.value)}
              placeholder={t('datePlaceholder')}
              className={`text-lg font-bold bg-transparent focus:outline-none w-full ${appearance === 'Dark Mode' ? 'text-white placeholder:text-slate-700' : 'text-slate-900 placeholder:text-slate-300'}`}
            />
          </div>
        </div>

        {/* Traveler */}
        <div className={`flex items-center gap-6 p-6 border rounded-[32px] shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 ${appearance === 'Dark Mode' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <Users size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('traveler')}</p>
            <input 
              type="text" 
              value={travelers} 
              onChange={(e) => setTravelers(e.target.value)}
              placeholder={t('travelerPlaceholder')}
              className={`text-lg font-bold bg-transparent focus:outline-none w-full ${appearance === 'Dark Mode' ? 'text-white placeholder:text-slate-700' : 'text-slate-900 placeholder:text-slate-300'}`}
            />
          </div>
        </div>

        <button 
          onClick={() => onSearch({ from, to, date, returnDate, travelers })}
          className={`w-full bg-blue-600 text-white py-6 rounded-[32px] font-bold text-xl shadow-xl active:scale-95 transition-all mt-8 ${appearance === 'Dark Mode' ? 'shadow-blue-900/20' : 'shadow-blue-200'}`}
        >
          {t('search')}
        </button>
      </div>
    </div>
  );
};
