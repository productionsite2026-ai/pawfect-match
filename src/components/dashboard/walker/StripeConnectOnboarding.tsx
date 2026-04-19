import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ConnectStatus {
  onboarded: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  requirements?: string[];
}

export const StripeConnectOnboarding = () => {
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const fetchStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("stripe-connect-status");
      if (error) throw error;
      setStatus(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleOnboard = async () => {
    setRedirecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-connect-onboard", {
        body: {
          returnUrl: `${window.location.origin}/dashboard/walker?stripe=return`,
          refreshUrl: `${window.location.origin}/dashboard/walker?stripe=refresh`,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL d'onboarding manquante");
      }
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: e.message || "Impossible d'ouvrir l'onboarding Stripe",
        variant: "destructive",
      });
      setRedirecting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const fullyActive = status?.charges_enabled && status?.payouts_enabled;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Paiements Stripe
              {fullyActive ? (
                <Badge variant="default" className="bg-green-600">Actif</Badge>
              ) : status?.onboarded ? (
                <Badge variant="secondary">En vérification</Badge>
              ) : (
                <Badge variant="destructive">Configuration requise</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Reçois 85% du montant de chaque mission directement sur ton compte bancaire.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            {status?.charges_enabled ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            )}
            <span>Encaissement</span>
          </div>
          <div className="flex items-center gap-2">
            {status?.payouts_enabled ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            )}
            <span>Virements</span>
          </div>
        </div>

        {status?.requirements && status.requirements.length > 0 && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
            <p className="font-medium mb-1">Informations manquantes :</p>
            <ul className="list-disc list-inside text-muted-foreground">
              {status.requirements.slice(0, 5).map((r) => (
                <li key={r}>{r.replace(/_/g, " ")}</li>
              ))}
            </ul>
          </div>
        )}

        {!fullyActive && (
          <Button onClick={handleOnboard} disabled={redirecting} className="w-full gap-2">
            {redirecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            {status?.onboarded ? "Compléter mes informations" : "Configurer mes paiements"}
          </Button>
        )}

        {fullyActive && (
          <p className="text-sm text-muted-foreground">
            Tout est en ordre. Les fonds sont libérés automatiquement à la fin de chaque mission validée.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeConnectOnboarding;
