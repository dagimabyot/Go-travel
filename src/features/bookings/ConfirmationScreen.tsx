import React, { useState } from 'react';
import { ChevronLeft, Calendar, MapPin, Plane, Hotel, Minus, Plus, Info } from 'lucide-react';
import { translations } from '../../constants/translations';
import { motion } from 'motion/react';

interface ConfirmationScreenProps {
  onDone: () => void;
  onBack: () => void;
  language: string;
}

export const ConfirmationScreen = ({ onDone, onBack, language }: ConfirmationScreenProps) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  const [guests, setGuests] = useState(2);

  return (
    <div className="min-h-screen bg-white pb-24 pt-8 px-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-center mb-12 relative">
        <button onClick={onBack} className="absolute left-0 w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-900 shadow-sm">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Confirmation</h1>
      </header>

      <div className="space-y-10">
        <h2 className="text-2xl font-bold text-slate-900">Your Trip</h2>

        <div className="space-y-8">
          <SummaryItem 
            label="Date" 
            value="10-14 May, 2021" 
            onEdit={onBack}
          />
          <SummaryItem 
            label="Place" 
            value="Italy, Manarola" 
            hideEdit
          />
          <SummaryItem 
            label="Flight" 
            value="Alaska Airlines" 
            onEdit={onBack}
          />
          <SummaryItem 
            label="Hotel" 
            value="Water Hotel" 
            onEdit={onBack}
          />
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-slate-400 mb-1">Guests :</p>
              <p className="text-lg font-bold text-slate-900">{guests} Guests</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"
              >
                <Minus size={20} />
              </button>
              <span className="font-bold text-xl text-slate-900">{guests}</span>
              <button 
                onClick={() => setGuests(guests + 1)}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 text-slate-400 mb-10">
            <Info size={16} className="text-slate-400" />
            <p className="text-xs">Every person you add it will be $700</p>
          </div>

          <div className="flex justify-between items-center mb-10 pt-6 border-t border-slate-50">
            <p className="text-sm text-slate-400">Total :</p>
            <p className="text-3xl font-bold text-slate-900">${(guests * 700).toLocaleString()}</p>
          </div>

          <button 
            onClick={onDone}
            className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-bold text-xl shadow-xl shadow-blue-200 active:scale-95 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value, hideEdit, onEdit }: { label: string, value: string, hideEdit?: boolean, onEdit?: () => void }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="text-sm text-slate-400 mb-1">{label} :</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
    {!hideEdit && (
      <button onClick={onEdit} className="text-red-500 text-sm font-bold active:scale-95 transition-all">Edit</button>
    )}
  </div>
);
