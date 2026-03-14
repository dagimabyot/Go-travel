import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, Star, MapPin, ChevronLeft } from 'lucide-react';
import { Package, Hotel, User, Booking } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { Avatar } from '../../components/ui/Avatar';

interface SavedScreenProps {
  savedPackages: Package[];
  savedHotels: Hotel[];
  savedBookings: Booking[];
  user: User | null;
  onSelectPackage: (p: Package) => void;
  onSelectHotel: (h: Hotel) => void;
  toggleSavedPackage: (p: Package) => void;
  toggleSavedHotel: (h: Hotel) => void;
  toggleSavedBooking: (b: Booking) => void;
  appearance: string;
}

export const SavedScreen = ({ 
  savedPackages, 
  savedHotels, 
  savedBookings,
  user,
  onSelectPackage, 
  onSelectHotel, 
  toggleSavedPackage, 
  toggleSavedHotel, 
  toggleSavedBooking,
  appearance
}: SavedScreenProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'packages' | 'flights' | 'hotels'>('packages');

  const filteredSavedBookings = savedBookings.filter(b => {
    if (activeTab === 'flights') return b.type === 'flight';
    if (activeTab === 'packages') return b.type === 'package';
    if (activeTab === 'hotels') return b.type === 'hotel';
    return false;
  });

  const resultCount = (activeTab === 'packages' ? savedPackages.length : activeTab === 'hotels' ? savedHotels.length : 0) + filteredSavedBookings.length;

  return (
    <div className={`min-h-screen pb-24 pt-2 px-6 max-w-4xl mx-auto relative overflow-hidden transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="mb-2">
        <h1 className={`text-2xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('saved')}</h1>
        <p className="text-slate-400 text-sm">{t('resultsFound')} ({resultCount})</p>
      </div>

      <div className={`flex gap-8 mb-6 border-b transition-colors duration-300 ${appearance === 'Dark Mode' ? 'border-slate-900' : 'border-slate-50'}`}>
        {(['packages', 'flights', 'hotels'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold capitalize transition-all relative ${
              activeTab === tab ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            {t(tab)}
            {activeTab === tab && (
              <motion.div 
                layoutId="savedTab" 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-red-500 rounded-full" 
              />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'packages' && (
        <div className="space-y-6">
          {savedPackages.length === 0 && filteredSavedBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-slate-300 mb-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <Star size={32} />
              </div>
              <p className="text-slate-400 font-medium">{t('noSavedPackages')}</p>
            </div>
          ) : (
            <>
              {savedPackages.map(pkg => (
                <motion.div 
                  key={pkg.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onSelectPackage(pkg)}
                  className="relative h-64 rounded-[32px] overflow-hidden cursor-pointer group shadow-lg"
                >
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavedPackage(pkg);
                    }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all bg-slate-900 text-white`}
                  >
                    <Star size={20} fill="currentColor" />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.floor(pkg.rating) ? 'currentColor' : 'none'} className="text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-white text-sm font-bold ml-1">{pkg.rating}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                  </div>
                </motion.div>
              ))}
              {filteredSavedBookings.map(booking => (
                <motion.div 
                  key={booking.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative h-64 rounded-[32px] overflow-hidden cursor-pointer group shadow-lg"
                >
                  <img src={booking.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'} alt={booking.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavedBooking(booking);
                    }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all bg-slate-900 text-white`}
                  >
                    <Star size={20} fill="currentColor" />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-bold text-white mb-1">{booking.name}</h3>
                    <p className="text-white/80 text-sm">{booking.location}</p>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === 'hotels' && (
        <div className="space-y-6">
          {savedHotels.length === 0 && filteredSavedBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-slate-300 mb-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <Star size={32} />
              </div>
              <p className="text-slate-400 font-medium">{t('noSavedHotels')}</p>
            </div>
          ) : (
            <>
              {savedHotels.map(hotel => (
                <motion.div 
                  key={hotel.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onSelectHotel(hotel)}
                  className="relative h-64 rounded-[32px] overflow-hidden cursor-pointer group shadow-lg"
                >
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavedHotel(hotel);
                    }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all bg-slate-900 text-white`}
                  >
                    <Star size={20} fill="currentColor" />
                  </button>
  
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.floor(hotel.rating) ? 'currentColor' : 'none'} className="text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-white text-sm font-bold ml-1">{hotel.rating}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{hotel.name}</h3>
                    <p className="text-white/80 text-sm">${hotel.price}/{t('night')}</p>
                  </div>
                </motion.div>
              ))}
              {filteredSavedBookings.map(booking => (
                <motion.div 
                  key={booking.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative h-64 rounded-[32px] overflow-hidden cursor-pointer group shadow-lg"
                >
                  <img src={booking.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'} alt={booking.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavedBooking(booking);
                    }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all bg-slate-900 text-white`}
                  >
                    <Star size={20} fill="currentColor" />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-bold text-white mb-1">{booking.name}</h3>
                    <p className="text-white/80 text-sm">${booking.price}/{t('perDay')}</p>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === 'flights' && (
        <div className="space-y-6">
          {filteredSavedBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-slate-300 mb-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <Star size={32} />
              </div>
              <p className="text-slate-400 font-medium">{t('noSavedFlights')}</p>
            </div>
          ) : (
            filteredSavedBookings.map(booking => (
              <motion.div 
                key={booking.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-[32px] border shadow-md relative transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSavedBooking(booking);
                  }}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all bg-slate-900 text-white`}
                >
                  <Star size={20} fill="currentColor" />
                </button>

                <div className="flex justify-between items-center mb-6 pr-10">
                  <div className="text-center">
                    <p className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{booking.from_city?.substring(0, 3).toUpperCase() || '---'}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{booking.airline}</p>
                  </div>
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <div className={`w-full h-[1px] relative ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <Star size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{booking.to_city?.substring(0, 3).toUpperCase() || '---'}</p>
                    <p className="text-[10px] text-slate-500 font-bold">Goa</p>
                  </div>
                </div>
                <div className={`flex justify-between items-center pt-4 border-t transition-colors duration-300 ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-slate-100'}`}>
                  <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>${booking.price}<span className="text-xs font-normal text-slate-500">/{t('perPerson')}</span></p>
                  <p className="text-xs text-slate-400 font-bold">{booking.departure_time}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
