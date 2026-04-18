import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, CheckCircle, Clock, XCircle, MapPin, 
  Dog, MessageCircle, Eye, Download, ExternalLink, Star
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendarExport } from "@/hooks/useCalendarExport";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReviewDialog } from "@/components/booking/ReviewDialog";
import { CancelBookingDialog } from "@/components/booking/CancelBookingDialog";

const BookingsTab = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const [reviewBooking, setReviewBooking] = useState<any>(null);
  const [cancelBooking, setCancelBooking] = useState<any>(null);
  const { exportBooking, exportBookings, openGoogleCalendar } = useCalendarExport();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { data } = await supabase
      .from('bookings')
      .select('*, dogs(name, breed, photo_url)')
      .eq('owner_id', session.user.id)
      .order('scheduled_date', { ascending: false });
    
    setBookings(data || []);
    setLoading(false);
  };

  const filtered = bookings.filter(b => {
    const now = new Date();
    const date = new Date(b.scheduled_date);
    if (filter === "upcoming") return date >= now && b.status !== 'cancelled';
    if (filter === "past") return date < now || b.status === 'completed';
    if (filter === "cancelled") return b.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any; icon: any }> = {
      pending: { label: 'En attente', variant: 'secondary', icon: Clock },
      confirmed: { label: 'Confirmée', variant: 'default', icon: CheckCircle },
      in_progress: { label: 'En cours', variant: 'outline', icon: MapPin },
      completed: { label: 'Terminée', variant: 'default', icon: CheckCircle },
      cancelled: { label: 'Annulée', variant: 'destructive', icon: XCircle }
    };
    const { label, variant, icon: Icon } = statusMap[status] || statusMap.pending;
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
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

  const handleExportBooking = (booking: any) => {
    exportBooking({
      id: booking.id,
      scheduled_date: booking.scheduled_date,
      scheduled_time: booking.scheduled_time,
      duration_minutes: booking.duration_minutes || 60,
      service_type: booking.service_type,
      dog_name: booking.dogs?.name,
      address: booking.address,
      city: booking.city
    });
  };

  const handleExportAll = () => {
    const upcomingBookings = bookings
      .filter(b => new Date(b.scheduled_date) >= new Date() && b.status !== 'cancelled')
      .map(b => ({
        id: b.id,
        scheduled_date: b.scheduled_date,
        scheduled_time: b.scheduled_time,
        duration_minutes: b.duration_minutes || 60,
        service_type: b.service_type,
        dog_name: b.dogs?.name,
        address: b.address,
        city: b.city
      }));
    exportBookings(upcomingBookings);
  };

  const handleOpenGoogleCalendar = (booking: any) => {
    openGoogleCalendar({
      id: booking.id,
      scheduled_date: booking.scheduled_date,
      scheduled_time: booking.scheduled_time,
      duration_minutes: booking.duration_minutes || 60,
      service_type: booking.service_type,
      dog_name: booking.dogs?.name,
      address: booking.address,
      city: booking.city
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <motion.div 
          className="rounded-full h-10 w-10 border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Mes Réservations
        </h2>
        
        {/* Export button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportAll}
          className="gap-2"
          disabled={bookings.filter(b => new Date(b.scheduled_date) >= new Date() && b.status !== 'cancelled').length === 0}
        >
          <Download className="h-4 w-4" />
          Exporter calendrier
        </Button>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="upcoming" className="gap-1">
            À venir
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
              {bookings.filter(b => new Date(b.scheduled_date) >= new Date() && b.status !== 'cancelled').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="past">Passées</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">Aucune réservation</p>
            <p className="text-muted-foreground text-sm mb-4">
              {filter === 'upcoming' && "Vous n'avez pas de réservation à venir"}
              {filter === 'past' && "Aucune réservation passée"}
              {filter === 'cancelled' && "Aucune réservation annulée"}
            </p>
            {filter === 'upcoming' && (
              <Button onClick={() => navigate('/walkers')} className="gap-2">
                Réserver une promenade
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Main content */}
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      {/* Dog info */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {booking.dogs?.photo_url ? (
                            <img 
                              src={booking.dogs.photo_url} 
                              alt={booking.dogs?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Dog className="h-7 w-7 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-lg">{booking.dogs?.name || "Chien"}</p>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {booking.service_type === 'promenade' && "Promenade"}
                            {booking.service_type === 'garde' && "Garde"}
                            {booking.service_type === 'visite' && "Visite"}
                            {booking.service_type === 'veterinaire' && "Vétérinaire"}
                          </p>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex flex-col items-start sm:items-end gap-1">
                        <p className="font-semibold text-lg">
                          {formatDate(booking.scheduled_date)}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {booking.scheduled_time} • {booking.duration_minutes || 60} min
                        </p>
                        <p className="font-bold text-lg text-primary">
                          {Number(booking.price || 0).toFixed(2)}€
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    {booking.city && (
                      <div className="px-4 pb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {booking.address ? `${booking.address}, ` : ""}{booking.city}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 p-3 bg-muted/30 border-t flex-wrap">
                      {booking.walker_id && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/messages`, { state: { selectedWalkerId: booking.walker_id }})}
                          className="gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Message
                        </Button>
                      )}

                      {/* Review button for completed bookings */}
                      {booking.status === 'completed' && booking.walker_id && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setReviewBooking(booking)}
                          className="gap-1"
                        >
                          <Star className="h-4 w-4" />
                          Avis
                        </Button>
                      )}

                      {/* Cancel button for upcoming bookings */}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && 
                       new Date(booking.scheduled_date) >= new Date() && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setCancelBooking(booking)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <XCircle className="h-4 w-4" />
                          Annuler
                        </Button>
                      )}

                      {/* Calendar dropdown */}
                      {booking.status !== 'cancelled' && new Date(booking.scheduled_date) >= new Date() && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Calendar className="h-4 w-4" />
                              Calendrier
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleExportBooking(booking)}>
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger .ics
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenGoogleCalendar(booking)}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Google Calendar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                        className="gap-1 ml-auto"
                      >
                        <Eye className="h-4 w-4" />
                        Détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Review Dialog */}
      {reviewBooking && (
        <ReviewDialog
          open={!!reviewBooking}
          onOpenChange={(open) => !open && setReviewBooking(null)}
          bookingId={reviewBooking.id}
          reviewedId={reviewBooking.walker_id}
          dogName={reviewBooking.dogs?.name}
          onSuccess={fetchBookings}
        />
      )}

      {/* Cancel Dialog */}
      {cancelBooking && (
        <CancelBookingDialog
          open={!!cancelBooking}
          onOpenChange={(open) => !open && setCancelBooking(null)}
          bookingId={cancelBooking.id}
          dogName={cancelBooking.dogs?.name}
          scheduledDate={cancelBooking.scheduled_date}
          onSuccess={fetchBookings}
        />
      )}
    </motion.div>
  );
};

export default BookingsTab;