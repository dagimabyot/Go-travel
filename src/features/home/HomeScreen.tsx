import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Bookmark, Plane, MapPin, LayoutGrid, Palmtree, Trees, Mountain, Ship } from 'lucide-react';
import { User, Package, Hotel } from '../../types';
import { Avatar } from '../../components/ui/Avatar';

interface HomeScreenProps {
  user: User | null;
  packages: Package[];
  onSelectPackage: (p: Package) => void;
  onSeeAllPackages: () => void;
  onSearchFlights: () => void;
  onSearchHotels: () => void;
  onSelectHotel: (h: any) => void;
  onProfile: () => void;
  language: string;
  savedPackages: Package[];
  toggleSavedPackage: (p: Package) => void;
  savedHotels: Hotel[];
  toggleSavedHotel: (h: Hotel) => void;
  appearance: string;
}

export const HomeScreen = ({ 
  user, 
  packages,
  onSelectPackage, 
  onSeeAllPackages,
  onSearchFlights, 
  onSearchHotels,
  onSelectHotel,
  onProfile,
  language,
  savedPackages,
  toggleSavedPackage,
  savedHotels,
  toggleSavedHotel,
  appearance
}: HomeScreenProps) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'flights' | 'places' | 'hotels'>('packages');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = [
    { name: 'All', icon: <LayoutGrid size={20} />, key: 'All' },
    { name: 'Beach', icon: <Palmtree size={20} />, key: 'Beach' },
    { name: 'Forest', icon: <Trees size={20} />, key: 'Forest' },
    { name: 'Mountain', icon: <Mountain size={20} />, key: 'Mountain' },
    { name: 'Submarine', icon: <Ship size={20} />, key: 'Submarine' },
  ];

  const isSaved = (id: string) => savedPackages.some(p => p.id === id);
  const filteredPackages = activeCategory === 'All' 
    ? packages 
    : packages.filter(p => p.category === activeCategory);
  const popularPackages = packages.slice(0, 5);

  return (
    <div className={`pb-24 max-w-4xl mx-auto min-h-screen transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Header with Map Background */}
      <header className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 opacity-20 pointer-events-none ${appearance === 'Dark Mode' ? 'invert' : ''}`}>
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
            alt="Map Background" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 flex justify-between items-center px-6 pt-8">
          <div className="flex items-center gap-2">
            <MapPin size={20} className={appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'} />
            <span className={`font-bold text-lg ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{user?.country || 'New York, USA'}</span>
          </div>
        </div>
      </header>

      <div className={`px-6 -mt-16 relative z-20 rounded-t-[40px] pt-4 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white'}`}>
        {/* Tabs */}
        <div className={`flex gap-8 mb-8 overflow-x-auto hide-scrollbar border-b ${appearance === 'Dark Mode' ? 'border-slate-900' : 'border-slate-100'}`}>
          {(['packages', 'flights', 'places', 'hotels'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold capitalize transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-accent' : 'text-slate-400'}`}
            >
              {tab === 'packages' ? 'Packages' : tab === 'flights' ? 'Flights' : tab === 'places' ? 'Places' : 'Hotels'}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-accent rounded-full" 
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'packages' && (
          <div className="space-y-10">
            {/* 101 Packages Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-sm text-slate-400">{packages.length} {t('packages')}</h3>
                </div>
                <button onClick={onSeeAllPackages} className="text-sm text-primary font-bold">{t('seeAll')}</button>
              </div>
              <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar -mx-6 px-6">
                {filteredPackages.map(pkg => (
                  <motion.div 
                    key={pkg.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelectPackage(pkg)}
                    className={`min-w-[180px] h-[240px] rounded-[32px] overflow-hidden relative cursor-pointer shadow-xl ${appearance === 'Dark Mode' ? 'shadow-black/40' : 'shadow-slate-200'}`}
                  >
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={`${i < Math.floor(pkg.rating) ? 'text-yellow-400 fill-current' : 'text-slate-400'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold">{pkg.rating.toFixed(1)}</span>
                      </div>
                      <p className="font-bold text-base leading-tight">{pkg.location.split(',')[0]}</p>
                      <p className="text-sm opacity-80">{pkg.location.split(',')[1]?.trim() || pkg.name}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavedPackage(pkg);
                      }}
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${isSaved(pkg.id) ? (appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-white text-amber-500') : (appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400')}`}
                    >
                      <Star size={14} fill={isSaved(pkg.id) ? 'currentColor' : 'none'} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Popular Packages Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`font-bold text-lg ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('popularPackages')}</h3>
                <button onClick={onSeeAllPackages} className="text-sm text-primary font-bold">{t('seeAll')}</button>
              </div>
              {popularPackages.length > 0 && (
                <div className="relative">
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onSelectPackage(popularPackages[0])}
                    className={`w-full h-[220px] rounded-[40px] overflow-hidden relative cursor-pointer shadow-2xl ${appearance === 'Dark Mode' ? 'shadow-black/40' : 'shadow-slate-200'}`}
                  >
                    <img src={popularPackages[0].image} alt={popularPackages[0].name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={`${i < Math.floor(popularPackages[0].rating) ? 'text-yellow-400 fill-current' : 'text-slate-400'}`} />
                          ))}
                        </div>
                        <span className="text-xs font-bold">{popularPackages[0].rating.toFixed(1)}</span>
                      </div>
                      <p className="font-bold text-2xl leading-tight mb-1">{popularPackages[0].name}</p>
                      <p className="text-sm opacity-80">{popularPackages[0].duration} {t('fullPackage')}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavedPackage(popularPackages[0]);
                      }}
                      className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isSaved(popularPackages[0].id) ? (appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-white text-amber-500') : (appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400')}`}
                    >
                      <Star size={18} fill={isSaved(popularPackages[0].id) ? 'currentColor' : 'none'} />
                    </button>
                  </motion.div>
                  <div className="flex justify-center gap-1.5 mt-4">
                    <div className="w-6 h-1.5 bg-primary rounded-full" />
                    <div className={`w-1.5 h-1.5 rounded-full ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Top Packages Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`font-bold text-lg ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('topPackages')}</h3>
                <button onClick={onSeeAllPackages} className="text-sm text-primary font-bold">{t('seeAll')}</button>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar -mx-6 px-6">
                {packages.slice(2, 6).map(pkg => (
                  <motion.div 
                    key={pkg.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelectPackage(pkg)}
                    className={`flex items-center gap-4 min-w-[200px] p-3 rounded-3xl cursor-pointer ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{pkg.name.split(',')[0]}</p>
                      <p className="text-[10px] text-slate-400 mb-1">{pkg.location.split(',')[1] || 'Spain'}</p>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-yellow-400 fill-current" />
                        <span className="text-[10px] font-bold text-slate-400">{pkg.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'flights' && (
          <div className={`p-8 rounded-[40px] shadow-xl border transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 shadow-black/40' : 'bg-white border-slate-50 shadow-slate-200'}`}>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-blue-600 ${appearance === 'Dark Mode' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <Plane size={40} className="rotate-45" />
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('readyToFly')}</h3>
                <p className="text-slate-500 text-sm max-w-[200px]">{t('findBestDeals')}</p>
              </div>
              <button 
                onClick={onSearchFlights}
                className={`w-full bg-blue-600 text-white py-5 rounded-[24px] font-bold text-lg shadow-xl active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'shadow-blue-900/20' : 'shadow-blue-200'}`}
              >
                {t('searchFlights')}
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'places' && (
          <div className="space-y-10">
            {/* Categories */}
            <div>
              <h3 className={`font-bold text-lg mb-6 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('categories')}</h3>
              <div className="flex gap-6 overflow-x-auto hide-scrollbar -mx-6 px-6">
                {categories.map((cat, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveCategory(cat.key)}
                    className="flex flex-col items-center gap-2 outline-none group"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${activeCategory === cat.key ? 'bg-accent text-white shadow-lg shadow-accent/20' : appearance === 'Dark Mode' ? 'bg-slate-900 border border-slate-800 text-slate-600' : 'bg-white border border-slate-100 text-slate-400 group-active:scale-90'}`}>
                      {cat.icon}
                    </div>
                    <span className={`text-[10px] font-bold ${activeCategory === cat.key ? appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900' : 'text-slate-400'}`}>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Places */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`font-bold text-lg ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('popularPlaces')}</h3>
                <button onClick={onSeeAllPackages} className="text-sm text-primary font-bold">{t('seeAll')}</button>
              </div>
              <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar -mx-6 px-6">
                {filteredPackages.slice(0, 3).map(pkg => (
                  <motion.div 
                    key={pkg.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelectPackage(pkg)}
                    className={`min-w-[220px] h-[280px] rounded-[40px] overflow-hidden relative cursor-pointer shadow-xl ${appearance === 'Dark Mode' ? 'shadow-black/40' : 'shadow-slate-200'}`}
                  >
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={`${i < Math.floor(pkg.rating) ? 'text-yellow-400 fill-current' : 'text-slate-400'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold">{pkg.rating.toFixed(1)}</span>
                      </div>
                      <p className="font-bold text-lg leading-tight">{pkg.location.split(',')[0]}</p>
                      <p className="text-sm opacity-80">{pkg.location.split(',')[1]?.trim() || pkg.name}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavedPackage(pkg);
                      }}
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${isSaved(pkg.id) ? (appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-white text-amber-500') : (appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400')}`}
                    >
                      <Star size={14} fill={isSaved(pkg.id) ? 'currentColor' : 'none'} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommended for you */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`font-bold text-lg ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('recommendedForYou')}</h3>
                <button onClick={onSeeAllPackages} className="text-sm text-primary font-bold">{t('seeAll')}</button>
              </div>
              <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar -mx-6 px-6">
                {filteredPackages.slice(3, 6).map(pkg => (
                  <motion.div 
                    key={pkg.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelectPackage(pkg)}
                    className={`min-w-[220px] h-[280px] rounded-[40px] overflow-hidden relative cursor-pointer shadow-xl ${appearance === 'Dark Mode' ? 'shadow-black/40' : 'shadow-slate-200'}`}
                  >
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={`${i < Math.floor(pkg.rating) ? 'text-yellow-400 fill-current' : 'text-slate-400'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold">{pkg.rating.toFixed(1)}</span>
                      </div>
                      <p className="font-bold text-lg leading-tight">{pkg.location.split(',')[0]}</p>
                      <p className="text-sm opacity-80">{pkg.location.split(',')[1]?.trim() || pkg.name}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavedPackage(pkg);
                      }}
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${isSaved(pkg.id) ? (appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-white text-amber-500') : (appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400')}`}
                    >
                      <Star size={14} fill={isSaved(pkg.id) ? 'currentColor' : 'none'} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hotels' && (
          <div className="space-y-10">
            {/* Popular Hotels */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`font-bold text-lg ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('popularHotels')}</h3>
                <button onClick={onSearchHotels} className="text-sm text-primary font-bold">{t('seeAll')}</button>
              </div>
              <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar -mx-6 px-6">
                {[
                  { id: 'h1', name: 'Water Hotel', price: 15.99, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
                  { id: 'h2', name: 'Beach Hotel', price: 15.99, image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80' },
                ].map((hotel, i) => (
                  <motion.div 
                    key={hotel.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelectHotel(hotel)}
                    className={`min-w-[220px] h-[280px] rounded-[40px] overflow-hidden relative cursor-pointer shadow-xl ${appearance === 'Dark Mode' ? 'shadow-black/40' : 'shadow-slate-200'}`}
                  >
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="font-bold text-lg leading-tight">{hotel.name}</p>
                      <p className="text-sm opacity-80">${hotel.price}/{t('perDay')}</p>
                    </div>
                    <button className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400'}`}>
                      <Star size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Near to you */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`font-bold text-lg ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('nearToYou')}</h3>
                <button onClick={onSearchHotels} className="text-sm text-primary font-bold">{t('seeAll')}</button>
              </div>
              <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar -mx-6 px-6">
                {[
                  { id: 'h3', name: 'Ayo Nagra', price: 10.99, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
                  { id: 'h4', name: 'Beach Hotel', price: 15.99, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
                ].map((hotel, i) => (
                  <motion.div 
                    key={hotel.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelectHotel(hotel)}
                    className={`min-w-[220px] h-[280px] rounded-[40px] overflow-hidden relative cursor-pointer shadow-xl ${appearance === 'Dark Mode' ? 'shadow-black/40' : 'shadow-slate-200'}`}
                  >
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="font-bold text-lg leading-tight">{hotel.name}</p>
                      <p className="text-sm opacity-80">${hotel.price}/{t('perDay')}</p>
                    </div>
                    <button className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400'}`}>
                      <Star size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
