/**
 * Templates centralisés pour tous les messages Telegram
 * Utilise les icones de utils/icons.js pour cohérence
 */

import { icons, getStatusIcon, getPaymentIcon } from './icons.js';

export const msgCommandeClient = (order) => {
  const itemsList = order.items
    .map(i => `  ${icons.arrow} ${i.name} — ${i.weight} x${i.quantity} → $${(i.pricePerUnit * i.quantity).toFixed(2)}`)
    .join('\n');

  return (
    `${icons.success} *Commande confirmée!*\n\n` +
    `${icons.package} N° \`${order.orderNumber}\`\n` +
    `${icons.date} ${new Date(order.createdAt).toLocaleDateString('fr-FR')}\n\n` +
    `*Produits:*\n${itemsList}\n\n` +
    `${icons.price} *Total: $${parseFloat(order.total).toFixed(2)}*\n\n` +
    `${icons.delivery} Livraison:\n` +
    `  ${order.shippingAddress.name}\n` +
    `  ${order.shippingAddress.address}\n` +
    `  ${order.shippingAddress.zipcode} ${order.shippingAddress.city}\n\n` +
    `Statut: ${getStatusIcon(order.status)} En attente de paiement\n\n` +
    `_Vous recevrez une notification à chaque mise à jour._`
  );
};

export const msgStatutClient = (order) => {
  const statusMap = {
    pending:    `${icons.pending} En attente`,
    processing: `${icons.processing} En préparation`,
    shipped:    `${icons.shipped} Expédiée`,
    completed:  `${icons.completed} Livrée`,
    cancelled:  `${icons.cancelled} Annulée`
  };

  const paymentMap = {
    pending:             `${icons.paymentPending} En attente`,
    processing:          `${icons.paymentProcessing} En cours`,
    completed:           `${icons.paymentCompleted} Payé`,
    failed:              `${icons.paymentFailed} Échoué`,
    refunded:            `${icons.paymentRefunded} Remboursé`,
    partially_refunded:  `${icons.paymentPartialRefund} Remboursé partiellement`
  };

  return (
    `${icons.package} *Mise à jour commande \`${order.orderNumber}\`*\n\n` +
    `Statut: ${statusMap[order.status] || order.status}\n` +
    `Paiement: ${paymentMap[order.paymentStatus] || order.paymentStatus}\n\n` +
    `_Merci pour votre confiance!_`
  );
};

export const msgNouvelleCommandeAdmin = (order) => {
  const itemsList = order.items
    .map(i => `  ${icons.arrow} ${i.name} (${i.weight}) x${i.quantity} = $${(i.pricePerUnit * i.quantity).toFixed(2)}`)
    .join('\n');

  const addr = order.shippingAddress;

  return (
    `${icons.notification} *NOUVELLE COMMANDE*\n\n` +
    `${icons.package} N°: \`${order.orderNumber}\`\n` +
    `${icons.price} Total: *$${parseFloat(order.total).toFixed(2)}*\n` +
    `${icons.payment} Paiement: ${order.paymentStatus}\n\n` +
    `*Produits:*\n${itemsList}\n\n` +
    `${icons.delivery} *Livraison:*\n` +
    `  Nom: ${addr.name}\n` +
    `  Adresse: ${addr.address}\n` +
    `  Ville: ${addr.zipcode} ${addr.city}\n` +
    (addr.phone ? `  Tél: ${addr.phone}\n` : '') +
    `\n${icons.time} ${new Date().toLocaleString('fr-FR')}`
  );
};

export const msgRemboursementAdmin = (order, refundAmount) => (
  `${icons.paymentRefunded} *REMBOURSEMENT EFFECTUÉ*\n\n` +
  `${icons.package} Commande: \`${order.orderNumber}\`\n` +
  `${icons.price} Montant remboursé: *$${parseFloat(refundAmount).toFixed(2)}*\n` +
  `${icons.time} ${new Date().toLocaleString('fr-FR')}`
);

export const msgAnnulationAdmin = (order) => (
  `${icons.cancelled} *COMMANDE ANNULÉE*\n\n` +
  `${icons.package} N°: \`${order.orderNumber}\`\n` +
  `${icons.price} Total: $${parseFloat(order.total).toFixed(2)}\n` +
  `${icons.time} ${new Date().toLocaleString('fr-FR')}`
);
