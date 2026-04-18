import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface GPSPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  speed: number | null;
}

interface UseGPSTrackingOptions {
  bookingId: string | null;
  enabled: boolean;
}

export const useGPSTracking = ({ bookingId, enabled }: UseGPSTrackingOptions) => {
  const { user } = useAuth();
  const watchIdRef = useRef<number | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [currentPosition, setCurrentPosition] = useState<GPSPosition | null>(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const positionsRef = useRef<GPSPosition[]>([]);

  const startTracking = useCallback(() => {
    if (!bookingId || !user || !navigator.geolocation) {
      setError("Géolocalisation non disponible");
      return;
    }

    const channel = supabase.channel(`gps-tracking-${bookingId}`);
    channel.subscribe();
    channelRef.current = channel;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const pos: GPSPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          speed: position.coords.speed,
        };
        setCurrentPosition(pos);
        positionsRef.current.push(pos);
        setError(null);

        channel.send({
          type: "broadcast",
          event: "position",
          payload: {
            walkerId: user.id,
            bookingId,
            position: pos,
          },
        });
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    setTracking(true);
  }, [bookingId, user]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setTracking(false);
  }, []);

  // Save GPS trail to booking notes as JSON when stopping
  const saveTrailToBooking = useCallback(async () => {
    if (!bookingId || positionsRef.current.length === 0) return;

    // Sample positions to max 200 points to keep payload reasonable
    const positions = positionsRef.current;
    let sampled = positions;
    if (positions.length > 200) {
      const step = Math.ceil(positions.length / 200);
      sampled = positions.filter((_, i) => i % step === 0);
      // Always include last position
      if (sampled[sampled.length - 1] !== positions[positions.length - 1]) {
        sampled.push(positions[positions.length - 1]);
      }
    }

    // Calculate total distance
    const totalDistance = sampled.reduce((acc, p, i) => {
      if (i === 0) return 0;
      const prev = sampled[i - 1];
      const R = 6371e3;
      const dLat = ((p.lat - prev.lat) * Math.PI) / 180;
      const dLng = ((p.lng - prev.lng) * Math.PI) / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos((prev.lat * Math.PI) / 180) * Math.cos((p.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
      return acc + 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }, 0);

    const gpsData = {
      trail: sampled,
      distance_meters: Math.round(totalDistance),
      point_count: sampled.length,
      start_time: sampled[0]?.timestamp,
      end_time: sampled[sampled.length - 1]?.timestamp,
    };

    // Get existing notes and append GPS data
    const { data: booking } = await supabase
      .from("bookings")
      .select("notes")
      .eq("id", bookingId)
      .single();

    const existingNotes = booking?.notes || "";
    const gpsTag = `\n[GPS_DATA]${JSON.stringify(gpsData)}[/GPS_DATA]`;
    
    await supabase
      .from("bookings")
      .update({ notes: existingNotes + gpsTag })
      .eq("id", bookingId);
  }, [bookingId]);

  useEffect(() => {
    if (enabled && bookingId) {
      startTracking();
    } else {
      if (tracking && positionsRef.current.length > 0) {
        saveTrailToBooking();
      }
      stopTracking();
    }
    return () => stopTracking();
  }, [enabled, bookingId, startTracking, stopTracking]);

  return {
    currentPosition,
    tracking,
    error,
    positions: positionsRef.current,
    startTracking,
    stopTracking,
    saveTrailToBooking,
  };
};

// Parse GPS data from booking notes
export const parseGPSDataFromNotes = (notes: string | null): GPSPosition[] | null => {
  if (!notes) return null;
  const match = notes.match(/\[GPS_DATA\](.*?)\[\/GPS_DATA\]/);
  if (!match) return null;
  try {
    const data = JSON.parse(match[1]);
    return data.trail as GPSPosition[];
  } catch {
    return null;
  }
};

export const parseGPSMetaFromNotes = (notes: string | null) => {
  if (!notes) return null;
  const match = notes.match(/\[GPS_DATA\](.*?)\[\/GPS_DATA\]/);
  if (!match) return null;
  try {
    const data = JSON.parse(match[1]);
    return {
      distance_meters: data.distance_meters as number,
      point_count: data.point_count as number,
      start_time: data.start_time as number,
      end_time: data.end_time as number,
    };
  } catch {
    return null;
  }
};

// Clean notes by removing GPS data tag
export const cleanNotesFromGPS = (notes: string | null): string => {
  if (!notes) return "";
  return notes.replace(/\n?\[GPS_DATA\].*?\[\/GPS_DATA\]/s, "").trim();
};

// Hook for owner to watch walker's GPS position
export const useWatchWalkerPosition = (bookingId: string | null) => {
  const [walkerPosition, setWalkerPosition] = useState<GPSPosition | null>(null);
  const [trail, setTrail] = useState<GPSPosition[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    const channel = supabase
      .channel(`gps-tracking-${bookingId}`)
      .on("broadcast", { event: "position" }, (payload) => {
        const pos = payload.payload.position as GPSPosition;
        setWalkerPosition(pos);
        setTrail((prev) => [...prev, pos]);
      })
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
      setConnected(false);
    };
  }, [bookingId]);

  return { walkerPosition, trail, connected };
};
