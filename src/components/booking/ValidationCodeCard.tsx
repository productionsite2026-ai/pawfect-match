import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Eye, EyeOff, Copy, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ValidationCodeCardProps {
  code: string | null;
  used: boolean;
}

/**
 * Carte affichée côté PROPRIÉTAIRE.
 * Affiche le Code Unique de Validation à 6 chiffres à transmettre à l'Accompagnateur
 * en fin de mission pour libérer le paiement (Outil GO – CDC §8).
 */
export const ValidationCodeCard = ({ code, used }: ValidationCodeCardProps) => {
  const [revealed, setRevealed] = useState(false);

  const copyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast({ title: "Code copié", description: "Vous pouvez le transmettre à votre Accompagnateur" });
  };

  if (!code) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-5 w-5 text-primary" />
            Code Unique de Validation
            {used ? (
              <Badge variant="secondary" className="ml-auto">
                <ShieldCheck className="h-3 w-3 mr-1" /> Utilisé
              </Badge>
            ) : (
              <Badge className="ml-auto bg-primary">Actif</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {used
              ? "Ce code a été utilisé pour libérer le paiement de votre Accompagnateur Certifié."
              : "Communiquez ce code à votre Accompagnateur Certifié uniquement à la fin de la prestation. Il l'utilisera pour confirmer la fin de mission et déclencher son paiement."}
          </p>

          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-2xl md:text-3xl tracking-[0.4em] text-center bg-background border-2 border-dashed border-primary/40 rounded-lg py-3 select-all">
              {revealed || used ? code : "••••••"}
            </div>
            {!used && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setRevealed(!revealed)}
                  aria-label={revealed ? "Masquer le code" : "Afficher le code"}
                >
                  {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={copyCode} aria-label="Copier le code">
                  <Copy className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {!used && (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
              ⚠️ <strong>Sécurité :</strong> ne transmettez ce code qu'une fois la prestation effectivement
              terminée. Sans ce code, le paiement reste sécurisé sur la plateforme.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ValidationCodeCard;
