/**
 * Service Stripe - Gestion des paiements avec système escrow
 * Côté client : appelle les edge functions Supabase pour les opérations serveur
 */

import { supabase } from "@/integrations/supabase/client";

export interface EscrowPayment {
  bookingId: string;
  amount: number;
  currency: string;
  walkerEmail: string;
  ownerEmail: string;
  missionDescription: string;
}

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'released' | 'refunded';
  paymentIntentId: string;
  amount: number;
  createdAt: Date;
  releasedAt?: Date;
}

/**
 * Créer un paiement en escrow (fonds bloqués)
 * Appelle une edge function côté serveur
 */
export async function createEscrowPayment(payment: EscrowPayment): Promise<string> {
  const { data, error } = await supabase.functions.invoke('stripe-escrow', {
    body: { action: 'create', ...payment },
  });

  if (error) {
    console.error('Erreur création paiement escrow:', error);
    throw new Error('Impossible de créer le paiement');
  }

  return data.paymentIntentId;
}

/**
 * Confirmer le paiement (capturer les fonds)
 */
export async function confirmEscrowPayment(paymentIntentId: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke('stripe-escrow', {
    body: { action: 'confirm', paymentIntentId },
  });

  if (error) {
    console.error('Erreur confirmation paiement:', error);
    throw new Error('Impossible de confirmer le paiement');
  }

  return data.success;
}

/**
 * Libérer les fonds (après mission complétée avec code de fin)
 */
export async function releaseEscrowPayment(paymentIntentId: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke('stripe-escrow', {
    body: { action: 'release', paymentIntentId },
  });

  if (error) {
    console.error('Erreur libération paiement:', error);
    throw new Error('Impossible de libérer les fonds');
  }

  return data.success;
}

/**
 * Rembourser le paiement (en cas d'annulation)
 */
export async function refundEscrowPayment(paymentIntentId: string, reason: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke('stripe-escrow', {
    body: { action: 'refund', paymentIntentId, reason },
  });

  if (error) {
    console.error('Erreur remboursement:', error);
    throw new Error('Impossible de rembourser le paiement');
  }

  return data.success;
}

/**
 * Récupérer le statut du paiement
 */
export async function getPaymentStatus(paymentIntentId: string): Promise<PaymentStatus> {
  const { data, error } = await supabase.functions.invoke('stripe-escrow', {
    body: { action: 'status', paymentIntentId },
  });

  if (error) {
    console.error('Erreur récupération statut:', error);
    throw new Error('Impossible de récupérer le statut du paiement');
  }

  return {
    status: data.status,
    paymentIntentId: data.paymentIntentId,
    amount: data.amount,
    createdAt: new Date(data.createdAt),
    releasedAt: data.releasedAt ? new Date(data.releasedAt) : undefined,
  };
}

/**
 * Créer une session de paiement Checkout pour le client
 */
export async function createPaymentSession(payment: EscrowPayment): Promise<string> {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: {
      ...payment,
      successUrl: `${window.location.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/booking/cancel`,
    },
  });

  if (error) {
    console.error('Erreur création session paiement:', error);
    throw new Error('Impossible de créer la session de paiement');
  }

  return data.sessionId || '';
}
