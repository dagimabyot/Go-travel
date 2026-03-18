import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Star, Calendar, Plane, Hotel, Car, MapPin, X, Download, AlertCircle, CheckCircle2, Info, Trash2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Booking, User } from '../../types';
import { FlightMap } from '../../components/ui/FlightMap';
import { Avatar } from '../../components/ui/Avatar';
import { CalendarModal } from '../../components/ui/CalendarModal';
import { generateProfessionalPDF } from '../../utils/pdfGenerator';
import { useTranslation } from '../../hooks/useTranslation';

// Leaflet icon fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
    // Force a resize to ensure map tiles load correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [center, map]);
  return null;
}

interface TripDetailsScreenProps {
  booking: Booking;
  user: User | null;
  onBack: () => void;
  onCancel: (id: string) => void;
  appearance: string;
  isSaved: boolean;
  toggleSaved: () => void;
}

export const TripDetailsScreen = ({ booking: initialBooking, user, onBack, onCancel, appearance, isSaved, toggleSaved }: TripDetailsScreenProps) => {
  const [booking, setBooking] = useState(initialBooking);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { t } = useTranslation();

  // Mock flight map data
  const flightMapData = {
    origin: { lat: 24.8949, lng: 91.8687, name: booking.from_city || 'Sylhet', code: 'ZYL' },
    destination: { lat: 44.1068, lng: 9.7289, name: booking.to_city || 'Manarola', code: 'MAN' },
    layovers: [
      { lat: 25.2048, lng: 55.2708, name: 'Dubai', code: 'DXB' }
    ],
    estimatedArrival: booking.arrival_time || '9:30 PM, 10 May'
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    onCancel(booking.id);
    setShowCancelConfirm(false);
    onBack(); // Go back to trips list after cancellation
  };

  const handleDownloadPDF = async () => {
    generateProfessionalPDF(booking, user);
  };

  const renderCancelModal = () => (
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
            <h3 className={`text-xl font-bold mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('cancelBookingQuestion')}</h3>
            <p className="text-slate-500 text-sm mb-8">
              {t('cancelFlightWarning')}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCancelConfirm(false)}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                {t('keepTrip')}
              </button>
              <button 
                onClick={confirmCancel}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-500/20"
              >
                {t('yesCancel')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderFlightModal = () => (
    <AnimatePresence>
      {showFlightModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className={`w-full max-w-md rounded-t-[48px] p-8 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white'}`}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('flightDetails')}</h3>
              <button onClick={() => setShowFlightModal(false)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
              {[1, 2].map((i) => (
                <div key={i} className={`p-6 rounded-[32px] border transition-colors ${i === 1 ? 'border-red-400' : (appearance === 'Dark Mode' ? 'border-slate-800' : 'border-slate-100')}`}>
                  <div className="flex justify-center mb-4">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{i === 1 ? '100% on time' : '90% on time'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-center">
                      <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>7:30 AM</p>
                      <p className="text-[10px] text-slate-400 font-bold">Larkrow</p>
                    </div>
                    <div className="flex-1 px-4 flex flex-col items-center">
                      <div className={`w-full h-[1px] relative ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">2h 40m</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>9:30 PM</p>
                      <p className="text-[10px] text-slate-400 font-bold">Goa</p>
                    </div>
                  </div>
                  <div className={`flex justify-between items-center pt-4 border-t ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-slate-50'}`}>
                    <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>$150<span className="text-xs font-normal text-slate-400">/person</span></p>
                    <button 
                      onClick={toggleSaved}
                      className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${isSaved ? 'bg-slate-900 text-white' : appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400'}`}
                    >
                      <Star size={16} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderHotelModal = () => (
    <AnimatePresence>
      {showHotelModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className={`w-full max-w-md rounded-t-[48px] p-8 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white'}`}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('hotelDetails')}</h3>
              <button onClick={() => setShowHotelModal(false)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
              {[
                { name: 'Luxury Suite', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80' },
                { name: 'Ocean View', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80' }
              ].map((htl, i) => (
                <div key={i} className="relative h-40 rounded-[32px] overflow-hidden group">
                  <img src={htl.image} alt={htl.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <button 
                    onClick={toggleSaved}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isSaved ? 'bg-slate-900 text-white' : 'bg-white/20 text-white'}`}
                  >
                    <Star size={14} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                  <div className="absolute bottom-6 left-6">
                    <h4 className="text-lg font-bold text-white mb-1">{htl.name}</h4>
                    <p className="text-white/80 text-xs font-medium">$15.99<span className="text-[10px] opacity-60">/per day</span></p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderMoreInfo = () => (
    <div className="mb-8 space-y-4">
      <h2 className={`text-lg font-bold mb-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('tripInformation')}</h2>
      <div className="grid grid-cols-1 gap-3">
        <div className={`p-4 rounded-2xl flex items-start gap-3 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${appearance === 'Dark Mode' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            <CheckCircle2 size={16} className="text-blue-600" />
          </div>
          <div>
            <p className={`text-xs font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('confirmationNumber')}</p>
            <p className="text-[10px] text-slate-400">#GT-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
        </div>
        <div className={`p-4 rounded-2xl flex items-start gap-3 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${appearance === 'Dark Mode' ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
            <Info size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className={`text-xs font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('checkInInstructions')}</p>
            <p className="text-[10px] text-slate-400">Please arrive 2 hours before departure. Digital boarding pass available in app.</p>
          </div>
        </div>
        <div className={`p-4 rounded-2xl flex items-start gap-3 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${appearance === 'Dark Mode' ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
            <Star size={16} className="text-amber-600" />
          </div>
          <div>
            <p className={`text-xs font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('travelTips')}</p>
            <p className="text-[10px] text-slate-400">Carry a light jacket as evenings can get chilly. Don't forget your universal adapter!</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPackageDetails = () => (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="relative h-[45vh]">
        <img 
          src={booking.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'} 
          alt={booking.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
        
        <div className="absolute top-8 left-4 right-4 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={toggleSaved}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
          >
            <Star size={20} fill={isSaved ? "white" : "none"} className={isSaved ? "text-white" : ""} />
          </button>
        </div>

        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2">
          {(booking.images || [booking.image]).slice(0, 3).map((img, i) => (
            <div key={i} className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-lg">
              <img src={img} alt="Gallery" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ))}
          {booking.images && booking.images.length > 3 && (
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs font-bold border-2 border-white">
              +{booking.images.length - 3}
            </div>
          )}
        </div>
      </div>

      <div className={`relative -mt-12 rounded-t-[48px] px-6 pt-10 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className={`text-3xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{booking.name || 'Palolem Beach'}</h1>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-sm">{booking.location || 'Italy, Manarola'}</p>
          </div>
        </div>

        <div className={`flex items-center justify-between mb-8 p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-700' : 'bg-white'}`}>
              <Calendar size={20} className={appearance === 'Dark Mode' ? 'text-slate-300' : 'text-slate-600'} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Date : {booking.date ? booking.date.replace(' ', ' T') : '2026-08-20 T14:00:00'}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('aboutTrip')}</h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {booking.description || 'Manarola is one of the most famous and picturesque villages of the Cinque Terre. Known for its colorful houses that seem to tumble down the cliffs into the sea, it offers a truly unique and breathtaking experience. The village is surrounded by lush vineyards that produce the famous Sciacchetrà wine. Visitors can explore the narrow winding streets, enjoy fresh seafood at local trattorias, and take in the stunning sunsets from the harbor. Whether you are looking for a romantic getaway or an adventurous hiking trip, Manarola has something for everyone. The famous Via dell\'Amore (Path of Love) connects Manarola to Riomaggiore, offering spectacular coastal views.'}
          </p>
        </div>

        {renderMoreInfo()}

        <div className="mb-8">
          <h2 className={`text-lg font-bold mb-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('whatsIncluded')}</h2>
          <div className="flex gap-4">
            <button onClick={() => setShowFlightModal(true)} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <Plane size={20} className={appearance === 'Dark Mode' ? 'text-slate-300' : 'text-slate-600'} />
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t('flight')}</span>
            </button>
            <button onClick={() => setShowHotelModal(true)} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <Hotel size={20} className={appearance === 'Dark Mode' ? 'text-slate-300' : 'text-slate-600'} />
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t('hotel')}</span>
            </button>
            <button className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <Car size={20} className={appearance === 'Dark Mode' ? 'text-slate-300' : 'text-slate-600'} />
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t('transfer')}</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className={`text-lg font-bold mb-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('photoGallery')}</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="h-48 rounded-2xl overflow-hidden shadow-sm">
              <img src={booking.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"} alt="Destination" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="grid grid-rows-2 gap-3">
              <div className="h-[90px] rounded-2xl overflow-hidden shadow-sm">
                <img src={(booking.images && booking.images[1]) || "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=400&q=80"} alt="Detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="h-[90px] rounded-2xl overflow-hidden shadow-sm">
                <img src={(booking.images && booking.images[2]) || "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=400&q=80"} alt="Detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="h-24 rounded-2xl overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80" alt="Detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="h-24 rounded-2xl overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1515404929826-76fff9fef204?auto=format&fit=crop&w=400&q=80" alt="Detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            {booking.images && booking.images.length > 3 ? (
              <div className="h-24 rounded-2xl overflow-hidden shadow-sm relative">
                <img src={booking.images[3]} alt="Detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {booking.images.length > 4 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                    +{booking.images.length - 4}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-24 rounded-2xl overflow-hidden shadow-sm relative">
                <img src="https://images.unsplash.com/photo-1469796466635-455ede028aca?auto=format&fit=crop&w=400&q=80" alt="Detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
          </div>
          <button className={`w-full py-4 rounded-2xl text-sm font-bold transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
            {t('exploreAllPhotos')}
          </button>
        </div>

        <div className="mb-8">
          <div className={`relative h-64 rounded-3xl overflow-hidden border transition-colors z-10 ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-slate-100'}`}>
            <MapContainer 
              center={[44.1068, 9.7289]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[44.1068, 9.7289]} />
              <ChangeView center={[44.1068, 9.7289]} />
            </MapContainer>
            <button className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors z-[1000] ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-white text-primary'}`}>
              <Plane size={16} className="rotate-45" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleDownloadPDF}
            className={`w-full py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
          >
            <Download size={20} className="text-primary" />
            {t('downloadTicketPDF')}
          </button>
          <button 
            onClick={handleCancelClick}
            className="w-full py-5 bg-red-500 text-white rounded-[24px] font-bold text-lg shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
          >
            <Trash2 size={20} />
            {t('cancelThisTrip')}
          </button>
        </div>
      </div>

      {/* Modals */}
      {renderCancelModal()}
      {renderFlightModal()}
      {renderHotelModal()}
    </div>
  );

  const renderFlightDetails = () => (
    <div className={`min-h-screen px-6 pt-12 pb-24 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white'}`}>
      <header className="flex justify-between items-center mb-10">
        <button 
          onClick={onBack}
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-sm border active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-600'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-2xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('flightDetails')}</h1>
      </header>

      <div className="mb-10">
        <FlightMap 
          {...flightMapData} 
          flightNumber={booking.flight_id}
          airline={booking.airline}
          appearance={appearance}
        />
      </div>

      <div className="space-y-8 mb-12">
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
              {t('date')} : {booking.date ? booking.date.replace(' ', ' T') : '2026-08-20 T14:00:00'}
            </p>
          </div>

          <div className={`p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
              {t('from')} : {booking.from_city || 'New York'}
            </p>
          </div>

          <div className={`p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
              {t('to')} : {booking.to_city || 'Tokyo'}
            </p>
          </div>

          <div className={`p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
              {t('flight')} : {booking.airline || 'Japan Airlines'}
            </p>
          </div>
        </div>

        <div className={`flex justify-between items-center p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{t('guests')}</p>
            <p className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{booking.guests || '1 Adult'}</p>
          </div>
        </div>
      </div>

      {renderMoreInfo()}

      <div className="space-y-4">
        <button 
          onClick={handleDownloadPDF}
          className={`w-full bg-blue-600 text-white py-5 rounded-[24px] font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
        >
          <Download size={20} />
          {t('downloadTicketPDF')}
        </button>
        <button 
          onClick={handleCancelClick}
          className="w-full py-5 bg-red-500 text-white rounded-[24px] font-bold text-lg shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
        >
          <Trash2 size={20} />
          {t('cancelThisFlight')}
        </button>
      </div>
      {renderCancelModal()}
      {renderFlightModal()}
      {renderHotelModal()}
    </div>
  );

  const renderHotelDetails = () => (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="relative h-[45vh]">
        <img 
          src={booking.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
          alt={booking.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
        
        <div className="absolute top-8 left-4 right-4 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={toggleSaved}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
          >
            <Star size={20} fill={isSaved ? "white" : "none"} className={isSaved ? "text-white" : ""} />
          </button>
        </div>

        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2">
          {(booking.images || [booking.image]).slice(0, 3).map((img, i) => (
            <div key={i} className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-lg">
              <img src={img} alt="Gallery" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ))}
          {booking.images && booking.images.length > 3 && (
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs font-bold border-2 border-white">
              +{booking.images.length - 3}
            </div>
          )}
        </div>
      </div>

      <div className={`relative -mt-12 rounded-t-[48px] px-6 pt-10 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className={`text-3xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{booking.name || 'Water Hotel'}</h1>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-sm">{booking.location || 'Italy, Manarola'}</p>
          </div>
        </div>

        <div className={`flex items-center justify-between mb-8 p-4 rounded-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-700' : 'bg-white'}`}>
              <Calendar size={20} className={appearance === 'Dark Mode' ? 'text-slate-300' : 'text-slate-600'} />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('date')} : {booking.date || '10 May - 14 May'}</p>
            </div>
          </div>
        </div>

        {renderMoreInfo()}

        <div className="mb-8">
          <div className={`relative h-64 rounded-3xl overflow-hidden border transition-colors z-10 ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-slate-100'}`}>
            <MapContainer 
              center={[44.1068, 9.7289]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[44.1068, 9.7289]} />
              <ChangeView center={[44.1068, 9.7289]} />
            </MapContainer>
            <button className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors z-[1000] ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-white text-primary'}`}>
              <Plane size={16} className="rotate-45" />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('sleepingArrangements')}</h2>
          </div>
          <div className="flex gap-4">
            <div className={`flex-1 p-6 rounded-[32px] border transition-colors ${appearance === 'Dark Mode' ? 'border-red-500/50 bg-slate-800' : 'border-red-400 bg-white'}`}>
              <Hotel size={24} className="text-primary mb-4" />
              <p className={`text-sm font-bold mb-1 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('bedroom')} 1</p>
              <p className="text-xs text-slate-400">1 {t('kingBed')}</p>
            </div>
            <div className={`flex-1 p-6 rounded-[32px] border transition-colors ${appearance === 'Dark Mode' ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
              <Hotel size={24} className="text-primary mb-4" />
              <p className={`text-sm font-bold mb-1 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('bedroom')} 2</p>
              <p className="text-xs text-slate-400">1 {t('singleBed')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleDownloadPDF}
            className={`w-full py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
          >
            <Download size={20} className="text-primary" />
            {t('downloadTicketPDF')}
          </button>
          <button 
            onClick={handleCancelClick}
            className="w-full py-5 bg-red-500 text-white rounded-[24px] font-bold text-lg shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
          >
            <Trash2 size={20} />
            {t('cancelThisHotel')}
          </button>
        </div>
      </div>
      {renderCancelModal()}
      {renderFlightModal()}
      {renderHotelModal()}
    </div>
  );

  switch (booking.type) {
    case 'flight': return renderFlightDetails();
    case 'hotel': return renderHotelDetails();
    default: return renderPackageDetails();
  }
};
