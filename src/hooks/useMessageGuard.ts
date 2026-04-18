import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MessageGuardState {
  /** L'utilisateur a-t-il une réservation confirmée/payée avec cet interlocuteur ? */
  hasConfirmedBooking: boolean;
  /** Liste des messages pré-enregistrés autorisés avant paiement */
  prewrittenMessages: string[];
  loading: boolean;
}

/**
 * Hook anti-fraude (CDC §4.3 + §9.4) :
 * Tant qu'aucun paiement n'a été placé en séquestre entre deux utilisateurs,
 * la messagerie est restreinte à des messages pré-enregistrés.
 * Cela évite le contournement de la plateforme et la collecte d'identités.
 */
export const PREWRITTEN_MESSAGES = [
  "Bonjour, je suis intéressé(e) par vos services.",
  "Quelles sont vos disponibilités cette semaine ?",
  "Pouvez-vous m'en dire plus sur votre expérience ?",
  "Acceptez-vous les missions urgentes ?",
  "Merci pour votre réponse, je réserve via la plateforme.",
  "À quelle heure préférez-vous démarrer la prestation ?",
  "Avez-vous l'habitude des chiens de grande taille ?",
  "Parfait, je finalise ma réservation maintenant.",
];

export const useMessageGuard = (otherUserId: string | undefined): MessageGuardState => {
  const [hasConfirmedBooking, setHasConfirmedBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!otherUserId) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setHasConfirmedBooking(false);
        setLoading(false);
        return;
      }

      const me = session.user.id;

      // Vérifie s'il existe au moins une réservation confirmée/payée entre les 2
      const { data, error } = await supabase
        .from("bookings")
        .select("id,status,owner_id,walker_id")
        .or(
          `and(owner_id.eq.${me},walker_id.eq.${otherUserId}),and(owner_id.eq.${otherUserId},walker_id.eq.${me})`
        )
        .in("status", ["confirmed", "in_progress", "completed"])
        .limit(1);

      setHasConfirmedBooking(!error && !!data && data.length > 0);
      setLoading(false);
    })();
  }, [otherUserId]);

  return {
    hasConfirmedBooking,
    prewrittenMessages: PREWRITTEN_MESSAGES,
    loading,
  };
};
