import React from 'react';
import { motion } from 'motion/react';
import { X, Bookmark, Star } from 'lucide-react';
import { translations } from '../../constants/translations';

interface HotelDetailsModalProps {
  onClose: () => void;
  language: string;
}

export const HotelDetailsModal = ({ onClose, language }: HotelDetailsModalProps) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];

  const hotels = [
    { name: 'Water Hotel', price: 15.99, rating: 4.8, image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg' },
    { name: 'Beach Hotel', price: 15.99, rating: 4.5, image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white w-full max-w-lg rounded-t-[50px] p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center items-center mb-8 relative">
          <h3 className="text-2xl font-bold text-slate-900">Hotel Details</h3>
          <button onClick={onClose} className="absolute right-0 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
          {hotels.map((hotel, idx) => (
            <div key={idx} className="relative h-48 rounded-[40px] overflow-hidden group cursor-pointer shadow-lg">
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8 text-white">
                <p className="font-bold text-xl mb-1">{hotel.name}</p>
                <p className="text-sm font-bold text-white/90">${hotel.price} <span className="text-[10px] font-normal text-white/60">/ per day</span></p>
              </div>
              <button className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-lg">
                <Bookmark size={18} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
