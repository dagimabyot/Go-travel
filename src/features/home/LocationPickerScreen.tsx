import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Search, Compass, MapPin, Loader2, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerScreenProps {
  onBack: () => void;
  onSelect: (location: string) => void;
  appearance: string;
}

// Component to handle map center updates
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
    // Force a resize to ensure map tiles load correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [center, map]);
  return null;
}

// Component to handle map clicks
function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const LocationPickerScreen = ({ onBack, onSelect, appearance }: LocationPickerScreenProps) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(t('selectLocation'));
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Get user location on mount
  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          reverseGeocode(newPos[0], newPos[1]);
          setIsLoadingLocation(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'User-Agent': 'FlyBook-App' }
      });
      const data = await response.json();
      setSelectedAddress(data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } catch (e) {
      setSelectedAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/locations/search?q=${encodeURIComponent(searchQuery)}&lat=${position[0]}&lon=${position[1]}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (e) {
      console.error("Search failed:", e);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: any) => {
    const newPos: [number, number] = [parseFloat(result.lat), parseFloat(result.lon)];
    setPosition(newPos);
    setSelectedAddress(result.display_name);
    setSearchResults([]);
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <div className={`fixed inset-0 z-[210] flex flex-col transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className={`flex items-center justify-between px-6 pt-12 pb-6 shadow-sm z-20 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950 border-b border-slate-900' : 'bg-white'}`}>
        <button onClick={onBack} className={`w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Select Location</h1>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          className={`w-12 h-12 border rounded-full flex items-center justify-center transition-all shadow-sm ${showSearch ? 'bg-blue-600 border-blue-600 text-white' : (appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900')}`}
        >
          {showSearch ? <X size={20} /> : <Search size={20} />}
        </button>
      </header>

      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-[104px] left-0 right-0 z-30 px-6 pb-6 shadow-lg border-b transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'}`}
          >
            <form onSubmit={handleSearch} className="relative">
              <input 
                autoFocus
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-14 border rounded-2xl px-12 font-medium focus:outline-none focus:border-blue-600 transition-all ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400'}`}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 animate-spin" size={20} />}
            </form>

            <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
              {searchResults.map((result, idx) => (
                <button 
                  key={idx}
                  onClick={() => selectSearchResult(result)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left ${appearance === 'Dark Mode' ? 'hover:bg-slate-900' : 'hover:bg-slate-50'}`}
                >
                  <MapPin className="text-blue-600 shrink-0 mt-1" size={18} />
                  <div>
                    <p className={`font-bold text-sm line-clamp-1 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{result.display_name.split(',')[0]}</p>
                    <p className="text-xs text-slate-400 line-clamp-1">{result.display_name}</p>
                  </div>
                </button>
              ))}
              {searchQuery && searchResults.length === 0 && !isSearching && (
                <p className="text-center text-slate-400 py-4 text-sm">{t('noResultsFound')}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex-1 relative z-10 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <MapContainer 
          center={position} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={position} />
          <MapEvents onLocationSelect={(lat, lng) => {
            setPosition([lat, lng]);
            reverseGeocode(lat, lng);
          }} />
          <Marker position={position} />
        </MapContainer>
        
        {/* Floating Action Button - Current Location */}
        <button 
          onClick={handleGetCurrentLocation}
          disabled={isLoadingLocation}
          className={`absolute bottom-32 right-6 w-14 h-14 rounded-full flex items-center justify-center text-blue-600 shadow-xl border active:scale-90 transition-all z-[1000] ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
        >
          {isLoadingLocation ? <Loader2 className="animate-spin" size={28} /> : <Compass size={28} />}
        </button>
      </div>

      {/* Select Button */}
      <div className={`p-8 border-t z-20 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'}`}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-blue-600 shrink-0 ${appearance === 'Dark Mode' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <MapPin size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('selectedLocation')}</p>
            <p className={`text-sm font-bold truncate ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{selectedAddress}</p>
          </div>
        </div>
        <button 
          onClick={() => onSelect(selectedAddress)}
          className={`w-full py-5 bg-blue-700 text-white rounded-[24px] font-bold text-xl shadow-xl active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'shadow-blue-900/40' : 'shadow-blue-200'}`}
        >
          {t('selectLocation')}
        </button>
      </div>
    </div>
  );
};
