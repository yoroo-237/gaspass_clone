/**
 * Centralisation des icones/emojis pour cohérence et maintenabilité
 * Permet de changer tous les icones en un seul endroit
 */

export const icons = {
  // Statuts commande
  pending:    '⏳',
  processing: '⚙️',
  shipped:    '🚚',
  completed:  '✅',
  cancelled:  '❌',

  // Statuts paiement
  paymentPending:        '⏳',
  paymentProcessing:     '🔄',
  paymentCompleted:      '✅',
  paymentFailed:         '❌',
  paymentRefunded:       '↩️',
  paymentPartialRefund:  '↩️',

  // Actions
  success:      '✅',
  error:        '❌',
  warning:      '⚠️',
  info:         'ℹ️',
  question:     '❓',
  link:         '🔗',
  help:         'ℹ️',

  // Produits & commandes
  package:      '📦',
  receipt:      '📋',
  delivery:     '📍',
  time:         '🕐',
  date:         '📅',
  price:        '💰',
  payment:      '💳',
  money:        '💵',

  // Navigation
  menu:         '📋',
  profile:      '👤',
  home:         '🏠',
  settings:     '⚙️',
  notification: '🔔',

  // Welcome
  wave:         '👋',
  rocket:       '🚀',
  star:         '⭐',
  fire:         '🔥',
  empty:        '📭',
  arrow:        '→',
};

/**
 * Récupère l'icone pour un statut de commande
 */
export const getStatusIcon = (status) => {
  return icons[status] || '•';
};

/**
 * Récupère l'icone pour un statut de paiement
 */
export const getPaymentIcon = (paymentStatus) => {
  const map = {
    pending:             icons.paymentPending,
    processing:          icons.paymentProcessing,
    completed:           icons.paymentCompleted,
    failed:              icons.paymentFailed,
    refunded:            icons.paymentRefunded,
    partially_refunded:  icons.paymentPartialRefund,
  };
  return map[paymentStatus] || '•';
};

export default icons;
