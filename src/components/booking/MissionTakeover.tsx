import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Play, Camera, CheckCircle, Clock, AlertTriangle, 
  MapPin, Dog
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { WalkProofUpload } from "./WalkProofUpload";

interface MissionTakeoverProps {
  booking: {
    id: string;
    status: string;
    scheduled_date: string;
    scheduled_time: string;
    service_type: string;
    duration_minutes: number;
    price: number;
    city?: string;
    address?: string;
    dogs?: { name: string; breed?: string; photo_url?: string };
    owner?: { first_name?: string; phone?: string; avatar_url?: string };
  };
  walkerId: string;
  onStatusChange?: () => void;
}

export const MissionTakeover: React.FC<MissionTakeoverProps> = ({
  booking,
  walkerId,
  onStatusChange
}) => {
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const canStart = booking.status === 'confirmed';
  const isInProgress = booking.status === 'in_progress';
  const isCompleted = booking.status === 'completed';

  const handleStartMission = async () => {
    if (!photoUploaded) {
      toast({
        title: "Photo obligatoire",
        description: "Veuillez prendre une photo de prise en charge avant de démarrer",
        variant: "destructive"
      });
      setShowPhotoDialog(true);
      return;
    }

    setIsStarting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'in_progress' })
        .eq('id', booking.id);

      if (error) throw error;

      // Create notification for owner
      await supabase.from('notifications').insert({
        user_id: booking.owner?.first_name ? booking.id : '', // Need owner_id from booking
        title: "Mission démarrée",
        message: `La promenade de ${booking.dogs?.name} vient de commencer`,
        type: "info",
        link: `/bookings/${booking.id}`
      });

      toast({
        title: "Mission démarrée ! 🚀",
        description: `Bonne promenade avec ${booking.dogs?.name}`,
      });

      onStatusChange?.();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndMission = async () => {
    setShowPhotoDialog(true);
  };

  const handlePhotoUploaded = () => {
    setPhotoUploaded(true);
    toast({
      title: "Photo envoyée ✓",
      description: "Vous pouvez maintenant démarrer la mission"
    });
  };

  const completeWithProof = async () => {
    setIsEnding(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Mission terminée ! 🎉",
        description: "Le paiement sera libéré après 48h",
      });

      setShowPhotoDialog(false);
      onStatusChange?.();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsEnding(false);
    }
  };

  const getServiceLabel = (type: string) => {
    const labels: Record<string, string> = {
      promenade: "Promenade",
      garde: "Garde",
      visite: "Visite à domicile",
      veterinaire: "Accompagnement vétérinaire"
    };
    return labels[type] || type;
  };

  if (isCompleted) {
    return (
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-700 dark:text-green-400">Mission terminée</h3>
              <p className="text-sm text-green-600/80">Le paiement sera libéré sous 48h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="flex items-center gap-2">
            {isInProgress ? (
              <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
            ) : (
              <Play className="h-5 w-5 text-primary" />
            )}
            {isInProgress ? "Mission en cours" : "Prise en charge"}
          </CardTitle>
          <CardDescription>
            {isInProgress 
              ? "N'oubliez pas d'envoyer des photos pendant la promenade"
              : "Photo obligatoire pour démarrer la mission"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Mission Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                {booking.dogs?.photo_url ? (
                  <img src={booking.dogs.photo_url} alt={booking.dogs.name} className="w-full h-full object-cover" />
                ) : (
                  <Dog className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <p className="font-semibold">{booking.dogs?.name || "Chien"}</p>
                <p className="text-sm text-muted-foreground">{booking.dogs?.breed || "Race non spécifiée"}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline">{getServiceLabel(booking.service_type)}</Badge>
              <p className="text-sm text-muted-foreground mt-1">{booking.duration_minutes} min</p>
              <p className="font-bold text-primary">{booking.price}€</p>
            </div>
          </div>

          {/* Location */}
          {booking.city && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{booking.address ? `${booking.address}, ` : ""}{booking.city}</span>
            </div>
          )}

          {/* Photo Status */}
          {canStart && (
            <div className={`flex items-center gap-3 p-3 rounded-lg ${photoUploaded ? 'bg-green-50 dark:bg-green-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}`}>
              {photoUploaded ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Photo de prise en charge envoyée
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    Photo obligatoire avant le démarrage
                  </span>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {canStart && (
              <>
                {!photoUploaded && (
                  <Button 
                    onClick={() => setShowPhotoDialog(true)} 
                    variant="outline" 
                    className="gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Prendre la photo de prise en charge
                  </Button>
                )}
                <Button 
                  onClick={handleStartMission}
                  disabled={!photoUploaded || isStarting}
                  className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  size="lg"
                >
                  {isStarting ? (
                    <motion.div
                      className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                  Démarrer la mission
                </Button>
              </>
            )}

            {isInProgress && (
              <>
                <Button 
                  onClick={() => setShowPhotoDialog(true)} 
                  variant="outline" 
                  className="gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Envoyer une photo
                </Button>
                <Button 
                  onClick={handleEndMission}
                  className="gap-2"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5" />
                  Terminer la mission
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photo Upload Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              {isInProgress ? "Envoyer une preuve photo" : "Photo de prise en charge"}
            </DialogTitle>
            <DialogDescription>
              {isInProgress 
                ? "Envoyez des photos pendant ou à la fin de la promenade"
                : "Cette photo est obligatoire pour démarrer la mission"
              }
            </DialogDescription>
          </DialogHeader>

          <WalkProofUpload
            bookingId={booking.id}
            walkerId={walkerId}
            isWalker={true}
            onProofUploaded={() => {
              handlePhotoUploaded();
              if (isInProgress) {
                setShowPhotoDialog(false);
              }
            }}
          />

          {isInProgress && (
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowPhotoDialog(false)}
              >
                Fermer
              </Button>
              <Button 
                className="flex-1 gap-2"
                onClick={completeWithProof}
                disabled={isEnding}
              >
                {isEnding ? "Finalisation..." : "Terminer la mission"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MissionTakeover;
