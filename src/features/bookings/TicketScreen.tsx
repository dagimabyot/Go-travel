import React from 'react';
import { ArrowLeft, Download, QrCode, MapPin, Calendar, Clock, Plane } from 'lucide-react';
import { Booking } from '../../types';
import { translations } from '../../constants/translations';
import { motion } from 'motion/react';
import { generateProfessionalPDF } from '../../utils/pdfGenerator';

interface TicketScreenProps {
  booking: Booking;
  onBack: () => void;
  language: string;
}

export const TicketScreen = ({ booking, onBack, language }: TicketScreenProps) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24 pt-8 px-6 max-w-4xl mx-auto">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-full border border-slate-100 dark:border-slate-700">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight dark:text-white">Ticket</h1>
      </header>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl relative max-w-sm mx-auto"
      >
        <div className="p-8 pb-12">
          <div className="flex justify-between items-start mb-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Plane size={32} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-xl">GoTravel</p>
              <p className="text-slate-400 text-xs uppercase tracking-widest">Economy Class</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-3xl font-bold text-white">{booking.from_city?.substring(0, 3).toUpperCase() || 'NYC'}</p>
              <p className="text-slate-400 text-xs">{booking.from_city || 'New York'}</p>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <div className="w-full h-[1px] bg-slate-700 relative">
                <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <p className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest">8h 45m</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{booking.to_city?.substring(0, 3).toUpperCase() || 'ROM'}</p>
              <p className="text-slate-400 text-xs">{booking.to_city || 'Rome'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
              <p className="text-white font-bold">{booking.date ? new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '10 May, 2021'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
              <p className="text-white font-bold">{booking.departure_time ? new Date(booking.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '9:30 AM'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Passenger</p>
              <p className="text-white font-bold">{localStorage.getItem('travel_user') ? JSON.parse(localStorage.getItem('travel_user')!).name : 'John Doe'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Seat</p>
              <p className="text-white font-bold">{booking.seat || '14A'}</p>
            </div>
          </div>
        </div>

        <div className="relative h-8 flex items-center">
          <div className="absolute left-0 w-4 h-8 bg-white dark:bg-slate-950 rounded-r-full" />
          <div className="flex-1 border-t-2 border-dashed border-slate-800 mx-4" />
          <div className="absolute right-0 w-4 h-8 bg-white dark:bg-slate-950 rounded-l-full" />
        </div>

        <div className="p-8 pt-12 flex flex-col items-center">
          <div className="bg-white p-6 rounded-[32px] mb-6">
            <QrCode size={160} className="text-slate-900" />
          </div>
          <p className="text-slate-400 text-xs font-mono">FB-XJ9921</p>
        </div>
      </motion.div>

      <div className="max-w-sm mx-auto mt-10 space-y-4">
        <button 
          onClick={() => generateProfessionalPDF(booking)}
          className="w-full bg-primary text-white py-5 rounded-[24px] font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <Download size={20} />
          Download Ticket
        </button>
        
        <button 
          onClick={() => {
            const flightDate = booking.departure_time || booking.date || '2026-05-10T07:30:00';
            const startDate = new Date(flightDate).toISOString().replace(/-|:|\.\d+/g, '');
            const endDate = new Date(new Date(flightDate).getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');
            
            const icsContent = [
              'BEGIN:VCALENDAR',
              'VERSION:2.0',
              'BEGIN:VEVENT',
              `DTSTART:${startDate}`,
              `DTEND:${endDate}`,
              `SUMMARY:Flight to ${booking.to_city || booking.location || 'Destination'}`,
              `DESCRIPTION:Flight with ${booking.airline || 'GoTravel'}. Seat: ${booking.seat || 'N/A'}`,
              `LOCATION:${booking.from_city || 'Origin'} to ${booking.to_city || 'Destination'}`,
              'END:VEVENT',
              'END:VCALENDAR'
            ].join('\n');

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'flight-booking.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="w-full bg-slate-100 text-slate-900 py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <Calendar size={20} className="text-primary" />
          Add to Calendar
        </button>
      </div>
    </div>
  );
};
