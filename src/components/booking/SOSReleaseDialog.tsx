import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SOSReleaseDialogProps {
  bookingId: string;
  onReleased?: () => void;
}

/**
 * Bouton SOS exceptionnel côté PROPRIÉTAIRE (CDC §8).
 * À utiliser UNIQUEMENT si l'Accompagnateur ne peut pas saisir le code
 * (téléphone cassé, plus de batterie, etc.).
 * Libère les fonds + déclenche un flag de modération admin.
 */
export const SOSReleaseDialog = ({ bookingId, onReleased }: SOSReleaseDialogProps) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSOS = async () => {
    if (reason.trim().length < 10) {
      toast({
        title: "Motif trop court",
        description: "Décrivez brièvement la situation (10 caractères min.)",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("trigger_sos_release" as any, {
        _booking_id: bookingId,
        _reason: reason.trim(),
      });
      if (error) throw error;

      const result = data as { success: boolean; error?: string };
      if (!result.success) {
        toast({ title: "Action refusée", description: result.error, variant: "destructive" });
        return;
      }

      toast({
        title: "Mission clôturée en mode SOS",
        description: "Notre équipe va examiner la situation sous 24h.",
      });
      setOpen(false);
      setReason("");
      onReleased?.();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/5">
          <AlertTriangle className="h-4 w-4" /> Accompagnateur injoignable (SOS)
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" /> Clôture exceptionnelle
          </AlertDialogTitle>
          <AlertDialogDescription>
            Utilisez cette procédure <strong>uniquement</strong> si votre Accompagnateur ne peut pas
            saisir son code (téléphone cassé, batterie vide, etc.) <strong>après</strong> que la
            prestation a bien eu lieu. Notre équipe vérifiera la situation.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="sos-reason">Motif (obligatoire)</Label>
          <Textarea
            id="sos-reason"
            placeholder="Ex : L'Accompagnateur m'a confirmé verbalement la fin de la promenade mais son téléphone est cassé."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            rows={4}
          />
          <p className="text-xs text-muted-foreground text-right">{reason.length}/500</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Annuler</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                handleSOS();
              }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Traitement…
                </>
              ) : (
                "Confirmer le SOS"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SOSReleaseDialog;
