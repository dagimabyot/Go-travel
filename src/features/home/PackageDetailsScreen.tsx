import React, { useState } from 'react';
import { ChevronLeft, Bookmark, Plane, Hotel, Car, MapPin, Star, Compass } from 'lucide-react';
import { Package, User } from '../../types';
import { CheckAvailabilityModal } from './CheckAvailabilityModal';
import { FlightDetailsModal } from './FlightDetailsModal';
import { HotelDetailsModal } from './HotelDetailsModal';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar } from '../../components/ui/Avatar';

interface PackageDetailsScreenProps {
  pkg: Package;
  user: User | null;
  onBack: () => void;
  onBook: () => void;
  language: string;
  appearance: string;
  toggleSaved: (p: Package) => void;
  isSaved: boolean;
}

export const PackageDetailsScreen = ({ pkg, user, onBack, onBook, language, appearance, toggleSaved, isSaved }: PackageDetailsScreenProps) => {
  const [activeModal, setActiveModal] = useState<'availability' | 'flight' | 'hotel' | null>(null);
  const [mainImage, setMainImage] = useState(pkg.image);

  const galleryImages = pkg.images || [pkg.image];

  return (
    <div className={`fixed inset-0 z-[80] flex flex-col overflow-y-auto no-scrollbar pt-24 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Hero Section */}
      <div className="relative w-full px-6 pt-12 flex flex-col gap-6">
        {/* Main Image Container */}
        <div className="relative h-[400px] w-full rounded-[40px] overflow-hidden shadow-2xl">
          <motion.img 
            key={mainImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={mainImage} 
            alt={pkg.name} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
          />
          
          {/* Overlay Buttons */}
          <div className="absolute top-6 left-6 right-6 flex justify-between">
            <button onClick={onBack} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => toggleSaved(pkg)}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white'}`}
            >
              <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} className={isSaved ? 'text-red-500' : appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'} />
            </button>
          </div>
          
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white font-bold text-lg">Details</div>
        </div>

        {/* Horizontal Gallery (Below Main Image) */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-2">
          {galleryImages.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setMainImage(img)}
              className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 transition-all ${
                mainImage === img 
                  ? 'border-blue-500 scale-105' 
                  : appearance === 'Dark Mode' ? 'border-slate-800' : 'border-white'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i}`} referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 pt-10 pb-32">
        <div className="mb-8">
          <h2 className={`text-4xl font-bold mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h2>
          <p className="text-slate-400 text-lg">{pkg.location}</p>
        </div>

        <div className="mb-10">
          <h3 className={`font-bold text-xl mb-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>We know what you want</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Life on land offers plenty of tantalizing options for adventure travelers, but there's a whole other world of excitement waiting under the sea.
          </p>
        </div>

        {/* Additional Images */}
        <div className="space-y-6 mb-10">
          {galleryImages.slice(1, 4).map((img, i) => (
            <div key={i} className="h-56 rounded-[40px] overflow-hidden shadow-lg">
              <img src={img} className="w-full h-full object-cover" alt={`Detail ${i + 1}`} referrerPolicy="no-referrer" />
            </div>
          ))}
          {galleryImages.length <= 1 && (
            <div className="h-56 rounded-[40px] overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Scenic View" referrerPolicy="no-referrer" />
            </div>
          )}
          <div className="mb-4">
            <h3 className={`font-bold text-xl mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>The Best Sunset Ever!</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Life on land offers plenty of tantalizing options for adventure travelers, but there's a whole other world of excitement waiting under the sea.
            </p>
          </div>
        </div>
      </div>

      {/* Let's Go Button */}
      <div className="fixed bottom-10 left-8 right-8 z-[90]">
        <button 
          onClick={onBook}
          className={`w-full py-6 bg-blue-700 text-white rounded-[32px] font-bold text-xl shadow-2xl active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
        >
          Let's Go
        </button>
      </div>

      <AnimatePresence>
        {activeModal === 'availability' && (
          <CheckAvailabilityModal 
            onClose={() => setActiveModal(null)} 
            onNext={() => setActiveModal(null)} 
            language={language} 
          />
        )}
        {activeModal === 'flight' && (
          <FlightDetailsModal 
            onClose={() => setActiveModal(null)} 
            language={language} 
          />
        )}
        {activeModal === 'hotel' && (
          <HotelDetailsModal 
            onClose={() => setActiveModal(null)} 
            language={language} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
