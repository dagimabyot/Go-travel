import React from 'react';
import { ChevronLeft, Plane } from 'lucide-react';
import { Flight } from '../../types';
import { generateProfessionalPDF } from '../../utils/pdfGenerator';
import { translations } from '../../constants/translations';

import { BoardingPass } from '../../components/ui/BoardingPass';

interface TicketScreenProps {
  onBack: () => void;
  onDownload: () => void;
  language: string;
  appearance: string;
  flight: Flight | null;
  seat: string;
}

export const TicketScreen = ({ onBack, onDownload, language, appearance, flight, seat }: TicketScreenProps) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  const handleDownload = () => {
    if (flight) {
      // Create a temporary booking object for the PDF generator
      const mockBooking = {
        id: Math.floor(Math.random() * 1000000),
        user_id: 1,
        type: 'flight' as const,
        flight_id: flight.id,
        from_city: flight.from,
        to_city: flight.to,
        departure_time: flight.departure,
        arrival_time: flight.arrival,
        airline: flight.airline,
        price: flight.price,
        seat: seat,
        status: 'Confirmed',
        date: flight.departure
      };
      generateProfessionalPDF(mockBooking);
      onDownload();
    }
  };

  const passengerName = localStorage.getItem('travel_user') 
    ? JSON.parse(localStorage.getItem('travel_user')!).name 
    : 'John Doe';

  const boardingTime = flight?.departure 
    ? new Date(flight.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) 
    : '22:30';

  const flightDate = flight?.departure 
    ? new Date(flight.departure).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) 
    : '10 June';

  return (
    <div className={`min-h-screen pb-24 pt-8 px-6 max-w-6xl mx-auto transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-center mb-12 relative">
        <button onClick={onBack} className={`absolute left-0 w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('boardingPass')}</h1>
      </header>

      <div className="py-8">
        <BoardingPass 
          passengerName={passengerName}
          from={flight?.from || 'Argentina'}
          to={flight?.to || 'New York'}
          flight={flight?.id || 'BA302'}
          date={flightDate}
          gate="A2"
          boardingTime={boardingTime}
          seat={seat || '17'}
          appearance={appearance}
        />
      </div>

      <div className="max-w-md mx-auto mt-12">
        <button 
          onClick={handleDownload}
          className={`w-full bg-blue-600 text-white py-6 rounded-[32px] font-bold text-xl shadow-xl active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
        >
          {t('downloadTicket')}
        </button>
      </div>
    </div>
  );
};
