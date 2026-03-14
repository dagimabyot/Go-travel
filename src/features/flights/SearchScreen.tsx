import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Plane } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface SearchScreenProps {
  onSearch: (from: string, to: string, date: string, flightClass: string) => void;
  currency: string;
}

export const SearchScreen = ({ onSearch, currency }: SearchScreenProps) => {
  const [from, setFrom] = useState('New York (JFK)');
  const [to, setTo] = useState('Paris (CDG)');
  const [date, setDate] = useState('2026-06-20');
  const [flightClass, setFlightClass] = useState('Economy');
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white pb-24 pt-8 px-6 max-w-4xl mx-auto flex flex-col">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={() => window.history.back()} className="bg-slate-50 p-2 rounded-full border border-slate-100">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('flight')}</h1>
      </header>

      <div className="flex-1 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[32px] border border-slate-100">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Plane size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{t('from')}</p>
              <input 
                type="text" 
                value={from} 
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[32px] border border-slate-100">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{t('to')}</p>
              <input 
                type="text" 
                value={to} 
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[32px] border border-slate-100">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Calendar size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{t('date')}</p>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 outline-none text-xs"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[32px] border border-slate-100">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{t('traveler')}</p>
                <p className="font-bold text-slate-900 text-xs">1 {t('person')}</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onSearch(from, to, date, flightClass)}
          className="w-full bg-primary text-white py-5 rounded-[24px] font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all mt-auto"
        >
          {t('search')}
        </button>
      </div>
    </div>
  );
};
