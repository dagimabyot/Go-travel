import React, { useState } from 'react';
import { ChevronLeft, Edit3, SlidersHorizontal, Plane, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Flight } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface FlightListScreenProps {
  onBack: () => void;
  onSelectFlight: (f: Flight) => void;
  appearance: string;
}

export const FlightListScreen = ({ onBack, onSelectFlight, appearance }: FlightListScreenProps) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    stops: 'any',
    maxPrice: 500,
    maxDuration: 12
  });

  const flights: Flight[] = [
    { id: '1', airline: 'Larkrow', from: 'Sylhet', to: 'Manarola', departure: '7:30 AM', arrival: '9:30 PM', price: 150, duration: '2h 40m', class: 'Economy', status: 'On Time' },
    { id: '2', airline: 'Larkrow', from: 'Sylhet', to: 'Manarola', departure: '7:50 AM', arrival: '9:50 PM', price: 150, duration: '2h 40m', class: 'Economy', status: 'Delayed' },
    { id: '3', airline: 'Larkrow', from: 'Sylhet', to: 'Manarola', departure: '7:50 AM', arrival: '9:50 PM', price: 150, duration: '2h 40m', class: 'Economy', status: 'Cancelled' },
  ];

  const renderFilters = () => (
    <AnimatePresence>
      {showFilters && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className={`w-full max-w-md rounded-t-[48px] p-8 shadow-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white'}`}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('filterFlights')}</h3>
              <button onClick={() => setShowFilters(false)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Stops */}
              <div>
                <p className={`text-sm font-bold mb-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('stops')}</p>
                <div className="flex gap-3">
                  {['any', 'non-stop', '1 stop'].map(stop => (
                    <button 
                      key={stop}
                      onClick={() => setFilters({ ...filters, stops: stop })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filters.stops === stop ? 'bg-blue-600 text-white' : (appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400')}`}
                    >
                      {t(stop.replace(' ', ''))}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className={`text-sm font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('priceRange')}</p>
                  <p className="text-sm font-bold text-blue-600">${filters.maxPrice}</p>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="10"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-100'}`}
                />
              </div>

              {/* Duration */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className={`text-sm font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('maxDuration')}</p>
                  <p className="text-sm font-bold text-blue-600">{filters.maxDuration}h</p>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="24" 
                  value={filters.maxDuration}
                  onChange={(e) => setFilters({ ...filters, maxDuration: parseInt(e.target.value) })}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-100'}`}
                />
              </div>

              <button 
                onClick={() => setShowFilters(false)}
                className={`w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold text-lg shadow-lg ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
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
    <div className={`min-h-screen pb-24 pt-8 px-6 max-w-4xl mx-auto transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className={`w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('flight')}</h1>
        <button 
          onClick={onBack}
          className={`w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}
        >
          <Edit3 size={20} />
        </button>
      </header>

      <div className="flex items-center gap-2 mb-12">
        <div className={`flex-1 p-6 rounded-[32px] shadow-sm border relative transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
          <p className="text-xs font-bold text-slate-400 mb-1">{t('from')}</p>
          <p className={`text-xl font-bold truncate ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Sylhet</p>
          <p className="text-xs text-slate-400 truncate">Bangladesh</p>
        </div>
        <div className={`z-10 shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}>
          <Plane size={20} className="rotate-45" />
        </div>
        <div className={`flex-1 p-6 rounded-[32px] shadow-sm border text-right transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
          <p className="text-xs font-bold text-slate-400 mb-1">{t('to')}</p>
          <p className={`text-xl font-bold truncate ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Manarola</p>
          <p className="text-xs text-slate-400 truncate">Italy</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('popularFlights')}</h2>
        <button 
          onClick={() => setShowFilters(true)}
          className={`flex items-center gap-2 font-bold text-sm transition-colors ${appearance === 'Dark Mode' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-blue-600'}`}
        >
          {t('filter')} <SlidersHorizontal size={16} />
        </button>
      </div>

      <div className="space-y-6">
        {flights.map(flight => (
          <div 
            key={flight.id}
            onClick={() => onSelectFlight(flight)}
            className={`p-6 rounded-[40px] border shadow-sm hover:shadow-md transition-all cursor-pointer relative ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-white border-slate-50 shadow-slate-100'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight.departure}</p>
                <p className="text-xs text-slate-400 truncate">{flight.airline}</p>
              </div>
              <div className="flex-[1.5] px-2 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-bold text-blue-500 mb-1">100% {t('onTime')}</p>
                  <div className="flex items-center gap-2 w-full min-w-[60px]">
                    <div className={`h-px flex-1 ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-100'}`} />
                    <Plane size={14} className="text-blue-600 rotate-45" />
                    <div className={`h-px flex-1 ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-100'}`} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">{flight.duration}</p>
                </div>
                {flight.status && (
                  <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold inline-block ${
                    flight.status === 'On Time' ? 'bg-emerald-500/10 text-emerald-500' :
                    flight.status === 'Delayed' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-rose-500/10 text-rose-500'
                  }`}>
                    {t(flight.status.toLowerCase().replace(' ', ''))}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-right">
                <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight.arrival}</p>
                <p className="text-xs text-slate-400 truncate">Goa</p>
              </div>
            </div>
            <div className={`flex justify-between items-center pt-4 border-t ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-slate-50'}`}>
              <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
                ${flight.price}<span className="text-xs text-slate-400 font-normal">/{t('perPerson')}</span>
              </p>
              <button className={`w-8 h-8 border rounded-full flex items-center justify-center transition-colors shadow-sm ${appearance === 'Dark Mode' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-100 text-slate-400'}`}>
                <Star size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {renderFilters()}
    </div>
  );
};
