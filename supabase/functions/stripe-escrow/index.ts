// @ts-nocheck - Edge function, Deno runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe non configuré' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'create': {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(body.amount * 100),
          currency: (body.currency || 'eur').toLowerCase(),
          description: `Réservation - ${body.missionDescription}`,
          metadata: {
            bookingId: body.bookingId,
            walkerEmail: body.walkerEmail,
            ownerEmail: body.ownerEmail,
            type: 'escrow',
          },
          capture_method: 'manual',
        });
        return new Response(
          JSON.stringify({ paymentIntentId: paymentIntent.id, clientSecret: paymentIntent.client_secret }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'confirm': {
        const pi = await stripe.paymentIntents.confirm(body.paymentIntentId);
        return new Response(
          JSON.stringify({ success: pi.status === 'requires_capture' || pi.status === 'succeeded' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'release': {
        const pi = await stripe.paymentIntents.capture(body.paymentIntentId);
        return new Response(
          JSON.stringify({ success: pi.status === 'succeeded' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'refund': {
        const pi = await stripe.paymentIntents.retrieve(body.paymentIntentId);
        if (pi.latest_charge) {
          const refund = await stripe.refunds.create({
            charge: pi.latest_charge as string,
            reason: body.reason === 'requested_by_customer' ? 'requested_by_customer' : 'other',
          });
          return new Response(
            JSON.stringify({ success: refund.status === 'succeeded' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        // If no charge yet, just cancel
        await stripe.paymentIntents.cancel(body.paymentIntentId);
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'status': {
        const pi = await stripe.paymentIntents.retrieve(body.paymentIntentId);
        let status = 'pending';
        if (pi.status === 'succeeded') status = 'released';
        else if (pi.status === 'requires_capture') status = 'completed';
        else if (pi.status === 'canceled') status = 'refunded';

        return new Response(
          JSON.stringify({
            status,
            paymentIntentId: pi.id,
            amount: pi.amount / 100,
            createdAt: new Date(pi.created * 1000).toISOString(),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Action non reconnue' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
