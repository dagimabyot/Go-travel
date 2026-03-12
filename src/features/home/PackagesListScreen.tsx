import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Star, Bookmark, ListFilter } from 'lucide-react';
import { Package, User } from '../../types';
import { translations } from '../../constants/translations';
import { Avatar } from '../../components/ui/Avatar';

interface PackagesListScreenProps {
  user: User | null;
  packages: Package[];
  onBack: () => void;
  onSelect: (p: Package) => void;
  savedPackages: Package[];
  toggleSavedPackage: (p: Package) => void;
  language: string;
  appearance: string;
}

export const PackagesListScreen = ({ 
  user, 
  packages, 
  onBack, 
  onSelect, 
  savedPackages, 
  toggleSavedPackage,
  language,
  appearance
}: PackagesListScreenProps) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  const isSaved = (id: string) => savedPackages.some(p => p.id === id);

  return (
    <div className={`min-h-screen pb-24 pt-8 px-6 max-w-4xl mx-auto transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex justify-between items-center mb-8">
        <button onClick={onBack} className={`w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <div className="w-12" /> {/* Spacer */}
      </header>

      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('popularPackages')}</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm font-bold text-slate-400">Result found (128)</p>
        <button className={`flex items-center gap-2 text-sm font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
          Sort By <ListFilter size={18} />
        </button>
      </div>

      <div className="space-y-8">
        {packages.map(pkg => (
          <motion.div 
            key={pkg.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelect(pkg)}
            className={`w-full h-[240px] rounded-[40px] overflow-hidden relative cursor-pointer shadow-2xl transition-all ${appearance === 'Dark Mode' ? 'shadow-black/40' : 'shadow-slate-200'}`}
          >
            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center gap-1 mb-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={`${i < Math.floor(pkg.rating) ? 'text-yellow-400 fill-current' : 'text-slate-400'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold">{pkg.rating.toFixed(1)}</span>
              </div>
              <p className="font-bold text-2xl leading-tight">{pkg.location}</p>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleSavedPackage(pkg);
              }}
              className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isSaved(pkg.id) ? 'bg-white text-accent' : (appearance === 'Dark Mode' ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-400')}`}
            >
              <Bookmark size={18} fill={isSaved(pkg.id) ? 'currentColor' : 'none'} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

