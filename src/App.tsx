import React from 'react';
import { Providers } from './app/Providers';
import { Router } from './app/Router';
import { useApp } from './hooks/useApp';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, Plus } from 'lucide-react';

export default function App() {
  const appState = useApp();
  const { toast, setToast, appearance } = appState;

  return (
    <Providers>
      <Router {...appState} />
      
      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-80 p-4 rounded-2xl shadow-2xl z-[300] flex items-center gap-3 border ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white border-white/10' : 'bg-white text-slate-900 border-slate-100'}`}
          >
            <div className={`${appearance === 'Dark Mode' ? 'bg-primary/20' : 'bg-primary/10'} p-2 rounded-full`}>
              <Bell size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold">Notification</p>
              <p className={`text-[11px] leading-tight ${appearance === 'Dark Mode' ? 'opacity-80' : 'text-slate-500'}`}>{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className={`transition-opacity ${appearance === 'Dark Mode' ? 'opacity-40 hover:opacity-100' : 'opacity-20 hover:opacity-100'}`}>
              <Plus size={18} className="rotate-45" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Providers>
  );
}
