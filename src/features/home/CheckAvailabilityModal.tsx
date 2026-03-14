import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface CheckAvailabilityModalProps {
  onClose: () => void;
  onNext: (dates: string[]) => void;
}

export const CheckAvailabilityModal = ({ onClose, onNext }: CheckAvailabilityModalProps) => {
  const { t } = useTranslation();
  const [selectedDates, setSelectedDates] = useState<number[]>([12, 13, 14, 15, 16]);
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['May 2021', 'June 2021'];

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
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-lg rounded-t-[50px] p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center items-center mb-8 relative">
          <h3 className="text-2xl font-bold text-slate-900">{t('checkAvailability')}</h3>
          <button onClick={onClose} className="absolute right-0 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
          {months.map((month, mIdx) => (
            <div key={month}>
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-lg text-slate-900">{month}</h4>
                <div className="flex gap-4">
                  <ChevronLeft size={20} className="text-slate-300 cursor-pointer" />
                  <ChevronRight size={20} className="text-slate-300 cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-slate-300 uppercase mb-2">{d}</span>
                ))}
                {days.map(day => {
                  const isSelected = mIdx === 0 && selectedDates.includes(day);
                  const isUnavailable = mIdx === 1 && day === 15;
                  return (
                    <button 
                      key={day}
                      onClick={() => {
                        if (mIdx === 0) {
                          if (selectedDates.includes(day)) {
                            setSelectedDates(selectedDates.filter(d => d !== day));
                          } else {
                            setSelectedDates([...selectedDates, day].sort((a, b) => a - b));
                          }
                        }
                      }}
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all relative
                        ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}
                        ${isUnavailable ? 'opacity-20 cursor-not-allowed' : ''}
                      `}
                    >
                      {day}
                      {isUnavailable && (
                        <div className="absolute bottom-1 w-1 h-1 bg-red-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold text-slate-900">
              May 2021 : <span className="text-blue-600">{selectedDates.length} {t('days')}</span>
            </p>
            <button onClick={() => setSelectedDates([])} className="text-xs text-red-500 font-bold">{t('clearMore')}</button>
          </div>
          <button 
            onClick={() => onNext(selectedDates.map(d => `2021-05-${d}`))}
            className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-bold text-xl shadow-xl shadow-blue-200 active:scale-95 transition-all"
          >
            {t('next')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
