import { useEffect, useState } from 'react';
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Dog, MapPin, Euro, AlertTriangle, Scale } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { motion } from "framer-motion";
import { WalkProofUpload } from "@/components/booking/WalkProofUpload";
import { ReportIncidentDialog } from "@/components/booking/ReportIncidentDialog";
import { OpenDisputeDialog } from "@/components/booking/OpenDisputeDialog";
import { MissionProofViewer } from "@/components/dashboard/owner/MissionProofViewer";
import { MissionReport } from "@/components/dashboard/owner/MissionReport";
import MissionStartButton from "@/components/dashboard/walker/MissionStartButton";
import { ValidationCodeCard } from "@/components/booking/ValidationCodeCard";
import { ValidateCodeInput } from "@/components/booking/ValidateCodeInput";
import { SOSReleaseDialog } from "@/components/booking/SOSReleaseDialog";
import { BookingContactCard } from "@/components/booking/BookingContactCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [walkProofs, setWalkProofs] = useState<any[]>([]);
  const [showIncidentDialog, setShowIncidentDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    
    setCurrentUserId(session.user.id);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          dogs (name, breed, age, weight)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch walker info (sans téléphone — passe par RPC sécurisée get_booking_contact)
      const { data: walker, error: walkerError } = await supabase
        .from('profiles')
        .select('first_name, city')
        .eq('id', data.walker_id)
        .single();

      if (walkerError) throw walkerError;

      setBooking({ ...data, walker });
      
      // Fetch walk proofs
      fetchWalkProofs();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchWalkProofs = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('walk_proofs')
        .select('*')
        .eq('booking_id', id)
        .order('uploaded_at', { ascending: false });
      
      if (!error && data) {
        setWalkProofs(data);
      }
    } catch (e) {
      // Table may not exist yet, ignore
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      pending: { label: 'En attente', variant: 'secondary' },
      confirmed: { label: 'Confirmée', variant: 'default' },
      completed: { label: 'Terminée', variant: 'outline' },
      cancelled: { label: 'Annulée', variant: 'destructive' },
    };
    const { label, variant } = statusMap[status] || statusMap.pending;
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <motion.div 
            className="flex items-center justify-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="rounded-full h-8 w-8 border-b-2 border-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="Réservation introuvable | DogWalking"
          description="Cette réservation n'existe pas ou a été supprimée."
          noindex
        />
        <Header />
        <main className="container mx-auto px-4 py-24">
          <motion.h1 
            className="text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Réservation introuvable
          </motion.h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Réservation #${id?.slice(0, 8)} | DogWalking`}
        description="Détails de votre réservation : chien, promeneur, date, heure et prix."
        noindex
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <motion.div 
          className="mb-8 flex justify-between items-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Détails de la réservation</h1>
            <p className="text-muted-foreground">Réservation #{booking.id.slice(0, 8)}</p>
          </div>
          {getStatusBadge(booking.status)}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div variants={itemVariants}>
              <Card className="shadow-card h-full">
                <CardHeader>
                  <CardTitle>Informations de la promenade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{new Date(booking.booking_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Heure et durée</p>
                      <p className="font-semibold">{booking.start_time} - {booking.duration_minutes} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Euro className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prix</p>
                      <p className="font-semibold text-lg text-primary">{Number(booking.total_price).toFixed(2)}€</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-card h-full">
                <CardHeader>
                  <CardTitle>Informations du chien</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Dog className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nom</p>
                      <p className="font-semibold">{booking.dogs?.name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Race</p>
                    <p className="font-semibold">{booking.dogs?.breed}</p>
                  </div>
                  {booking.dogs?.age && (
                    <div>
                      <p className="text-sm text-muted-foreground">Âge</p>
                      <p className="font-semibold">{booking.dogs.age} ans</p>
                    </div>
                  )}
                  {booking.dogs?.weight && (
                    <div>
                      <p className="text-sm text-muted-foreground">Poids</p>
                      <p className="font-semibold">{booking.dogs.weight} kg</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Accompagnateur Certifié</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-semibold text-lg">{booking.walker?.first_name}</p>
                </div>
                {booking.walker?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.walker.city}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact masqué hors fenêtre de mission (CDC §9 anonymisation) */}
          <motion.div variants={itemVariants} className="mt-6">
            <BookingContactCard bookingId={booking.id} />
          </motion.div>

          {booking.notes && (
            <motion.div variants={itemVariants} className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Instructions spéciales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{booking.notes}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Mission Report for completed bookings (Owner view) */}
          {booking.status === 'completed' && currentUserId === booking.owner_id && (
            <motion.div variants={itemVariants} className="mt-6">
              <MissionReport bookingId={booking.id} />
            </motion.div>
          )}
          
          {/* Walk Proofs Section - Viewer for owner, Upload for walker */}
          {booking.status !== 'pending' && booking.status !== 'cancelled' && (
            <motion.div variants={itemVariants} className="mt-6">
              {currentUserId === booking.owner_id ? (
                <MissionProofViewer
                  bookingId={booking.id}
                  isOwner={true}
                  onProofValidated={fetchBooking}
                />
              ) : (
                <WalkProofUpload
                  bookingId={booking.id}
                  walkerId={booking.walker_id}
                  existingProofs={walkProofs}
                  isWalker={currentUserId === booking.walker_id}
                  onProofUploaded={fetchWalkProofs}
                  onProofValidated={fetchWalkProofs}
                />
              )}
            </motion.div>
          )}

          {/* === Outil GO : Code Unique de Validation (CDC §8) === */}
          {/* Côté Propriétaire : afficher le code à transmettre */}
          {currentUserId === booking.owner_id &&
            (booking.status === 'confirmed' || booking.status === 'in_progress' || booking.status === 'completed') &&
            booking.validation_code && (
              <motion.div variants={itemVariants} className="mt-6">
                <ValidationCodeCard
                  code={booking.validation_code}
                  used={!!booking.validation_code_used_at}
                />
              </motion.div>
            )}

          {/* Côté Accompagnateur : saisie du code pour clôturer la mission */}
          {currentUserId === booking.walker_id &&
            (booking.status === 'in_progress' || booking.status === 'completed') && (
              <motion.div variants={itemVariants} className="mt-6">
                <ValidateCodeInput
                  bookingId={booking.id}
                  alreadyValidated={!!booking.validation_code_used_at || booking.status === 'completed'}
                  onValidated={fetchBooking}
                />
              </motion.div>
            )}

          {/* Mission Start/End Button for walker */}
          {currentUserId === booking.walker_id && (booking.status === 'confirmed' || booking.status === 'in_progress') && (
            <motion.div variants={itemVariants} className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Gestion de la mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <MissionStartButton
                    bookingId={booking.id}
                    walkerId={booking.walker_id}
                    dogName={booking.dogs?.name || 'Chien'}
                    ownerName="Propriétaire"
                    status={booking.status}
                    onMissionStarted={fetchBooking}
                    onMissionEnded={fetchBooking}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Actions Section */}
          {booking.status !== 'cancelled' && (
            <motion.div variants={itemVariants} className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowIncidentDialog(true)}
                        className="gap-2"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Signaler un incident
                      </Button>
                    )}
                    {/* SOS exceptionnel — propriétaire seulement, mission en cours sans paiement libéré */}
                    {currentUserId === booking.owner_id &&
                      (booking.status === 'confirmed' || booking.status === 'in_progress') &&
                      !booking.funds_released_at && (
                        <SOSReleaseDialog bookingId={booking.id} onReleased={fetchBooking} />
                      )}
                    {booking.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDisputeDialog(true)}
                        className="gap-2"
                      >
                        <Scale className="h-4 w-4" />
                        Ouvrir un litige
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
      
      <Footer />
      <FloatingContact />

      {/* Dialogs */}
      <ReportIncidentDialog
        open={showIncidentDialog}
        onOpenChange={setShowIncidentDialog}
        bookingId={booking.id}
        dogName={booking.dogs?.name}
      />

      {booking.walker_id && currentUserId && (
        <OpenDisputeDialog
          open={showDisputeDialog}
          onOpenChange={setShowDisputeDialog}
          bookingId={booking.id}
          reportedId={currentUserId === booking.owner_id ? booking.walker_id : booking.owner_id}
          dogName={booking.dogs?.name}
        />
      )}
    </div>
  );
};

export default BookingDetails;
