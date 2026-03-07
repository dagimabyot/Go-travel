import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Info, X, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

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

interface FlightMapProps {
  origin: { lat: number; lng: number; name: string; code: string };
  destination: { lat: number; lng: number; name: string; code: string };
  layovers?: { lat: number; lng: number; name: string; code: string }[];
  estimatedArrival: string;
  flightNumber?: string;
  airline?: string;
  appearance?: string;
}

function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [bounds, map]);
  return null;
}

export const FlightMap = ({ 
  origin, 
  destination, 
  layovers = [], 
  estimatedArrival,
  flightNumber = 'AK-407',
  airline = 'Alaska Airlines',
  appearance = 'Light Mode'
}: FlightMapProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const allPoints: [number, number][] = [
    [origin.lat, origin.lng],
    ...layovers.map(l => [l.lat, l.lng] as [number, number]),
    [destination.lat, destination.lng]
  ];

  const bounds = L.latLngBounds(allPoints);

  return (
    <div className="relative w-full h-[400px] bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 z-10">
      <MapContainer 
        bounds={bounds}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline 
          positions={allPoints} 
          color="#3b82f6" 
          weight={4} 
          dashArray="10, 10"
          eventHandlers={{
            click: () => setShowDetails(true)
          }}
        />
        <Marker position={[origin.lat, origin.lng]} />
        <Marker position={[destination.lat, destination.lng]} />
        {layovers.map((l, i) => (
          <Marker key={i} position={[l.lat, l.lng]} />
        ))}
        <ChangeView bounds={bounds} />
      </MapContainer>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute top-4 left-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-2xl z-[1000]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Plane size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{flightNumber}</h4>
                  <p className="text-xs text-slate-500">{airline}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrival</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{estimatedArrival}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Info size={14} className="text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                  <p className="text-xs font-bold text-emerald-500">On Time</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/20 z-[1000]">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Arrival</p>
          <p className="text-sm font-bold dark:text-white">{estimatedArrival}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
          <p className="text-sm font-bold text-emerald-500">On Time</p>
        </div>
      </div>
    </div>
  );
};
