import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Filter, Plane, X } from 'lucide-react';
import { Flight } from '../../types';
import { translations } from '../../constants/translations';

interface FlightResultsScreenProps {
  flights: Flight[];
  onSelect: (f: Flight) => void;
  onBack: () => void;
  language: string;
}

export const FlightResultsScreen = ({ flights, onSelect, onBack, language }: FlightResultsScreenProps) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  const [sortBy, setSortBy] = useState('cheapest');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);

  const filteredFlights = flights
    .filter(f => f.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === 'cheapest') return a.price - b.price;
      if (sortBy === 'fastest') return 0; // Mocked
      if (sortBy === 'earliest') return new Date(a.departure).getTime() - new Date(b.departure).getTime();
      return 0;
    });

  const renderFilters = () => (
    <AnimatePresence>
      {showFilters && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="w-full max-w-md bg-white rounded-t-[48px] p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">{t('filterFlights')}</h3>
              <button onClick={() => setShowFilters(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-bold text-slate-900">{t('maxPrice')}</p>
                  <p className="text-sm font-bold text-primary">${maxPrice}</p>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="2000" 
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <button 
                onClick={() => setShowFilters(false)}
                className="w-full py-5 bg-primary text-white rounded-[24px] font-bold text-lg shadow-lg shadow-primary/30"
              >
                {t('applyFilters')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="pb-24 pt-4 px-4 md:px-6 max-w-4xl mx-auto overflow-x-hidden bg-white min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm border border-slate-100">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('availableFlights')}</h1>
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className="bg-white p-2 rounded-full shadow-sm border border-slate-100 active:scale-95 transition-all"
        >
          <Filter size={20} className="text-slate-600" />
        </button>
      </header>

      <div className="bg-primary p-6 rounded-[32px] text-white mb-8 shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="flex justify-between items-center relative z-10">
          <div className="text-center">
            <p className="text-2xl font-bold">LHR</p>
            <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest">London</p>
          </div>
          <div className="flex-1 px-4 flex flex-col items-center">
            <div className="w-full h-[1px] bg-white/30 relative">
              <Plane size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
            </div>
            <p className="text-[10px] font-bold opacity-60 mt-2 uppercase tracking-widest">8h 45m</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">JFK</p>
            <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest">New York</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar">
        <SortOption label={t('cheapest')} active={sortBy === 'cheapest'} onClick={() => setSortBy('cheapest')} />
        <SortOption label={t('fastest')} active={sortBy === 'fastest'} onClick={() => setSortBy('fastest')} />
        <SortOption label={t('earliest')} active={sortBy === 'earliest'} onClick={() => setSortBy('earliest')} />
      </div>

      <div className="space-y-6">
        {filteredFlights.length > 0 ? (
          filteredFlights.map((flight) => (
            <motion.div 
              key={flight.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onSelect(flight)}
              className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 cursor-pointer hover:border-primary/50 transition-all group"
            >
              <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl">
                <p className="text-lg font-bold text-slate-900">{t('date')} : {flight.departure ? flight.departure.replace(' ', ' T') : '2026-08-20 T14:00:00'}</p>
                <p className="text-lg font-bold text-slate-900">{t('from')} : {flight.from}</p>
                <p className="text-lg font-bold text-slate-900">{t('to')} : {flight.to}</p>
                <p className="text-lg font-bold text-slate-900">{t('flight')} : {flight.airline}</p>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                <p className="text-2xl font-bold text-primary">${flight.price}<span className="text-xs font-normal text-slate-400 ml-1">/ {t('perPerson')}</span></p>
                <button className="px-6 py-2 bg-primary text-white rounded-full text-sm font-bold shadow-md shadow-primary/20">
                  {t('select')}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
            <p className="text-lg font-bold text-slate-900 mb-2">{t('noFlightsFound')}</p>
            <p className="text-sm">{t('tryAdjustingFilters')}</p>
          </div>
        )}
      </div>
      {renderFilters()}
    </div>
  );
};

const SortOption = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-slate-400 border border-slate-100'}`}
  >
    {label}
  </button>
);
