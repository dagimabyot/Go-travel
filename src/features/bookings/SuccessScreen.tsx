import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface SuccessScreenProps {
  onBackToHome: () => void;
  onViewTrips?: () => void;
  appearance: string;
}

export const SuccessScreen = ({ onBackToHome, onViewTrips, appearance }: SuccessScreenProps) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-8 text-center transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        className="relative mb-12"
      >
        {/* Animated Stars */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-12 -left-8 text-yellow-400"
        >
          <Star size={32} fill="currentColor" />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          className="absolute -top-16 right-0 text-yellow-400"
        >
          <Star size={24} fill="currentColor" />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute top-0 -right-12 text-yellow-400"
        >
          <Star size={20} fill="currentColor" />
        </motion.div>

        <h1 className={`text-3xl sm:text-5xl font-black tracking-tight italic drop-shadow-sm px-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Georgia, serif' }}>
          Congratulations!
        </h1>
        <div className="h-2 w-full bg-yellow-400/30 rounded-full mt-2 -rotate-2" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-xs mx-auto">
          You tour has been booked! You will get your tickets on your mail or check your profile
        </p>

        <div className="flex flex-col gap-4 w-full min-w-[280px]">
          <button 
            onClick={onBackToHome}
            className={`w-full bg-blue-600 text-white py-5 rounded-[24px] font-bold text-xl shadow-xl active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
          >
            Back to Home
          </button>
          <button 
            onClick={() => {
              // We need a way to tell the parent to go to 'my-trips'
              // Since we only have onBackToHome, I'll modify the props
              onViewTrips?.();
            }}
            className={`w-full py-4 rounded-[24px] font-bold text-sm transition-all ${appearance === 'Dark Mode' ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}
          >
            View My Trips
          </button>
        </div>
      </motion.div>
    </div>
  );
};
