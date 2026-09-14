const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { items } = await req.json();
    const secretKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const origin = req.headers.get('origin') || 'https://bswagy.github.io';

    const params = new URLSearchParams();
    params.append('mode', 'payment');
    // Automatic tax temporarily disabled — Stripe Tax needs its own dedicated setup pass later.
    params.append('shipping_address_collection[allowed_countries][0]', 'US');
    params.append('success_url', `${origin}/smacked-organics/?checkout=success`);
    params.append('cancel_url', `${origin}/smacked-organics/?checkout=canceled`);

    items.forEach((item: any, i: number) => {
      params.append(`line_items[${i}][price_data][currency]`, 'usd');
      params.append(`line_items[${i}][price_data][product_data][name]`, `${item.name} — ${item.size}`);
      params.append(`line_items[${i}][price_data][unit_amount]`, String(Math.round(item.price * 100)));
      params.append(`line_items[${i}][quantity]`, String(item.qty));
    });

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      throw new Error(session.error?.message || 'Stripe request failed');
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
