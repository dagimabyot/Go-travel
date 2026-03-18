import React, { useState } from 'react';
import { ChevronLeft, SlidersHorizontal, Bookmark, X } from 'lucide-react';
import { Hotel } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';

interface HotelListScreenProps {
  hotels: Hotel[];
  onBack: () => void;
  onSelectHotel: (h: Hotel) => void;
  savedHotels: Hotel[];
  toggleSavedHotel: (h: Hotel) => void;
  appearance: string;
}

export const HotelListScreen = ({ hotels, onBack, onSelectHotel, savedHotels, toggleSavedHotel, appearance }: HotelListScreenProps) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    rating: 4,
    maxPrice: 200,
  });

  const isSaved = (id: string) => savedHotels.some(h => h.id === id);

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
              <h3 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('filterHotels')}</h3>
              <button onClick={() => setShowFilters(false)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Rating */}
              <div>
                <p className={`text-sm font-bold mb-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('minimumRating')}</p>
                <div className="flex gap-3">
                  {[3, 4, 5].map(star => (
                    <button 
                      key={star}
                      onClick={() => setFilters({ ...filters, rating: star })}
                      className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filters.rating === star ? 'bg-primary text-white' : (appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400')}`}
                    >
                      {star} {t('stars')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className={`text-sm font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('pricePerNight')}</p>
                  <p className="text-sm font-bold text-primary">${filters.maxPrice}</p>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="10"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-100'}`}
                />
              </div>

              <button 
                onClick={() => setShowFilters(false)}
                className={`w-full py-5 bg-primary text-white rounded-[24px] font-bold text-lg shadow-lg ${appearance === 'Dark Mode' ? 'shadow-primary/40' : 'shadow-primary/30'}`}
              >
                {t('applyFilters')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const filteredHotels = hotels.filter(hotel => {
    const matchesRating = hotel.rating >= filters.rating;
    const matchesPrice = hotel.price <= filters.maxPrice;
    return matchesRating && matchesPrice;
  });

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-between px-6 pt-12 mb-8">
        <button onClick={onBack} className={`w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('chooseHotel')}</h1>
          <p className="text-xs text-slate-400">{t('pleaseBookHotel')}</p>
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className={`w-12 h-12 border rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}
        >
          <SlidersHorizontal size={20} />
        </button>
      </header>

      <div className="px-6 space-y-6">
        {filteredHotels.length > 0 ? (
          filteredHotels.map(hotel => (
            <motion.div 
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelectHotel(hotel)}
            className={`relative h-[200px] rounded-[40px] overflow-hidden cursor-pointer shadow-xl transition-all ${appearance === 'Dark Mode' ? 'shadow-black/40' : 'shadow-slate-200'}`}
          >
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8 text-white">
                <h3 className="text-2xl font-bold leading-tight">{hotel.name}</h3>
                <p className="text-sm opacity-80">${(hotel.price ?? 0).toFixed(2)} <span className="text-xs">/{t('perDay')}</span></p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSavedHotel(hotel);
                }}
                className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSaved(hotel.id) ? 'bg-white text-accent' : 'bg-white/20 backdrop-blur-md text-white'}`}
              >
                <Bookmark size={18} fill={isSaved(hotel.id) ? 'currentColor' : 'none'} />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
            <p className={`text-lg font-bold mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('noHotelsFound')}</p>
            <p className="text-sm">{t('tryAdjustingFilters')}</p>
          </div>
        )}
      </div>
      {renderFilters()}
    </div>
  );
};
