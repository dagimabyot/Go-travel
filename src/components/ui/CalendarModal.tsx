import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripDate: string;
  tripName: string;
  appearance: string;
}

export const CalendarModal = ({ isOpen, onClose, tripDate, tripName, appearance }: CalendarModalProps) => {
  const date = new Date(tripDate);
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const day = date.getDate();

  // Get days in month
  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, date.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-sm rounded-[32px] p-8 shadow-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Trip Calendar</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-lg">{month} {year}</p>
                <div className="flex gap-2">
                  <button className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronLeft size={16} /></button>
                  <button className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronRight size={16} /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {blanks.map(b => <div key={`b-${b}`} />)}
                {days.map(d => (
                  <div
                    key={d}
                    className={`h-8 w-8 flex items-center justify-center rounded-full text-xs transition-all ${
                      d === day 
                        ? 'bg-primary text-white font-bold ring-4 ring-primary/20' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${appearance === 'Dark Mode' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Scheduled Trip</p>
              <p className="text-sm font-bold truncate">{tripName}</p>
              <p className="text-xs text-slate-400 mt-1">{tripDate}</p>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20"
            >
              Close Calendar
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
