import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Plane } from 'lucide-react';

interface SplashScreenProps {
  onNext: () => void;
}

export const SplashScreen = ({ onNext }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onNext, 2000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-slate-100 rounded-full" />
          <motion.div 
            initial={{ x: -20, rotate: -30 }}
            animate={{ x: 0, rotate: -30 }}
            className="absolute top-4 left-0 w-16 h-4 bg-primary rounded-lg shadow-lg shadow-primary/20"
          />
          <motion.div 
            initial={{ x: 20, rotate: 30 }}
            animate={{ x: 0, rotate: 30 }}
            className="absolute top-12 right-0 w-16 h-4 bg-success rounded-lg shadow-lg shadow-success/20"
          />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">GoTravel</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">FIND, PLAN, GO</p>
      </motion.div>
    </div>
  );
};
