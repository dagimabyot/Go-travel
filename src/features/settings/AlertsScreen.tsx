import React from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { AppNotification } from '../../types';
import { translations } from '../../constants/translations';

interface AlertsScreenProps {
  notifications: AppNotification[];
  onClear: () => void;
  language: string;
  appearance: string;
}

export const AlertsScreen = ({ notifications, onClear, language, appearance }: AlertsScreenProps) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  
  return (
    <div className={`pb-24 pt-8 px-6 max-w-4xl mx-auto min-h-screen transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex justify-between items-center mb-10">
        <h1 className={`text-3xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('alerts')}</h1>
        {notifications.length > 0 && (
          <button onClick={onClear} className="text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </header>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <Bell size={32} className="opacity-20" />
          </div>
          <p className="font-bold uppercase tracking-widest text-xs">{t('noAlerts')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-6 rounded-[32px] shadow-sm border transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{notif.type}</span>
                <span className="text-[10px] text-slate-300 font-bold">{notif.time}</span>
              </div>
              <h3 className={`font-bold mb-1 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{notif.title}</h3>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-500'}`}>{notif.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
