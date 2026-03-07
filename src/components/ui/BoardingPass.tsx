import React from 'react';
import { Plane } from 'lucide-react';

interface BoardingPassProps {
  passengerName: string;
  from: string;
  to: string;
  flight: string;
  date: string;
  gate: string;
  boardingTime: string;
  seat: string;
  appearance?: string;
}

export const BoardingPass: React.FC<BoardingPassProps> = ({
  passengerName,
  from,
  to,
  flight,
  date,
  gate,
  boardingTime,
  seat,
  appearance = 'Light Mode'
}) => {
  const isDark = appearance === 'Dark Mode';

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row transition-colors duration-300 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
      {/* Main Ticket (Left Side) */}
      <div className="flex-grow flex flex-col relative">
        {/* Header */}
        <div className="relative h-24 flex items-center justify-between px-8 overflow-hidden">
          {/* Blue Curved Header Background */}
          <div className="absolute inset-0 bg-sky-500" style={{ clipPath: 'ellipse(70% 100% at 50% 0%)' }}></div>
          
          <span className="relative z-10 text-[10px] font-bold text-white uppercase tracking-widest">Boarding Pass</span>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-2 text-white">
              <Plane size={20} fill="white" className="rotate-45" />
              <span className="text-xl font-black tracking-tighter">AIRLINE</span>
            </div>
            <span className="text-[10px] font-bold text-white/90 uppercase tracking-[0.2em] mt-0.5">Economy</span>
          </div>
          
          <span className="relative z-10 text-[10px] font-bold text-white uppercase tracking-widest">Boarding Pass</span>
        </div>

        {/* Content */}
        <div className="flex flex-1 p-8 pt-4">
          {/* Vertical Barcode Section */}
          <div className="flex flex-col items-center justify-center mr-8">
            <div className="w-12 h-40 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col gap-[2px] p-1">
                {[...Array(25)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-slate-900" 
                    style={{ height: `${Math.random() * 4 + 1}px` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div className="flex-1 grid grid-cols-3 gap-y-6 gap-x-4">
            <div className="col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Passenger Name</p>
              <p className={`text-lg font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{passengerName}</p>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Flight</p>
              <p className={`text-lg font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{flight}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">From</p>
              <p className={`text-lg font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{from}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">To</p>
              <p className={`text-lg font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{to}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
              <p className={`text-lg font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{date}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gate</p>
              <p className={`text-2xl font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{gate}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Boarding Time</p>
              <p className={`text-2xl font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{boardingTime}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Seat</p>
              <p className={`text-2xl font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{seat}</p>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="px-8 pb-6">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-t border-slate-100 dark:border-slate-800 pt-4">
            Boarding gate closes 20 minutes prior to departure time
          </p>
        </div>
      </div>

      {/* Vertical Dashed Separator */}
      <div className="hidden md:flex flex-col items-center justify-between py-4 relative">
        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 absolute -top-4 left-1/2 -translate-x-1/2 z-20 border-b border-slate-100 dark:border-slate-800" />
        <div className="w-[1px] h-full border-l-2 border-dashed border-slate-200 dark:border-slate-800" />
        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 border-t border-slate-100 dark:border-slate-800" />
      </div>

      {/* Ticket Stub (Right Side) */}
      <div className={`md:w-72 flex flex-col transition-colors duration-300 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50/50'}`}>
        <div className="h-24 flex items-center justify-center px-6">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Boarding Pass</span>
        </div>

        <div className="flex-1 px-8 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Name</p>
              <p className={`text-sm font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{passengerName}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">From</p>
              <p className={`text-sm font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{from}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">To</p>
              <p className={`text-sm font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{to}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Flight</p>
              <p className={`text-sm font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{flight}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date</p>
              <p className={`text-sm font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{date}</p>
            </div>
          </div>

          <div className="flex justify-between items-end pt-2">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Gate</p>
              <p className={`text-lg font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{gate}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Boarding Time</p>
              <p className={`text-lg font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{boardingTime}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Seat</p>
              <p className={`text-lg font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{seat}</p>
            </div>
          </div>

          {/* Horizontal Barcode */}
          <div className="pt-6">
            <div className="w-full h-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden p-1">
              <div className="flex gap-[1px] w-full h-full">
                {[...Array(60)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-full ${isDark ? 'bg-white/80' : 'bg-slate-900'}`} 
                    style={{ width: `${Math.random() * 3 + 1}px` }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[8px] font-mono text-slate-400 text-center mt-1 tracking-[0.5em]">000000000000</p>
          </div>
        </div>
      </div>
    </div>
  );
};
