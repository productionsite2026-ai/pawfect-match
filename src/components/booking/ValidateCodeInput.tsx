import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { KeyRound, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ValidateCodeInputProps {
  bookingId: string;
  onValidated?: () => void;
  alreadyValidated?: boolean;
}

/**
 * Composant côté ACCOMPAGNATEUR.
 * Saisie du Code Unique à 6 chiffres communiqué par le Propriétaire
 * pour clôturer la mission et déclencher la libération des fonds (CDC §8).
 */
export const ValidateCodeInput = ({ bookingId, onValidated, alreadyValidated }: ValidateCodeInputProps) => {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (alreadyValidated) {
    return (
      <Card className="border-2 border-green-500/30 bg-green-500/5">
        <CardContent className="py-4 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold">Mission validée</p>
            <p className="text-sm text-muted-foreground">
              Vos gains (85%) sont en cours de virement vers votre compte.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async () => {
    if (code.length !== 6) {
      toast({ title: "Code incomplet", description: "Le code doit contenir 6 chiffres", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("validate_booking_code" as any, {
        _booking_id: bookingId,
        _code: code,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };
      if (!result.success) {
        const messages: Record<string, string> = {
          invalid_code: "Code incorrect. Demandez-le au Propriétaire.",
          code_already_used: "Ce code a déjà été utilisé.",
          not_authorized: "Vous n'êtes pas l'Accompagnateur de cette mission.",
          no_code_generated: "Aucun code n'a encore été généré pour cette mission.",
          booking_not_found: "Réservation introuvable.",
          not_authenticated: "Veuillez vous reconnecter.",
        };
        toast({
          title: "Validation refusée",
          description: messages[result.error || ""] || result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "🎉 Mission validée !",
        description: "Vos gains (85%) seront virés sous 24-48h.",
      });
      setCode("");
      onValidated?.();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-5 w-5 text-primary" />
            Clôturer la mission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Demandez au Propriétaire son <strong>Code Unique de Validation</strong> à 6 chiffres et
            saisissez-le ci-dessous pour libérer votre paiement.
          </p>

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={code.length !== 6 || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Validation…
              </>
            ) : (
              "Valider et clôturer la mission"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            🔒 Protocole DogWalking — sans ce code, le paiement reste sécurisé.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ValidateCodeInput;
