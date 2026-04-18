import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Wifi, WifiOff, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWatchWalkerPosition } from "@/hooks/useGPSTracking";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LiveTrackingMapProps {
  bookingId: string | null;
  dogName: string;
  walkerName: string;
}

const LiveTrackingMap = ({ bookingId, dogName, walkerName }: LiveTrackingMapProps) => {
  const { walkerPosition, trail, connected } = useWatchWalkerPosition(bookingId);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const trailLineRef = useRef<L.Polyline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([48.8566, 2.3522], 15); // Paris default

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update marker position
  useEffect(() => {
    if (!mapRef.current || !walkerPosition) return;

    const latlng: L.LatLngExpression = [walkerPosition.lat, walkerPosition.lng];

    if (!markerRef.current) {
      // Create custom paw icon
      const pawIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,hsl(160,84%,39%),hsl(180,60%,35%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.3);border:3px solid white;font-size:18px;">🐾</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      markerRef.current = L.marker(latlng, { icon: pawIcon }).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng(latlng);
    }

    mapRef.current.panTo(latlng, { animate: true });
  }, [walkerPosition]);

  // Update trail
  useEffect(() => {
    if (!mapRef.current || trail.length < 2) return;

    const latlngs: L.LatLngExpression[] = trail.map((p) => [p.lat, p.lng]);

    if (trailLineRef.current) {
      trailLineRef.current.setLatLngs(latlngs);
    } else {
      trailLineRef.current = L.polyline(latlngs, {
        color: "hsl(160, 84%, 39%)",
        weight: 4,
        opacity: 0.7,
        dashArray: "8, 12",
      }).addTo(mapRef.current);
    }
  }, [trail]);

  // Handle resize when expanded
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current?.invalidateSize(), 300);
    }
  }, [expanded]);

  const distance = trail.length > 1
    ? (trail.reduce((acc, p, i) => {
        if (i === 0) return 0;
        const prev = trail[i - 1];
        const R = 6371e3;
        const dLat = ((p.lat - prev.lat) * Math.PI) / 180;
        const dLng = ((p.lng - prev.lng) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos((prev.lat * Math.PI) / 180) * Math.cos((p.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
        return acc + 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      }, 0) / 1000).toFixed(2)
    : "0.00";

  if (!bookingId) {
    return (
      <div className="bg-card rounded-2xl shadow-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground text-sm">Tracking en temps réel</h3>
        </div>
        <div className="text-center py-8">
          <Navigation className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucune promenade en cours</p>
          <p className="text-xs text-muted-foreground mt-1">La carte apparaîtra pendant les missions actives</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={`bg-card rounded-2xl shadow-card overflow-hidden ${expanded ? "fixed inset-4 z-50" : ""}`}
    >
      {/* Header */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground text-sm">Tracking en direct</h3>
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${connected ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
            {connected ? <><Wifi className="w-3 h-3" /> Connecté</> : <><WifiOff className="w-3 h-3" /> Déconnecté</>}
          </span>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
          <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Map */}
      <div ref={containerRef} className={`w-full ${expanded ? "h-[calc(100%-8rem)]" : "h-48"} bg-muted`} />

      {/* Stats */}
      <div className="p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-foreground">🐕 {dogName}</span>
          <span className="text-muted-foreground">avec {walkerName}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>📍 {distance} km</span>
          {walkerPosition?.speed && walkerPosition.speed > 0 && (
            <span>🏃 {(walkerPosition.speed * 3.6).toFixed(1)} km/h</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LiveTrackingMap;
