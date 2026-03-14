import React from 'react';
import { ChevronLeft, SlidersHorizontal, Star, Bookmark } from 'lucide-react';
import { Package } from '../../types';
import { motion } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';

interface PlaceListScreenProps {
  places: Package[];
  onBack: () => void;
  onSelectPlace: (p: Package) => void;
  toggleSaved: (p: Package) => void;
  isSaved: (id: string) => boolean;
  appearance: string;
}

export const PlaceListScreen = ({ places, onBack, onSelectPlace, toggleSaved, isSaved, appearance }: PlaceListScreenProps) => {
  const { t } = useTranslation();
  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-between px-6 pt-12 mb-8">
        <button onClick={onBack} className={`w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('popularDestinations')}</h1>
          <p className="text-xs text-slate-400">{t('resultsFound')} ({places.length})</p>
        </div>
        <button className={`w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <SlidersHorizontal size={20} />
        </button>
      </header>

      <div className="px-6 space-y-6">
        {places.map(place => (
          <motion.div 
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelectPlace(place)}
            className={`relative h-[240px] rounded-[40px] overflow-hidden cursor-pointer shadow-xl transition-all ${appearance === 'Dark Mode' ? 'shadow-black/40' : 'shadow-slate-200'}`}
          >
            <img src={place.image} alt={place.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-8 right-8 text-white">
              <div className="flex items-center gap-1 mb-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={`${i < Math.floor(place.rating) ? 'text-yellow-400 fill-current' : 'text-slate-400'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold">{place.rating.toFixed(1)}</span>
              </div>
              <h3 className="text-2xl font-bold leading-tight">{place.name}</h3>
              <p className="text-sm opacity-80">{place.location}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleSaved(place);
              }}
              className={`absolute top-6 right-6 w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all ${isSaved(place.id) ? 'bg-white text-accent' : 'bg-white/20 text-white'}`}
            >
              <Bookmark size={18} fill={isSaved(place.id) ? 'currentColor' : 'none'} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
