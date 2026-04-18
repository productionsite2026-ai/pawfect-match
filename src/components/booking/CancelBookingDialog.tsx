import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  dogName?: string;
  scheduledDate?: string;
  onSuccess?: () => void;
}

const CANCEL_REASONS = [
  { value: "schedule_conflict", label: "Conflit d'emploi du temps" },
  { value: "health_issue", label: "Problème de santé (moi ou mon chien)" },
  { value: "emergency", label: "Urgence personnelle" },
  { value: "weather", label: "Conditions météo défavorables" },
  { value: "found_alternative", label: "J'ai trouvé une alternative" },
  { value: "other", label: "Autre raison" }
];

export const CancelBookingDialog = ({ 
  open, 
  onOpenChange, 
  bookingId, 
  dogName,
  scheduledDate,
  onSuccess 
}: CancelBookingDialogProps) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if cancellation is within 24h
  const isWithin24h = scheduledDate 
    ? new Date(scheduledDate).getTime() - Date.now() < 24 * 60 * 60 * 1000
    : false;

  const handleCancel = async () => {
    if (!reason) {
      toast({
        title: "Raison requise",
        description: "Veuillez sélectionner une raison d'annulation",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const finalReason = reason === "other" && customReason 
        ? customReason 
        : CANCEL_REASONS.find(r => r.value === reason)?.label || reason;

      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: finalReason,
          cancelled_by: session.user.id
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Réservation annulée",
        description: "La réservation a été annulée avec succès"
      });

      setReason("");
      setCustomReason("");
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
          <DialogTitle className="text-xl flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Annuler la réservation
          </DialogTitle>
          <DialogDescription>
            Annuler la prestation{dogName ? ` pour ${dogName}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 24h warning */}
          {isWithin24h && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-400">
                  Annulation tardive
                </p>
                <p className="text-amber-700 dark:text-amber-500 mt-1">
                  Cette réservation a lieu dans moins de 24h. Des frais d'annulation peuvent s'appliquer selon les conditions du promeneur.
                </p>
              </div>
            </div>
          )}

          {/* Reason selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Pourquoi annulez-vous cette réservation ?
            </Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {CANCEL_REASONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 py-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Custom reason input */}
          {reason === "other" && (
            <Textarea
              placeholder="Précisez la raison..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Ne pas annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              className="flex-1 gap-2"
              disabled={loading || !reason}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Confirmer l'annulation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelBookingDialog;
