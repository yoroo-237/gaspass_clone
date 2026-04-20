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
      req.body,  // ← maintenant c'est le raw buffer grâce au middleware
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new Error('Webhook signature invalide');
  }
};

export const createRefund = async (paymentIntentId, amount = null) => {
  try {
    const refundData = { payment_intent: paymentIntentId };
    // Si amount fourni → remboursement partiel, sinon remboursement total
    if (amount) refundData.amount = Math.round(amount * 100);

    const refund = await stripe.refunds.create(refundData);
    return refund;
  } catch (err) {
    throw new Error(`Erreur remboursement Stripe: ${err.message}`);
  }
};

export default stripe;
