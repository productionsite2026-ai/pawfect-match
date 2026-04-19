// @ts-nocheck — Edge function, Deno runtime
// Webhook Stripe : sync events → DB (account.updated, payment_intent.*)
// verify_jwt = false (Stripe ne passe pas de JWT, on vérifie la signature à la place)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!stripeKey || !webhookSecret) {
    return new Response(JSON.stringify({ error: 'Stripe non configuré' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400, headers: corsHeaders });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message);
    return new Response(`Signature error: ${err.message}`, { status: 400, headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    switch (event.type) {
      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await supabaseAdmin
          .from('profiles')
          .update({
            stripe_charges_enabled: !!account.charges_enabled,
            stripe_payouts_enabled: !!account.payouts_enabled,
          })
          .eq('stripe_account_id', account.id);
        break;
      }

      case 'payment_intent.amount_capturable_updated': {
        // Fonds autorisés (séquestre actif)
        const pi = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata?.booking_id;
        if (bookingId) {
          await supabaseAdmin
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', bookingId)
            .eq('status', 'pending');
        }
        break;
      }

      case 'payment_intent.succeeded': {
        // Capture effectuée → fonds transférés au promeneur
        const pi = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata?.booking_id;
        if (bookingId) {
          await supabaseAdmin
            .from('bookings')
            .update({ funds_released_at: new Date().toISOString() })
            .eq('id', bookingId)
            .is('funds_released_at', null);
        }
        break;
      }

      case 'payment_intent.canceled':
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata?.booking_id;
        if (bookingId) {
          await supabaseAdmin
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId);
        }
        break;
      }

      default:
        // ignore silently
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
