import React, { useState } from 'react';
import { ChevronLeft, Info, Minus, Plus } from 'lucide-react';
import { Hotel } from '../../types';
import { motion } from 'motion/react';

interface HotelConfirmationScreenProps {
  hotel: Hotel;
  onBack: () => void;
  onContinue: (guests: number) => void;
  language: string;
  onEdit: (field: string) => void;
  appearance: string;
}

export const HotelConfirmationScreen = ({ hotel, onBack, onContinue, onEdit, appearance }: HotelConfirmationScreenProps) => {
  const [guests, setGuests] = useState(2);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className={`flex items-center justify-between px-6 pt-12 pb-6 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white'}`}>
        <button onClick={onBack} className={`w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Confirmation</h1>
        <div className="w-12" />
      </header>

      <div className="flex-1 px-8 pt-6 overflow-y-auto no-scrollbar pb-32">
        <h2 className={`text-2xl font-bold mb-10 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Your Hotel</h2>

        <div className="space-y-10">
          {/* Date */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm mb-2">Date :</p>
              <p className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>10 May</p>
            </div>
            <button onClick={() => onEdit('date')} className="text-red-500 font-bold text-sm active:scale-95 transition-all">Edit</button>
          </div>

          {/* Hotel */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm mb-2">Hotel :</p>
              <p className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{hotel.name}</p>
            </div>
            <button onClick={() => onEdit('hotel')} className="text-red-500 font-bold text-sm active:scale-95 transition-all">Edit</button>
          </div>

          {/* Arrangements */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm mb-2">Arrangements :</p>
              <p className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Bedroom 1</p>
            </div>
            <button onClick={() => onEdit('arrangements')} className="text-red-500 font-bold text-sm active:scale-95 transition-all">Edit</button>
          </div>

          {/* Guests */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-slate-400 text-sm mb-2">Guests :</p>
                <p className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{guests} Guests</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className={`w-10 h-10 border rounded-full flex items-center justify-center text-slate-400 ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-slate-200'}`}
                >
                  <Minus size={20} />
                </button>
                <span className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{guests}</span>
                <button 
                  onClick={() => setGuests(guests + 1)}
                  className={`w-10 h-10 border rounded-full flex items-center justify-center text-slate-400 ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-slate-200'}`}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Info size={14} className="text-blue-600" />
              <p>Every person you add it will be $15</p>
            </div>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t flex justify-between items-center transition-colors ${appearance === 'Dark Mode' ? 'border-slate-900' : 'border-slate-100'}`}>
          <p className="text-slate-400 text-sm">Total :</p>
          <p className={`text-2xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>${(hotel.price * guests).toFixed(2)}</p>
        </div>
      </div>

      <div className={`p-8 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white'}`}>
        <button 
          onClick={() => onContinue(guests)}
          className={`w-full py-5 bg-blue-700 text-white rounded-[24px] font-bold text-xl shadow-xl active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
