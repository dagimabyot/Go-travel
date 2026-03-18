import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, QrCode, Star } from 'lucide-react';
import { Booking, User } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface HistoryScreenProps {
  bookings: Booking[];
  user: User | null;
  onCancel: (id: string) => void;
  onSelect: (b: Booking) => void;
  onBack: () => void;
  onProfile: () => void;
  appearance: string;
  savedBookings: Booking[];
  toggleSavedBooking: (b: Booking) => void;
}

export const HistoryScreen = ({ bookings, user, onCancel, onSelect, onBack, onProfile, appearance, savedBookings, toggleSavedBooking }: HistoryScreenProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'package' | 'flight' | 'hotel'>(() => {
    // Default to the first category that has upcoming bookings
    const hasUpcoming = (type: string) => bookings.some(b => {
      const dateStr = b.type === 'flight' ? (b.departure_time || b.date) : (b.date || b.departure_time);
      const bookingDate = new Date(dateStr || '');
      const bookingDay = new Date(bookingDate);
      bookingDay.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return b.type === type && bookingDay >= today;
    });

    if (hasUpcoming('package')) return 'package';
    if (hasUpcoming('flight')) return 'flight';
    if (hasUpcoming('hotel')) return 'hotel';
    return 'package';
  });
  const [timeFilter, setTimeFilter] = useState<'upcoming' | 'past'>('upcoming');

  // Real date filtering logic
  const filteredBookings = bookings.filter(b => {
    const isTypeMatch = b.type === activeTab;
    // For flights, prioritize departure_time. For others, use date.
    const dateStr = b.type === 'flight' ? (b.departure_time || b.date) : (b.date || b.departure_time);
    const bookingDate = new Date(dateStr || '');
    const now = new Date();
    
    // Set both to start of day for a fairer comparison if it's the same day
    const bookingDay = new Date(bookingDate);
    bookingDay.setHours(0, 0, 0, 0);
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const isUpcoming = bookingDay >= today;
    const isPast = bookingDay < today;
    
    if (timeFilter === 'upcoming') return isTypeMatch && isUpcoming;
    return isTypeMatch && isPast;
  });

  const tabs = [
    { id: 'package', label: t('packages') },
    { id: 'flight', label: t('flights') },
    { id: 'hotel', label: t('hotels') },
  ];

  return (
    <div className={`pb-24 pt-4 px-4 md:px-6 max-w-4xl mx-auto overflow-x-hidden min-h-screen transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex justify-between items-center mb-6">
        <div className="w-12" /> {/* Spacer to keep title centered */}
        <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('myBookings')}</h1>
        <div className="w-12" /> {/* Spacer to keep title centered */}
      </header>

      <div className={`p-2 rounded-2xl flex mb-8 shadow-sm border transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <button 
          onClick={() => setTimeFilter('upcoming')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${timeFilter === 'upcoming' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400'}`}
        >
          {t('upcoming')}
        </button>
        <button 
          onClick={() => setTimeFilter('past')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${timeFilter === 'past' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400'}`}
        >
          {t('pastTrips')}
        </button>
      </div>

      <div className={`flex gap-8 border-b mb-8 overflow-x-auto no-scrollbar transition-colors duration-300 ${appearance === 'Dark Mode' ? 'border-slate-900' : 'border-slate-100'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-primary' 
                : 'text-slate-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {filteredBookings.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-20 text-slate-400 text-center"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-100'}`}>
                <Plane size={32} className="opacity-20" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('noBookings')}</h3>
              <p className="text-sm text-slate-500 max-w-[200px]">{t('noBookingsDesc')}</p>
            </motion.div>
          ) : (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {filteredBookings.map((booking) => (
                <motion.div 
                  key={booking.id} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(booking)}
                  className="relative group cursor-pointer"
                >
                  {activeTab === 'flight' ? (
                    <div className={`rounded-[32px] p-6 shadow-md border transition-colors duration-300 relative ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedBooking(booking);
                        }}
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all z-10 ${savedBookings.some(b => b.id === booking.id) ? (appearance === 'Dark Mode' ? 'bg-slate-800 text-amber-500' : 'bg-white text-amber-500') : (appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400')}`}
                      >
                        <Star size={16} fill={savedBookings.some(b => b.id === booking.id) ? "currentColor" : "none"} />
                      </button>
                      <div className="flex justify-center mb-4">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('onTime')}</span>
                      </div>
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-center">
                          <p className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{booking.from_city?.substring(0, 3).toUpperCase() || '---'}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{booking.from_city || '---'}</p>
                        </div>
                        <div className="flex-1 px-4 flex flex-col items-center">
                          <div className={`w-full h-[1px] relative ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2">2h 40m</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{booking.to_city?.substring(0, 3).toUpperCase() || '---'}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{booking.to_city || '---'}</p>
                        </div>
                      </div>
                      <div className={`flex justify-between items-center pt-4 border-t transition-colors duration-300 ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-slate-100'}`}>
                        <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>${booking.price}<span className="text-xs font-normal text-slate-500">/{t('person')}</span></p>
                        <button className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                          <QrCode size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-lg">
                      <img 
                        src={booking.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'} 
                        alt={booking.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedBooking(booking);
                        }}
                        className={`absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center transition-all ${savedBookings.some(b => b.id === booking.id) ? 'text-amber-500' : 'text-white'}`}
                      >
                        <Star size={18} fill={savedBookings.some(b => b.id === booking.id) ? "currentColor" : "none"} />
                      </button>

                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < (booking.rating || 4.5) ? "#FFD700" : "none"} className={i < (booking.rating || 4.5) ? "text-[#FFD700]" : "text-white/50"} />
                          ))}
                          <span className="text-xs font-bold text-white ml-1">{booking.rating || 4.5}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{booking.name || booking.location}</h3>
                        {activeTab === 'hotel' && (
                          <p className="text-white/80 text-sm font-medium">${booking.price}<span className="text-xs opacity-60">/{t('perDay')}</span></p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
