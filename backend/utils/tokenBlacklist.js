// Simple blacklist en mémoire — à remplacer par Redis en production multi-instance
const blacklist = new Set();

export const blacklistToken = (token) => {
  blacklist.add(token);
  // Nettoyage automatique toutes les heures pour éviter la fuite mémoire
  setTimeout(() => blacklist.delete(token), 7 * 24 * 60 * 60 * 1000); // 7 jours = durée du token
};

export const isBlacklisted = (token) => blacklist.has(token);
