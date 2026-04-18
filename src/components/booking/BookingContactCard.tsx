import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  bookingId: string;
}

interface ContactState {
  phone_visible?: boolean;
  phone?: string;
  name?: string;
  reason?: string;
  error?: string;
}

/**
 * Affiche le contact (nom + téléphone) de l'autre partie d'une réservation.
 * Le téléphone n'est révélé que si la mission est confirmée/en cours et < 24h avant.
 * Conformité CDC §9 : anonymisation des identités hors fenêtre de mission.
 */
export const BookingContactCard = ({ bookingId }: Props) => {
  const [contact, setContact] = useState<ContactState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await (supabase as any).rpc("get_booking_contact", {
        _booking_id: bookingId,
      });
      if (!active) return;
      if (error) {
        setContact({ error: error.message });
      } else {
        setContact(data as ContactState);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [bookingId]);

  if (loading) return null;
  if (!contact || contact.error) return null;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <User className="h-4 w-4" /> Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contact.phone_visible ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{contact.name}</p>
              <a
                href={`tel:${contact.phone}`}
                className="font-semibold text-primary hover:underline"
              >
                {contact.phone || "Téléphone non renseigné"}
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
            <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Coordonnées masquées</p>
              <p className="text-muted-foreground">
                {contact.reason === "too_early"
                  ? "Le téléphone sera révélé 24h avant la mission."
                  : "Disponible dès la confirmation de la mission."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingContactCard;
