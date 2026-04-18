import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, Upload, CheckCircle, Clock, X, 
  MapPin, Image as ImageIcon, Send, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WalkProof {
  id: string;
  photo_url: string;
  photo_type: string;
  caption: string | null;
  status: string;
  uploaded_at: string;
}

interface WalkProofUploadProps {
  bookingId: string;
  walkerId: string;
  existingProofs?: WalkProof[];
  isWalker: boolean;
  onProofUploaded?: () => void;
  onProofValidated?: () => void;
}

export const WalkProofUpload: React.FC<WalkProofUploadProps> = ({
  bookingId,
  walkerId,
  existingProofs = [],
  isWalker,
  onProofUploaded,
  onProofValidated
}) => {
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [photoType, setPhotoType] = useState<"start" | "during" | "end">("during");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Format invalide",
        description: "Veuillez sélectionner une image",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 10 Mo",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadProof = async () => {
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
      const fileName = `${walkerId}/${bookingId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("walk-proofs")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("walk-proofs")
        .getPublicUrl(fileName);

      // Insert proof record
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      // Use type assertion since walk_proofs table was just created
      const { error: insertError } = await (supabase as any)
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

      toast({
        title: "Photo envoyée !",
        description: "Le Propriétaire sera notifié pour validation"
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption("");
      onProofUploaded?.();

    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer la photo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const validateProof = async (proofId: string, approved: boolean) => {
    try {
      // Use type assertion since walk_proofs table was just created
      const { error } = await (supabase as any)
        .from("walk_proofs")
        .update({
          status: approved ? "validated" : "rejected",
          validated_at: new Date().toISOString(),
          validated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", proofId);

      if (error) throw error;

      toast({
        title: approved ? "Photo validée" : "Photo refusée",
        description: approved 
          ? "La preuve a été validée avec succès"
          : "La photo a été refusée"
      });

      onProofValidated?.();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validated":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Validée</Badge>;
      case "rejected":
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Refusée</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
    }
  };

  const photoTypeLabels = {
    start: "Début de promenade",
    during: "Pendant la promenade",
    end: "Fin de promenade"
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Preuves photo de la promenade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing proofs */}
        {existingProofs.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">
              Photos envoyées ({existingProofs.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {existingProofs.map((proof, index) => (
                  <motion.div
                    key={proof.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-border">
                      <img
                        src={proof.photo_url}
                        alt={proof.caption || "Preuve de promenade"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(proof.status)}
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs">
                        {photoTypeLabels[proof.photo_type as keyof typeof photoTypeLabels]}
                      </p>
                      {proof.caption && (
                        <p className="text-white/80 text-xs truncate">{proof.caption}</p>
                      )}
                    </div>

                    {/* Validation buttons for owner */}
                    {!isWalker && proof.status === "pending" && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => validateProof(proof.id, true)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => validateProof(proof.id, false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Upload section for walker */}
        {isWalker && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Ajouter une photo</h4>

            {/* Photo type selector */}
            <div className="flex flex-wrap gap-2">
              {(["start", "during", "end"] as const).map((type) => (
                <Button
                  key={type}
                  variant={photoType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPhotoType(type)}
                >
                  {photoTypeLabels[type]}
                </Button>
              ))}
            </div>

            {/* Preview */}
            <AnimatePresence>
              {previewUrl ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative"
                >
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
                    "hover:border-primary hover:bg-primary/5 transition-colors"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium">Cliquez pour prendre ou choisir une photo</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG ou HEIC • 10 Mo max
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Caption */}
            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Input
                  placeholder="Ajouter une légende (optionnel)"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={200}
                />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>La localisation sera ajoutée automatiquement si disponible</span>
                </div>

                <Button
                  onClick={uploadProof}
                  disabled={uploading}
                  className="w-full gap-2"
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
                      Envoyer la preuve photo
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* Info message */}
        {!isWalker && existingProofs.length === 0 && (
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Le promeneur n'a pas encore envoyé de photos pour cette promenade.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalkProofUpload;
