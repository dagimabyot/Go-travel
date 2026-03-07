import React from 'react';
import { ChevronLeft, Bookmark, Star, MapPin, Compass, BedDouble } from 'lucide-react';
import { Hotel } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface HotelDetailsScreenProps {
  hotel: Hotel;
  onBack: () => void;
  onBook: () => void;
  language: string;
  toggleSaved: (h: Hotel) => void;
  isSaved: boolean;
  appearance: string;
}

export const HotelDetailsScreen = ({ hotel, onBack, onBook, toggleSaved, isSaved, appearance }: HotelDetailsScreenProps) => {
  const [mainImage, setMainImage] = React.useState(hotel.image);

  const galleryImages = hotel.images || [hotel.image];

  return (
    <div className={`fixed inset-0 z-[80] flex flex-col overflow-y-auto no-scrollbar transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Hero Section */}
      <div className="relative w-full px-6 pt-12 flex flex-col gap-6">
        {/* Main Image Container */}
        <div className="relative h-[400px] w-full rounded-[40px] overflow-hidden shadow-2xl">
          <motion.img 
            key={mainImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={mainImage} 
            alt={hotel.name} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
          />
          
          {/* Overlay Buttons */}
          <div className="absolute top-6 left-6 right-6 flex justify-between">
            <button onClick={onBack} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => toggleSaved(hotel)}
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
          <h2 className={`text-4xl font-bold mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{hotel.name}</h2>
          <p className="text-slate-400 text-lg">{hotel.location}</p>
        </div>

        {/* Map Section */}
        <div className={`mb-10 h-48 rounded-[40px] overflow-hidden relative shadow-inner ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-100'}`}>
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-60 grayscale" alt="Map Placeholder" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl border-4 ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-white'}`}>
              <MapPin size={20} />
            </div>
          </div>
          <button className={`absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-red-500 shadow-lg ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-white'}`}>
            <Compass size={16} />
          </button>
        </div>

        {/* Reviews Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-bold text-xl ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Reviews</h3>
            <button className="text-sm text-blue-600 font-bold">See all</button>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Sami Ahmed', date: 'Jun 1, 2021', rating: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sami' },
              { name: 'Mahdi Ahmed', date: 'Jun 1, 2021', rating: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahdi' },
            ].map((review, i) => (
              <div key={i} className={`pb-6 last:border-0 border-b ${appearance === 'Dark Mode' ? 'border-slate-900' : 'border-slate-100'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} className={`w-12 h-12 rounded-full border-2 shadow-sm ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-white'}`} alt={review.name} referrerPolicy="no-referrer" />
                    <div>
                      <p className={`font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{review.name}</p>
                      <p className="text-xs text-slate-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-current" />)}
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Great place to stay. Food quality is good. Services are good. Overall value for money.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sleeping Arrangements */}
        <div className="mb-10">
          <h3 className={`font-bold text-xl mb-6 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Sleeping Arrangements</h3>
          <div className="flex gap-4">
            <button className={`flex-1 p-6 rounded-[32px] border text-left transition-all active:scale-95 ${appearance === 'Dark Mode' ? 'border-blue-900/30 bg-blue-900/10' : 'border-red-200 bg-red-50/30'}`}>
              <BedDouble className="text-blue-600 mb-4" size={32} />
              <p className={`font-bold mb-1 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Bedroom 1</p>
              <p className="text-xs text-slate-400">1 King Bed</p>
            </button>
            <button className={`flex-1 p-6 rounded-[32px] border text-left transition-all active:scale-95 ${appearance === 'Dark Mode' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
              <BedDouble className="text-blue-600 mb-4" size={32} />
              <p className={`font-bold mb-1 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Bedroom 2</p>
              <p className="text-xs text-slate-400">1 Single Bed</p>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl p-8 border-t flex justify-between items-center z-[90] transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950/90 border-slate-900' : 'bg-white/90 border-slate-100'}`}>
        <div>
          <p className="text-xs text-slate-400 font-bold mb-1">Total cost</p>
          <p className={`text-3xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>${hotel.price} <span className="text-sm font-normal text-slate-400">/ night</span></p>
        </div>
        <button 
          onClick={onBook}
          className={`px-14 py-5 bg-blue-700 text-white rounded-[24px] font-bold text-lg shadow-xl active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};
