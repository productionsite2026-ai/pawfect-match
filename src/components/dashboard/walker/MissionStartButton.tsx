import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Play, Camera, CheckCircle, Upload, X, Clock, 
  MapPin, Send, Image as ImageIcon, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MissionStartButtonProps {
  bookingId: string;
  walkerId: string;
  dogName: string;
  ownerName: string;
  status: 'confirmed' | 'in_progress' | 'completed';
  onMissionStarted?: () => void;
  onMissionEnded?: () => void;
  className?: string;
}

export const MissionStartButton: React.FC<MissionStartButtonProps> = ({
  bookingId,
  walkerId,
  dogName,
  ownerName,
  status,
  onMissionStarted,
  onMissionEnded,
  className
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState<'start' | 'end'>('start');
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast({
        title: "Format invalide",
        description: "Veuillez sélectionner une image ou vidéo",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 50 Mo",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadProofAndUpdateStatus = async (photoType: 'start' | 'end') => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      // Get location if available
      let location = { lat: null as number | null, lng: null as number | null };
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch {
        // Location not available, continue without it
      }

      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${walkerId}/${bookingId}/${photoType}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("walk-proofs")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("walk-proofs")
        .getPublicUrl(fileName);

      // Insert proof record
      const { error: insertError } = await supabase
        .from("walk_proofs")
        .insert({
          booking_id: bookingId,
          walker_id: walkerId,
          photo_url: publicUrl,
          photo_type: photoType,
          caption: caption || null,
          location_lat: location.lat,
          location_lng: location.lng
        });

      if (insertError) throw insertError;

      // Update booking status
      const newStatus = photoType === 'start' ? 'in_progress' : 'completed';
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", bookingId);

      if (updateError) throw updateError;

      // Send notification to owner
      const { data: booking } = await supabase
        .from("bookings")
        .select("owner_id")
        .eq("id", bookingId)
        .single();

      if (booking?.owner_id) {
        const message = photoType === 'start'
          ? `La promenade de ${dogName} a commencé ! Photo de prise en charge reçue.`
          : `La promenade de ${dogName} est terminée ! Photo de fin de mission reçue.`;

        await supabase.from("notifications").insert({
          user_id: booking.owner_id,
          title: photoType === 'start' ? "🐕 Promenade démarrée" : "✅ Promenade terminée",
          message,
          type: "booking",
          link: `/bookings/${bookingId}`
        });
      }

      toast({
        title: photoType === 'start' ? "Mission démarrée !" : "Mission terminée !",
        description: photoType === 'start' 
          ? "Le Propriétaire a été notifié de la prise en charge" 
          : "Le paiement sera débloqué sous 48h"
      });

      // Reset and close
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption("");
      setIsDialogOpen(false);
      
      if (photoType === 'start') {
        onMissionStarted?.();
      } else {
        onMissionEnded?.();
      }

    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer la preuve",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleOpenDialog = (stepType: 'start' | 'end') => {
    setStep(stepType);
    setIsDialogOpen(true);
  };

  return (
    <>
      {status === 'confirmed' && (
        <Button
          onClick={() => handleOpenDialog('start')}
          className={cn(
            "gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg",
            className
          )}
        >
          <Play className="h-4 w-4" />
          Prise en charge
        </Button>
      )}

      {status === 'in_progress' && (
        <Button
          onClick={() => handleOpenDialog('end')}
          className={cn(
            "gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 shadow-lg",
            className
          )}
        >
          <CheckCircle className="h-4 w-4" />
          Terminer la mission
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {step === 'start' ? (
                <>
                  <Play className="h-5 w-5 text-primary" />
                  Prise en charge de {dogName}
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Fin de mission avec {dogName}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {step === 'start' 
                ? "Prenez une photo ou vidéo pour confirmer la prise en charge du chien."
                : "Prenez une photo ou vidéo pour confirmer la fin de la promenade et débloquer le paiement."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Info Banner */}
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <Camera className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm">
                <strong>Photo/vidéo obligatoire</strong> pour {step === 'start' ? 'démarrer' : 'terminer'} la mission
              </p>
            </div>

            {/* Upload Area */}
            <AnimatePresence mode="wait">
              {previewUrl ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative"
                >
                  {selectedFile?.type.startsWith("video/") ? (
                    <video
                      src={previewUrl}
                      className="w-full max-h-48 object-cover rounded-lg"
                      controls
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="w-full max-h-48 object-cover rounded-lg"
                    />
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer",
                    "hover:border-primary hover:bg-primary/5 transition-all"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium mb-1">Appuyez pour prendre une photo</p>
                  <p className="text-sm text-muted-foreground">
                    ou sélectionner depuis la galerie
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Caption */}
            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <Input
                  placeholder="Ajouter un commentaire (optionnel)"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={200}
                />

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>Position GPS ajoutée automatiquement</span>
                </div>

                <Button
                  onClick={() => uploadProofAndUpdateStatus(step)}
                  disabled={uploading || !selectedFile}
                  className={cn(
                    "w-full gap-2",
                    step === 'start' 
                      ? "bg-gradient-to-r from-primary to-accent" 
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                  )}
                >
                  {uploading ? (
                    <>
                      <motion.div
                        className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {step === 'start' ? 'Démarrer la promenade' : 'Terminer et envoyer'}
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Cancel */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MissionStartButton;
