import React, { useState } from 'react';
import { ChevronLeft, AlertCircle, Download, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, User } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { generateProfessionalPDF } from '../../utils/pdfGenerator';
import { useTranslation } from '../../hooks/useTranslation';

interface FlightBookingDetailsScreenProps {
  booking: Booking;
  user: User | null;
  onBack: () => void;
  onCancel: (id: number) => void;
  onDownload: () => void;
  appearance: string;
  isSaved: boolean;
  toggleSaved: () => void;
}

export const FlightBookingDetailsScreen = ({ 
  booking, 
  user, 
  onBack, 
  onCancel, 
  onDownload,
  appearance,
  isSaved,
  toggleSaved
}: FlightBookingDetailsScreenProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { t } = useTranslation();

  const handleCancel = () => {
    onCancel(booking.id);
    setShowCancelConfirm(false);
    onBack(); // Go back to trips list
  };

  const handleDownloadPDF = async () => {
    generateProfessionalPDF(booking);
  };

  return (
    <div className={`min-h-screen px-8 pt-12 pb-24 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex justify-between items-center mb-12">
        <button 
          onClick={onBack}
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-sm border active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-600'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">{t('flightDetails')}</h1>
      </header>

      <div className="space-y-6 mb-16">
        <div className={`p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <p className="text-xl font-bold">
            {t('date')} : {booking.departure_time ? booking.departure_time.replace(' ', ' T') : '2026-08-20 T14:00:00'}
          </p>
        </div>

        <div className={`p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <p className="text-xl font-bold">
            {t('from')} : {booking.from_city || 'New York'}
          </p>
        </div>

        <div className={`p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <p className="text-xl font-bold">
            {t('to')} : {booking.to_city || 'Tokyo'}
          </p>
        </div>

        <div className={`p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <p className="text-xl font-bold">
            {t('flight')} : {booking.airline || 'Japan Airlines'}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">{t('aboutYourFlight')}</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t('flightDescription')
              .replace('{airline}', booking.airline || 'Alaska Airlines')
              .replace('{from}', booking.from_city || 'Sylhet')
              .replace('{to}', booking.to_city || 'Manarola')}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">{t('destinationPreview')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-40 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=80" alt="Destination" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="h-40 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80" alt="Destination" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={handleDownloadPDF}
          className={`w-full bg-blue-600 text-white py-6 rounded-[32px] font-bold text-xl shadow-xl active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
        >
          <Download size={20} className="mr-2 inline" />
          {t('downloadTicketPDF')}
        </button>
        <button 
          onClick={() => setShowCancelConfirm(true)}
          className="w-full bg-red-500 text-white py-6 rounded-[32px] font-bold text-xl shadow-xl active:scale-95 transition-all shadow-red-500/20"
        >
          {t('cancelThisFlight')}
        </button>
      </div>

      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white'}`}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${appearance === 'Dark Mode' ? 'bg-red-500/10' : 'bg-red-50'}`}>
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('cancelFlightQuestion')}</h3>
              <p className="text-slate-500 text-sm mb-8">
                {t('cancelFlightWarning')}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCancelConfirm(false)}
                  className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
                >
                  {t('keepFlight')}
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-500/20"
                >
                  {t('yesCancel')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
