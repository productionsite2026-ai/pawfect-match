import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ReportIncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  dogName?: string;
  onSuccess?: () => void;
}

const INCIDENT_TYPES = [
  { value: "late", label: "Retard", description: "Le promeneur est en retard" },
  { value: "no_show", label: "Absence", description: "Le promeneur ne s'est pas présenté" },
  { value: "early_end", label: "Fin anticipée", description: "La prestation s'est terminée trop tôt" },
  { value: "behavior", label: "Comportement", description: "Problème de comportement" },
  { value: "other", label: "Autre", description: "Autre incident" }
];

export const ReportIncidentDialog = ({ 
  open, 
  onOpenChange, 
  bookingId, 
  dogName,
  onSuccess 
}: ReportIncidentDialogProps) => {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!type) {
      toast({
        title: "Type requis",
        description: "Veuillez sélectionner le type d'incident",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const { error } = await (supabase as any).from('incident_reports').insert({
        booking_id: bookingId,
        reporter_id: session.user.id,
        type,
        description: description.trim() || null
      });

      if (error) throw error;

      toast({
        title: "Incident signalé",
        description: "Nous avons bien reçu votre signalement et allons le traiter rapidement."
      });

      setType("");
      setDescription("");
      onOpenChange(false);
      onSuccess?.();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Signaler un incident
          </DialogTitle>
          <DialogDescription>
            Signaler un problème{dogName ? ` concernant la prestation pour ${dogName}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Incident type selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type d'incident</Label>
            <RadioGroup value={type} onValueChange={setType}>
              {INCIDENT_TYPES.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 py-2">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                  <div className="flex-1">
                    <Label 
                      htmlFor={option.value} 
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description (optionnel)</Label>
            <Textarea
              placeholder="Décrivez l'incident en détail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg text-sm">
            <Flag className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              Notre équipe examinera votre signalement et prendra les mesures appropriées. 
              Vous serez notifié de la résolution.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 gap-2"
              disabled={loading || !type}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              Signaler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIncidentDialog;
