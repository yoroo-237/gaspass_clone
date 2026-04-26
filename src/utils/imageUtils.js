/**
 * Extraire le public ID d'une URL Cloudinary complète
 * @param {string} url - URL complète de Cloudinary
 * @returns {string} Public ID ou l'URL originale
 */
export const extractPublicIdFromUrl = (url) => {
  if (!url) return '';
  
  // Format Cloudinary: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}
  // ou                 https://res.cloudinary.com/{cloud}/image/upload/{public_id}
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  return match ? match[1] : url;
};

/**
 * Convertir une URL d'upload en public ID utilisable avec Cloudinary
 * @param {string} uploadUrl - URL retournée par POST /api/upload
 * @returns {string} Public ID
 */
export const normalizeImageUrl = (uploadUrl) => {
  if (!uploadUrl) return '';
  
  // Si c'est une URL Cloudinary complète
  if (uploadUrl.includes('res.cloudinary.com')) {
    return extractPublicIdFromUrl(uploadUrl);
  }
  
  // Si c'est une URL locale (/uploads/...)
  if (uploadUrl.startsWith('/uploads/')) {
    return uploadUrl; // Garder tel quel (fallback non-Cloudinary)
  }
  
  // Sinon, c'est probablement déjà un public ID
  return uploadUrl;
};

/**
 * Vérifier si une URL est une URL Cloudinary valide
 * @param {string} url - URL à vérifier
 * @returns {boolean} true si c'est une URL Cloudinary
 */
export const isCloudinaryUrl = (url) => {
  return url && url.includes('res.cloudinary.com');
};

/**
 * Obtenir les dimensions recommandées par use-case
 * @param {string} useCase - 'thumbnail', 'card', 'detail', 'carousel'
 * @returns {Object} { width, height, crop }
 */
export const getImageDimensions = (useCase = 'card') => {
  const dimensions = {
    thumbnail: { width: 100, height: 100, crop: 'fill' },
    card: { width: 400, height: 400, crop: 'fill' },
    detail: { width: 800, height: 800, crop: 'limit' },
    carousel: { width: 600, height: 600, crop: 'limit' },
    checkout: { width: 80, height: 80, crop: 'fill' },
    hero: { width: 1200, height: 600, crop: 'fill' }
  };
  return dimensions[useCase] || dimensions.card;
};

export default {
  extractPublicIdFromUrl,
  normalizeImageUrl,
  isCloudinaryUrl,
  getImageDimensions,
};
