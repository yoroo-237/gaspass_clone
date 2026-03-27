import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, orderId) => {
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { orderId }
    });
    return intent;
  } catch (err) {
    throw new Error('Erreur création intent Stripe');
  }
};

export const verifyWebhook = (req) => {
  const sig = req.headers['stripe-signature'];
  try {
    return stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new Error('Webhook signature invalide');
  }
};

export default stripe;
