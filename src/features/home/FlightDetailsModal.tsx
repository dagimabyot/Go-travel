import React from 'react';
import { motion } from 'motion/react';
import { X, Plane, Star } from 'lucide-react';
import { translations } from '../../constants/translations';

interface FlightDetailsModalProps {
  onClose: () => void;
  language: string;
}

export const FlightDetailsModal = ({ onClose, language }: FlightDetailsModalProps) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];

  const flights = [
    { time: '7:30 AM', from: 'Larkrow', to: 'Goa', arrival: '9:30 PM', status: '100% on time', duration: '2h 40m', price: 150 },
    { time: '7:50 AM', from: 'Larkrow', to: 'Goa', arrival: '9:50 PM', status: '90% on time', duration: '2h 40m', price: 150 },
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
          <h3 className="text-2xl font-bold text-slate-900">Flight Details</h3>
          <button onClick={onClose} className="absolute right-0 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
          {flights.map((flight, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="text-center mb-4">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{flight.status}</p>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-left">
                  <p className="text-xl font-bold text-slate-900">{flight.time}</p>
                  <p className="text-xs text-slate-400 mt-1">{flight.from}</p>
                </div>
                
                <div className="flex flex-col items-center flex-1 px-4">
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-[1px] flex-1 bg-slate-100" />
                    <Plane size={16} className="text-blue-600 rotate-90" />
                    <div className="h-[1px] flex-1 bg-slate-100" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">{flight.duration}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900">{flight.arrival}</p>
                  <p className="text-xs text-slate-400 mt-1">{flight.to}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <p className="text-xl font-bold text-slate-900">${flight.price}<span className="text-xs font-normal text-slate-400 ml-1">/person</span></p>
                <button className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-slate-300 hover:text-blue-600 transition-colors">
                  <Star size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
