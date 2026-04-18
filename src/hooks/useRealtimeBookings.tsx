import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type BookingStatus = Database['public']['Enums']['booking_status'];
type BookingRow = Database['public']['Tables']['bookings']['Row'];

type DogSummary = {
  name: string;
  breed: string | null;
  photo_url: string | null;
};

type ProfileSummary = {
  first_name: string | null;
  avatar_url: string | null;
  city: string | null;
};

type OwnerSummary = ProfileSummary & { phone: string | null };

type BookingWithRelations = BookingRow & {
  dogs?: DogSummary | null;
  owner?: OwnerSummary | null;
  walker?: ProfileSummary | null;
};

interface UseRealtimeBookingsProps {
  userId?: string;
  role?: 'owner' | 'walker';
  status?: BookingStatus[];
}

export const useRealtimeBookings = ({ userId, role = 'owner', status }: UseRealtimeBookingsProps) => {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!userId) return;

    let query = supabase
      .from('bookings')
      .select('*, dogs(name, breed, photo_url)')
      .order('scheduled_date', { ascending: true });

    if (role === 'owner') {
      query = query.eq('owner_id', userId);
    } else {
      query = query.eq('walker_id', userId);
    }

    if (status && status.length > 0) {
      query = query.in('status', status);
    }

    const { data, error } = await query;

    if (!error && data) {
      const walkerIds = [...new Set(data.map(b => b.walker_id).filter(Boolean))] as string[];
      const ownerIds = [...new Set(data.map(b => b.owner_id))];

      const [walkersResult, ownersResult] = await Promise.all([
        walkerIds.length > 0 
          ? supabase.from('profiles').select('id, first_name, avatar_url, city').in('id', walkerIds)
          : { data: [] },
        ownerIds.length > 0
          ? supabase.from('profiles').select('id, first_name, avatar_url, city, phone').in('id', ownerIds)
          : { data: [] }
      ]);

      const walkerMap = new Map<string, ProfileSummary>(
        (walkersResult.data || []).map((w: any) => [w.id as string, w] as [string, ProfileSummary])
      );
      const ownerMap = new Map<string, OwnerSummary>(
        (ownersResult.data || []).map((o: any) => [o.id as string, o] as [string, OwnerSummary])
      );

      const enrichedBookings: BookingWithRelations[] = (data as any[]).map((b: any) => ({
        ...(b as BookingRow),
        dogs: b.dogs ?? null,
        walker: b.walker_id ? walkerMap.get(b.walker_id) || null : null,
        owner: ownerMap.get(b.owner_id) || null,
      }));

      setBookings(enrichedBookings);
    }
    setLoading(false);
  }, [userId, role, status]);

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel('realtime-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          const { eventType, new: newRecord } = payload;

          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            fetchBookings(); // Refresh to get enriched data
          } else if (eventType === 'DELETE') {
            const deletedId = (payload.old as any).id;
            setBookings(prev => prev.filter(b => b.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings]);

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return false;
    }
    return true;
  };

  const getUpcoming = () => {
    const excluded: BookingStatus[] = ['cancelled', 'completed'];
    return bookings.filter(
      b => new Date(b.scheduled_date) >= new Date() && !excluded.includes(b.status || 'pending')
    );
  };

  const getPending = () => bookings.filter(b => b.status === 'pending');
  const getCompleted = () => bookings.filter(b => b.status === 'completed');

  return { bookings, loading, updateBookingStatus, getUpcoming, getPending, getCompleted, refresh: fetchBookings };
};
