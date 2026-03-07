import React, { useState } from 'react';
import { ChevronLeft, Plane } from 'lucide-react';
import { Flight } from '../../types';

interface SeatSelectionScreenProps {
  onBack: () => void;
  onContinue: (seat: string) => void;
  language: string;
  appearance: string;
  flight: Flight | null;
}

export const SeatSelectionScreen = ({ onBack, onContinue, language, appearance, flight }: SeatSelectionScreenProps) => {
  const [selectedSeat, setSelectedSeat] = useState('04');

  const economySeats = Array.from({ length: 60 }, (_, i) => i + 1);
  const businessSeats = Array.from({ length: 20 }, (_, i) => i + 61);

  const Seat = ({ num, isBusiness = false }: { num: number, isBusiness?: boolean, key?: any }) => {
    const seatId = num.toString().padStart(2, '0');
    const isSelected = selectedSeat === seatId;
    const isOccupied = [7, 8, 11, 12, 22, 23, 35, 36, 45, 46, 55, 56, 62, 63, 75, 76].includes(num);

    return (
      <button 
        disabled={isOccupied}
        onClick={() => setSelectedSeat(seatId)}
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center ${
          isSelected 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
            : isOccupied 
              ? (appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-red-50 text-red-200 cursor-not-allowed')
              : (appearance === 'Dark Mode' ? 'bg-slate-900 border border-slate-800 text-white hover:border-blue-600' : 'bg-white border border-slate-100 text-slate-900 hover:border-blue-600')
        }`}
      >
        {num}
      </button>
    );
  };

  return (
    <div className={`min-h-screen pb-24 pt-8 px-6 max-w-4xl mx-auto transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-center mb-12 relative">
        <button onClick={onBack} className={`absolute left-0 w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Select Seat</h1>
      </header>

      <div className="flex items-center justify-between gap-4 mb-12">
        <div className="flex-1 min-w-0">
          <p className={`text-2xl font-bold truncate ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight?.from || 'Origin'}</p>
          <p className="text-xs text-slate-400 truncate">Departure</p>
        </div>
        <div className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 border transition-colors ${appearance === 'Dark Mode' ? 'bg-blue-900/20 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
          <Plane size={24} className="rotate-45" />
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className={`text-2xl font-bold truncate ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight?.to || 'Destination'}</p>
          <p className="text-xs text-slate-400 truncate">Arrival</p>
        </div>
      </div>

      <div className="space-y-12 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
        <div>
          <p className="text-center text-slate-400 font-bold text-sm mb-8 sticky top-0 bg-inherit py-2 z-10">Business Class</p>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 justify-items-center">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {businessSeats.filter((_, i) => i % 4 < 2).map(n => <Seat key={n} num={n} isBusiness />)}
            </div>
            <div className={`w-px h-full ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-50'}`} />
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {businessSeats.filter((_, i) => i % 4 >= 2).map(n => <Seat key={n} num={n} isBusiness />)}
            </div>
          </div>
        </div>

        <div>
          <p className="text-center text-slate-400 font-bold text-sm mb-8 sticky top-0 bg-inherit py-2 z-10">Economy Class</p>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 justify-items-center">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {economySeats.filter((_, i) => i % 4 < 2).map(n => <Seat key={n} num={n} />)}
            </div>
            <div className={`w-px h-full ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-50'}`} />
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {economySeats.filter((_, i) => i % 4 >= 2).map(n => <Seat key={n} num={n} />)}
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-12 p-8 rounded-[40px] border transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 mb-1">Seat Number</p>
            <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{selectedSeat}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 mb-1">Ticket Price</p>
            <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>${flight?.price || '120'}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mb-8 px-4">
          <p className="text-xs text-slate-400 flex-1 truncate">{flight?.from || 'Origin'}</p>
          <Plane size={14} className="text-blue-600 rotate-45 shrink-0" />
          <p className="text-xs text-slate-400 flex-1 truncate text-right">{flight?.to || 'Destination'}</p>
        </div>
        <button 
          onClick={() => onContinue(selectedSeat)}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all shadow-lg shadow-blue-600/20"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
