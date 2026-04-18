import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { AlertCircle, Loader2, Scale } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface OpenDisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  reportedId: string; // The other party's user_id
  dogName?: string;
  onSuccess?: () => void;
}

const DISPUTE_TYPES = [
  { value: "payment", label: "Problème de paiement", description: "Contestation sur le montant ou le paiement" },
  { value: "service_quality", label: "Qualité de service", description: "La prestation ne correspond pas aux attentes" },
  { value: "damage", label: "Dommage ou perte", description: "Dommage causé pendant la prestation" },
  { value: "misconduct", label: "Comportement inapproprié", description: "Comportement problématique du promeneur/Propriétaire" },
  { value: "other", label: "Autre", description: "Autre type de litige" }
];

const DISPUTE_REASONS = [
  { value: "refund_requested", label: "Je demande un remboursement" },
  { value: "partial_refund", label: "Je demande un remboursement partiel" },
  { value: "compensation", label: "Je demande une compensation" },
  { value: "warning", label: "Je souhaite signaler un problème" },
  { value: "mediation", label: "Je souhaite une médiation" }
];

export const OpenDisputeDialog = ({ 
  open, 
  onOpenChange, 
  bookingId, 
  reportedId,
  dogName,
  onSuccess 
}: OpenDisputeDialogProps) => {
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!type || !reason) {
      toast({
        title: "Informations requises",
        description: "Veuillez sélectionner le type de litige et la raison",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description requise",
        description: "Veuillez décrire votre litige en détail",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const { error } = await (supabase as any).from('disputes').insert({
        booking_id: bookingId,
        reporter_id: session.user.id,
        reported_id: reportedId,
        type,
        reason,
        description: description.trim()
      });

      if (error) throw error;

      toast({
        title: "Litige ouvert",
        description: "Notre équipe va examiner votre dossier et vous contacter sous 48h."
      });

      setType("");
      setReason("");
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Ouvrir un litige
          </DialogTitle>
          <DialogDescription>
            Signaler un problème{dogName ? ` concernant la prestation pour ${dogName}` : ""} qui nécessite une médiation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-400">
                Avant d'ouvrir un litige
              </p>
              <p className="text-amber-700 dark:text-amber-500 mt-1">
                Nous vous recommandons de contacter directement l'autre partie via la messagerie. 
                Un litige peut affecter la réputation des deux parties.
              </p>
            </div>
          </div>

          {/* Dispute type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type de litige</Label>
            <RadioGroup value={type} onValueChange={setType}>
              {DISPUTE_TYPES.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 py-2">
                  <RadioGroupItem value={option.value} id={`type-${option.value}`} className="mt-0.5" />
                  <div className="flex-1">
                    <Label 
                      htmlFor={`type-${option.value}`} 
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

          {/* Reason */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Que souhaitez-vous ?</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {DISPUTE_REASONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 py-1.5">
                  <RadioGroupItem value={option.value} id={`reason-${option.value}`} />
                  <Label 
                    htmlFor={`reason-${option.value}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description détaillée *</Label>
            <Textarea
              placeholder="Décrivez le problème en détail : ce qui s'est passé, quand, et pourquoi vous ouvrez ce litige..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Plus votre description est précise, plus nous pourrons traiter votre dossier rapidement.
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
              disabled={loading || !type || !reason || !description.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Scale className="h-4 w-4" />
              )}
              Ouvrir le litige
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenDisputeDialog;
