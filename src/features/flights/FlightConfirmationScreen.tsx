import React, { useState } from 'react';
import { ChevronLeft, Info, Minus, Plus } from 'lucide-react';
import { Flight } from '../../types';

interface FlightConfirmationScreenProps {
  flight?: Flight;
  onBack: () => void;
  onContinue: (guests: number) => void;
  language: string;
  onEdit: (field: string) => void;
  appearance: string;
}

export const FlightConfirmationScreen = ({ flight, onBack, onContinue, language, onEdit, appearance }: FlightConfirmationScreenProps) => {
  const [guests, setGuests] = useState(2);
  const pricePerGuest = flight?.price || 700;
  const total = guests * pricePerGuest;

  return (
    <div className={`min-h-screen pb-24 pt-8 px-6 max-w-4xl mx-auto transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-center mb-12 relative">
        <button onClick={onBack} className={`absolute left-0 w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Confirmation</h1>
      </header>

      <div className="space-y-10">
        <h2 className={`text-2xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Your Flight</h2>

        <div className="space-y-8">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-400 mb-1">Date :</p>
              <p className={`text-lg font-bold break-words ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight?.departure || '10 May, 10 AM GST'}</p>
            </div>
            <button onClick={() => onEdit('date')} className="text-red-400 font-bold text-sm shrink-0">Edit</button>
          </div>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-400 mb-1">From :</p>
              <p className={`text-lg font-bold break-words ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight?.from || 'Sylhet, BD'}</p>
            </div>
            <button onClick={() => onEdit('from')} className="text-red-400 font-bold text-sm shrink-0">Edit</button>
          </div>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-400 mb-1">To :</p>
              <p className={`text-lg font-bold break-words ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight?.to || 'Italy, Manarola'}</p>
            </div>
            <button onClick={() => onEdit('to')} className="text-red-400 font-bold text-sm shrink-0">Edit</button>
          </div>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-400 mb-1">Flight :</p>
              <p className={`text-lg font-bold break-words ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight?.airline || 'Alaska Airlines'}</p>
            </div>
            <button onClick={() => onEdit('flight')} className="text-red-400 font-bold text-sm shrink-0">Edit</button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-bold text-slate-400">Guests :</p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center text-slate-400 transition-colors ${appearance === 'Dark Mode' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
                >
                  <Minus size={20} />
                </button>
                <span className={`text-2xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{guests}</span>
                <button 
                  onClick={() => setGuests(guests + 1)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center text-slate-400 transition-colors ${appearance === 'Dark Mode' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            <p className={`text-lg font-bold mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{guests} Guests</p>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Info size={14} className="text-blue-600" />
              <p>Every person you add it will be $700</p>
            </div>
          </div>
        </div>

        <div className={`h-px w-full transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-100'}`} />

        <div className="flex justify-between items-center">
          <p className="text-sm font-bold text-slate-400">Total :</p>
          <p className={`text-2xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>${total.toLocaleString()}</p>
        </div>

        <button 
          onClick={() => onContinue(guests)}
          className={`w-full bg-blue-600 text-white py-6 rounded-[32px] font-bold text-xl shadow-xl active:scale-95 transition-all mt-12 ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
