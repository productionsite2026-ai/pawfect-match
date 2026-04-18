import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Shield, 
  X, 
  Ambulance,
  Dog,
  User
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SOSButtonProps {
  bookingId?: string;
  ownerId?: string;
  dogName?: string;
  className?: string;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  bookingId,
  ownerId,
  dogName,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Géolocalisation non disponible"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(loc);
          resolve(loc);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleOpenSOS = async () => {
    setIsOpen(true);
    try {
      await getLocation();
    } catch (e) {
      // Location not available, continue without it
    }
  };

  const sendSOSAlert = async (type: "medical" | "dog" | "danger") => {
    setSending(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Non connecté");
      }

      const alertMessages = {
        medical: "🚨 URGENCE MÉDICALE - Le promeneur a besoin d'assistance médicale",
        dog: "🐕 URGENCE CHIEN - Un problème est survenu avec le chien",
        danger: "⚠️ SITUATION DANGEREUSE - Le promeneur signale un danger"
      };

      // Send notification to owner
      if (ownerId) {
        await supabase.from("notifications").insert({
          user_id: ownerId,
          title: "🆘 ALERTE SOS",
          message: `${alertMessages[type]}${dogName ? ` - ${dogName}` : ""}${location ? ` - Position: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : ""}`,
          type: "sos",
          link: bookingId ? `/bookings/${bookingId}` : "/dashboard"
        });
      }

      toast({
        title: "Alerte SOS envoyée",
        description: "Le Propriétaire a été alerté. Restez en sécurité."
      });

      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'alerte",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const emergencyNumbers = [
    { label: "SAMU", number: "15", icon: Ambulance },
    { label: "Police", number: "17", icon: Shield },
    { label: "Pompiers", number: "18", icon: AlertTriangle },
    { label: "Urgences", number: "112", icon: Phone }
  ];

  return (
    <>
      <Button
        variant="destructive"
        className={`gap-2 ${className}`}
        onClick={handleOpenSOS}
      >
        <AlertTriangle className="h-4 w-4" />
        SOS Urgence
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Urgence SOS
            </DialogTitle>
            <DialogDescription>
              Sélectionnez le type d'urgence pour alerter le Propriétaire et les services concernés.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Location Status */}
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              {location ? (
                <span className="text-green-600">
                  Position localisée ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Localisation en cours...
                </span>
              )}
            </div>

            {/* Alert Types */}
            <div className="grid gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-left hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                onClick={() => sendSOSAlert("medical")}
                disabled={sending}
              >
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <Ambulance className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400">Urgence médicale</p>
                  <p className="text-sm text-red-600/70 dark:text-red-400/70">Besoin d'assistance médicale</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg text-left hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
                onClick={() => sendSOSAlert("dog")}
                disabled={sending}
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <Dog className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-orange-700 dark:text-orange-400">Problème avec le chien</p>
                  <p className="text-sm text-orange-600/70 dark:text-orange-400/70">Fugue, blessure, comportement</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg text-left hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors"
                onClick={() => sendSOSAlert("danger")}
                disabled={sending}
              >
                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-yellow-700 dark:text-yellow-400">Situation dangereuse</p>
                  <p className="text-sm text-yellow-600/70 dark:text-yellow-400/70">Agression, danger immédiat</p>
                </div>
              </motion.button>
            </div>

            {/* Emergency Numbers */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Numéros d'urgence :</p>
              <div className="grid grid-cols-4 gap-2">
                {emergencyNumbers.map((emergency) => (
                  <a
                    key={emergency.number}
                    href={`tel:${emergency.number}`}
                    className="flex flex-col items-center gap-1 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <emergency.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs font-medium">{emergency.label}</span>
                    <span className="text-lg font-bold text-primary">{emergency.number}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Cancel Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;