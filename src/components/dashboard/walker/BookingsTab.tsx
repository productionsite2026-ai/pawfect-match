import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, CheckCircle, Clock, XCircle, MapPin, 
  Dog, MessageCircle, Eye, AlertTriangle, Camera
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { SOSButton } from "@/components/dashboard/shared/SOSButton";
import { CancelBookingDialog } from "@/components/booking/CancelBookingDialog";
import { ReportIncidentDialog } from "@/components/booking/ReportIncidentDialog";
import MissionStartButton from "./MissionStartButton";

const WalkerBookingsTab = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [cancelBooking, setCancelBooking] = useState<any>(null);
  const [incidentBooking, setIncidentBooking] = useState<any>(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { data } = await supabase
      .from('bookings')
      .select('*, dogs(name, breed, photo_url)')
      .eq('walker_id', session.user.id)
      .order('scheduled_date', { ascending: false });
    
    setBookings(data || []);
    setLoading(false);
  };

  const filtered = bookings.filter(b => {
    if (filter === "pending") return b.status === 'pending';
    if (filter === "confirmed") return b.status === 'confirmed';
    if (filter === "in_progress") return b.status === 'in_progress';
    if (filter === "completed") return b.status === 'completed';
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

  const handleAction = async (bookingId: string, action: 'confirm' | 'reject') => {
    const status = action === 'confirm' ? 'confirmed' : 'cancelled';
    await supabase
      .from('bookings')
      .update({ status, walker_confirmed: action === 'confirm' })
      .eq('id', bookingId);
    fetchBookings();
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
          Mes Missions
        </h2>
        
        {/* Stats summary */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
            <Clock className="h-4 w-4" />
            {bookings.filter(b => b.status === 'pending').length} en attente
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full">
            <CheckCircle className="h-4 w-4" />
            {bookings.filter(b => b.status === 'confirmed').length} confirmées
          </div>
        </div>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="pending" className="gap-1">
            <Clock className="h-3 w-3" />
            <span className="hidden sm:inline">Attente</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
              {bookings.filter(b => b.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
          <TabsTrigger value="in_progress">En cours</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">Aucune mission</p>
            <p className="text-muted-foreground text-sm">
              {filter === 'pending' && "Aucune demande de réservation en attente"}
              {filter === 'confirmed' && "Aucune mission confirmée"}
              {filter === 'in_progress' && "Aucune mission en cours"}
              {filter === 'completed' && "Aucune mission terminée"}
            </p>
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
                            {booking.dogs?.breed || "Race non spécifiée"}
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
                        <p className="font-bold text-lg text-green-600">
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
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleAction(booking.id, 'confirm')}
                            className="gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Accepter
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAction(booking.id, 'reject')}
                            className="gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Refuser
                          </Button>
                        </>
                      )}

                      {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                        <MissionStartButton
                          bookingId={booking.id}
                          walkerId={booking.walker_id || ''}
                          dogName={booking.dogs?.name || 'Chien'}
                          ownerName="Propriétaire"
                          status={booking.status as 'confirmed' | 'in_progress'}
                          onMissionStarted={fetchBookings}
                          onMissionEnded={fetchBookings}
                        />
                      )}

                      {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/messages`, { state: { selectedWalkerId: booking.owner_id }})}
                            className="gap-1"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Message
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setIncidentBooking(booking)}
                            className="gap-1 text-amber-600 hover:text-amber-700"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            Incident
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setCancelBooking(booking)}
                            className="gap-1 text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4" />
                            Annuler
                          </Button>
                          <SOSButton 
                            bookingId={booking.id}
                            ownerId={booking.owner_id}
                            dogName={booking.dogs?.name}
                            className="ml-auto"
                          />
                        </>
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

      {/* Incident Dialog */}
      {incidentBooking && (
        <ReportIncidentDialog
          open={!!incidentBooking}
          onOpenChange={(open) => !open && setIncidentBooking(null)}
          bookingId={incidentBooking.id}
          dogName={incidentBooking.dogs?.name}
          onSuccess={fetchBookings}
        />
      )}
    </motion.div>
  );
};

export default WalkerBookingsTab;