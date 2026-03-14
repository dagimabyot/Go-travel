import React, { useState } from 'react';
import { ChevronLeft, Minus, Plus, Info } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface ConfirmationScreenProps {
  onDone: () => void;
  onBack: () => void;
  appearance?: string;
}

export const ConfirmationScreen = ({ onDone, onBack, appearance }: ConfirmationScreenProps) => {
  const { t } = useTranslation();
  const [guests, setGuests] = useState(2);

  return (
    <div className={`min-h-screen pb-24 pt-8 px-6 max-w-4xl mx-auto transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-center mb-12 relative">
        <button onClick={onBack} className={`absolute left-0 w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('confirmation')}</h1>
      </header>

      <div className="space-y-10">
        <h2 className={`text-2xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('yourTrip')}</h2>

        <div className="space-y-8">
          <SummaryItem 
            label={t('date')} 
            value="10-14 May, 2021" 
            onEdit={onBack}
            appearance={appearance}
          />
          <SummaryItem 
            label={t('place')} 
            value="Italy, Manarola" 
            hideEdit
            appearance={appearance}
          />
          <SummaryItem 
            label={t('flight')} 
            value="Alaska Airlines" 
            onEdit={onBack}
            appearance={appearance}
          />
          <SummaryItem 
            label={t('hotel')} 
            value="Water Hotel" 
            onEdit={onBack}
            appearance={appearance}
          />
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-slate-400 mb-1">{t('guests')} :</p>
              <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{guests} {t('guests')}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-slate-400 transition-colors ${appearance === 'Dark Mode' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
              >
                <Minus size={20} />
              </button>
              <span className={`font-bold text-xl ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{guests}</span>
              <button 
                onClick={() => setGuests(guests + 1)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-slate-400 transition-colors ${appearance === 'Dark Mode' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 text-slate-400 mb-10">
            <Info size={16} className="text-blue-600" />
            <p className="text-xs">{t('guestPriceNote')}</p>
          </div>

          <div className={`flex justify-between items-center mb-10 pt-6 border-t ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-slate-50'}`}>
            <p className="text-sm text-slate-400">{t('total')} :</p>
            <p className={`text-3xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>${(guests * 700).toLocaleString()}</p>
          </div>

          <button 
            onClick={onDone}
            className={`w-full bg-blue-600 text-white py-5 rounded-[24px] font-bold text-xl shadow-xl active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
          >
            {t('continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value, hideEdit, onEdit, appearance }: { label: string, value: string, hideEdit?: boolean, onEdit?: () => void, appearance?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm text-slate-400 mb-1">{label} :</p>
        <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      </div>
      {!hideEdit && (
        <button onClick={onEdit} className="text-red-500 text-sm font-bold active:scale-95 transition-all">{t('edit')}</button>
      )}
    </div>
  );
};
