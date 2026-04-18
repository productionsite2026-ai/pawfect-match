import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Play, Pause, RotateCcw, Clock, Route } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface GPSPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  speed: number | null;
}

interface WalkReplayMapProps {
  positions: GPSPosition[];
  dogName: string;
  walkerName: string;
  duration: number; // seconds
  date: string;
}

const WalkReplayMap = ({ positions, dogName, walkerName, duration, date }: WalkReplayMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const trailLineRef = useRef<L.Polyline | null>(null);
  const replayLineRef = useRef<L.Polyline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate total distance
  const totalDistance = positions.length > 1
    ? positions.reduce((acc, p, i) => {
        if (i === 0) return 0;
        const prev = positions[i - 1];
        const R = 6371e3;
        const dLat = ((p.lat - prev.lat) * Math.PI) / 180;
        const dLng = ((p.lng - prev.lng) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos((prev.lat * Math.PI) / 180) * Math.cos((p.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
        return acc + 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      }, 0) / 1000
    : 0;

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${m} min`;
  };

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current || positions.length === 0) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([positions[0].lat, positions[0].lng], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

    // Draw full trail (faded)
    const fullLatlngs: L.LatLngExpression[] = positions.map(p => [p.lat, p.lng]);
    L.polyline(fullLatlngs, { color: "hsl(160, 84%, 39%)", weight: 3, opacity: 0.2 }).addTo(map);

    // Start/End markers
    const startIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="width:28px;height:28px;border-radius:50%;background:hsl(160,84%,39%);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;font-size:12px;">🏁</div>`,
      iconSize: [28, 28], iconAnchor: [14, 14],
    });
    const endIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="width:28px;height:28px;border-radius:50%;background:hsl(0,84%,60%);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;font-size:12px;">🏠</div>`,
      iconSize: [28, 28], iconAnchor: [14, 14],
    });

    L.marker([positions[0].lat, positions[0].lng], { icon: startIcon }).addTo(map);
    if (positions.length > 1) {
      L.marker([positions[positions.length - 1].lat, positions[positions.length - 1].lng], { icon: endIcon }).addTo(map);
    }

    // Fit bounds
    map.fitBounds(L.latLngBounds(fullLatlngs), { padding: [30, 30] });

    // Replay marker
    const pawIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(160,84%,39%),hsl(180,60%,35%));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.3);border:3px solid white;font-size:16px;">🐾</div>`,
      iconSize: [36, 36], iconAnchor: [18, 18],
    });
    markerRef.current = L.marker([positions[0].lat, positions[0].lng], { icon: pawIcon }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [positions]);

  // Replay animation
  useEffect(() => {
    if (playing && positions.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIdx(prev => {
          if (prev >= positions.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 100); // Fast replay
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, positions.length]);

  // Update marker on replay
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || positions.length === 0) return;
    const pos = positions[currentIdx];
    if (!pos) return;
    
    markerRef.current.setLatLng([pos.lat, pos.lng]);
    
    // Draw replay trail
    const replayLatlngs: L.LatLngExpression[] = positions.slice(0, currentIdx + 1).map(p => [p.lat, p.lng]);
    if (replayLineRef.current) {
      replayLineRef.current.setLatLngs(replayLatlngs);
    } else {
      replayLineRef.current = L.polyline(replayLatlngs, {
        color: "hsl(160, 84%, 39%)", weight: 4, opacity: 0.8,
      }).addTo(mapRef.current);
    }
  }, [currentIdx, positions]);

  const handleReset = () => {
    setPlaying(false);
    setCurrentIdx(0);
    if (replayLineRef.current && mapRef.current) {
      mapRef.current.removeLayer(replayLineRef.current);
      replayLineRef.current = null;
    }
  };

  if (positions.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-card p-4 text-center">
        <Route className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Aucune donnée GPS pour cette promenade</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground text-sm">Replay trajet</h3>
        </div>
        <span className="text-[10px] text-muted-foreground font-semibold">{date}</span>
      </div>

      {/* Map */}
      <div ref={containerRef} className="w-full h-48 bg-muted" />

      {/* Controls */}
      <div className="p-3 space-y-2">
        {/* Progress bar */}
        <div className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: `${(currentIdx / Math.max(positions.length - 1, 1)) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg"
              onClick={() => setPlaying(!playing)}>
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold">
            <span>🐕 {dogName}</span>
            <span>📍 {totalDistance.toFixed(2)} km</span>
            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {formatDuration(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkReplayMap;
