import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, ChevronRight, Dog } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  service_type: string;
  status: string;
  duration_minutes: number;
  city: string | null;
  dog_name: string;
  dog_photo: string | null;
  walker_name: string;
  walker_photo: string | null;
}

interface UpcomingBookingsWidgetProps {
  limit?: number;
  onViewAll?: () => void;
}

const UpcomingBookingsWidget = ({ limit = 3, onViewAll }: UpcomingBookingsWidgetProps) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from('bookings')
      .select('id, scheduled_date, scheduled_time, service_type, status, duration_minutes, city, dog_id, walker_id, dogs(name, photo_url)')
      .eq('owner_id', session.user.id)
      .gte('scheduled_date', today)
      .in('status', ['confirmed', 'pending'])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })
      .limit(limit);

    if (data && data.length > 0) {
      // Fetch walker profiles
      const walkerIds = [...new Set(data.filter(b => b.walker_id).map(b => b.walker_id))];
      
      let walkerMap = new Map();
      if (walkerIds.length > 0) {
        const { data: walkers } = await supabase
          .from('profiles')
          .select('id, first_name, avatar_url')
          .in('id', walkerIds);
        walkerMap = new Map(walkers?.map(w => [w.id, w]) || []);
      }

      setBookings(data.map(b => ({
        id: b.id,
        scheduled_date: b.scheduled_date,
        scheduled_time: b.scheduled_time,
        service_type: b.service_type,
        status: b.status,
        duration_minutes: b.duration_minutes || 60,
        city: b.city,
        dog_name: (b.dogs as any)?.name || 'Animal',
        dog_photo: (b.dogs as any)?.photo_url || null,
        walker_name: walkerMap.get(b.walker_id)?.first_name || 'En attente',
        walker_photo: walkerMap.get(b.walker_id)?.avatar_url || null
      })));
    }

    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === now.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === tomorrow.toDateString()) return "Demain";
    
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getServiceLabel = (type: string) => {
    const labels: Record<string, string> = {
      promenade: "Promenade",
      garde: "Garde",
      visite: "Visite",
      veterinaire: "Vétérinaire"
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="py-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-muted rounded mb-2" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Prochaines Réservations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Dog className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm">Aucune réservation à venir</p>
          <Button 
            variant="link" 
            onClick={() => navigate('/walkers')}
            className="mt-2"
          >
            Réserver un Accompagnement
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Prochaines Réservations
          </CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1">
              Voir tout
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/bookings/${booking.id}`)}
          >
            {/* Walker avatar */}
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={booking.walker_photo || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {booking.walker_name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate">{booking.walker_name}</span>
                <Badge 
                  variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{getServiceLabel(booking.service_type)}</span>
                <span>•</span>
                <span>{booking.dog_name}</span>
              </div>
            </div>

            {/* Date/Time */}
            <div className="text-right shrink-0">
              <p className="font-semibold text-sm">{formatDate(booking.scheduled_date)}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                <Clock className="h-3 w-3" />
                {booking.scheduled_time?.slice(0, 5)}
              </p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingBookingsWidget;
