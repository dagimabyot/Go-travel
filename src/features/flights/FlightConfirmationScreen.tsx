import React, { useState } from 'react';
import { ChevronLeft, Info, Minus, Plus, CreditCard, FileText } from 'lucide-react';
import { Flight, User } from '../../types';

interface FlightConfirmationScreenProps {
  flight?: Flight;
  user: User | null;
  onBack: () => void;
  onContinue: (guests: number, passport: string) => void;
  language: string;
  onEdit: (field: string) => void;
  appearance: string;
}

export const FlightConfirmationScreen = ({ flight, user, onBack, onContinue, language, onEdit, appearance }: FlightConfirmationScreenProps) => {
  const [guests, setGuests] = useState(2);
  const [passport, setPassport] = useState(user?.passport || '');
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
              <p className="text-sm font-bold text-slate-400 mb-1">Date : </p>
              <p className={`text-lg font-bold break-words ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight?.departure ? flight.departure.replace(' ', ' T') : '2026-08-20 T14:00:00'}</p>
            </div>
            <button onClick={() => onEdit('date')} className="text-red-400 font-bold text-sm shrink-0">Edit</button>
          </div>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-400 mb-1">From : </p>
              <p className={`text-lg font-bold break-words ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight?.from || 'New York'}</p>
            </div>
            <button onClick={() => onEdit('from')} className="text-red-400 font-bold text-sm shrink-0">Edit</button>
          </div>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-400 mb-1">To : </p>
              <p className={`text-lg font-bold break-words ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight?.to || 'Tokyo'}</p>
            </div>
            <button onClick={() => onEdit('to')} className="text-red-400 font-bold text-sm shrink-0">Edit</button>
          </div>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-400 mb-1">Flight : </p>
              <p className={`text-lg font-bold break-words ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{flight?.airline || 'Japan Airlines'}</p>
            </div>
            <button onClick={() => onEdit('flight')} className="text-red-400 font-bold text-sm shrink-0">Edit</button>
          </div>

          <div className={`p-6 rounded-3xl border transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
              <FileText size={18} className="text-blue-600" />
              Traveler Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Passport Number</label>
                <input 
                  type="text" 
                  value={passport} 
                  onChange={e => setPassport(e.target.value)} 
                  placeholder="Enter your passport number"
                  className={`w-full text-base font-bold px-4 py-3 rounded-xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-600' : 'bg-white text-slate-900 border-slate-200 focus:border-blue-600'}`} 
                />
              </div>
            </div>
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
          onClick={() => onContinue(guests, passport)}
          disabled={!passport.trim()}
          className={`w-full bg-blue-600 text-white py-6 rounded-[32px] font-bold text-xl shadow-xl active:scale-95 transition-all mt-12 disabled:opacity-50 disabled:active:scale-100 ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
