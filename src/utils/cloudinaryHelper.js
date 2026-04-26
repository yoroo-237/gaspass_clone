import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { quality } from '@cloudinary/url-gen/actions/quality';
import { format } from '@cloudinary/url-gen/actions/delivery';

// Initialiser Cloudinary avec le cloud name du .env
const initCloudinary = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    console.warn('⚠️ VITE_CLOUDINARY_CLOUD_NAME not set in .env');
    return null;
  }
  return new Cloudinary({ cloud: { cloudName } });
};

/**
 * Obtenir une URL d'image Cloudinary optimisée
 * @param {string} publicId - ID public Cloudinary (ex: "gaspass/products/xyz.jpg")
 * @param {Object} options - Options de transformation
 * @param {number} options.width - Largeur (défaut: 800)
 * @param {number} options.height - Hauteur (défaut: 800)
 * @param {string} options.crop - Mode crop (défaut: "limit")
 * @returns {string} URL complète de l'image optimisée ou undefined
 */
export const getCloudinaryImageUrl = (publicId, options = {}) => {
  const cld = initCloudinary();
  if (!cld || !publicId) return undefined;

  const {
    width = 800,
    height = 800,
    crop = 'limit'
  } = options;

  try {
    return cld
      .image(publicId)
      .format('auto')           // auto-format: webp si supporté, sinon jpg/png
      .quality('auto')          // auto-quality: réduit jusqu'à 70% sans perte visuelle
      .resize(
        auto()
          .width(width)
          .height(height)
          .crop(crop)
          .gravity(autoGravity()) // Centre automatiquement l'image
      )
      .toURL();
  } catch (error) {
    console.error('Erreur Cloudinary:', error);
    return undefined;
  }
};

/**
 * Extraire le public ID d'une URL Cloudinary
 * @param {string} url - URL complète Cloudinary
 * @returns {string} Public ID ou l'URL originale
 */
export const extractPublicId = (url) => {
  if (!url) return '';
  
  // Si c'est une URL Cloudinary, extraire le public ID
  if (url.includes('res.cloudinary.com')) {
    // Format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? match[1] : url;
  }
  
  // Sinon, c'est probablement déjà un public ID ou une URL locale
  return url;
};

/**
 * Transformer une URL d'upload en public ID Cloudinary
 * @param {string} uploadUrl - URL retournée par /api/upload
 * @returns {string} Public ID pour utiliser avec getCloudinaryImageUrl
 */
export const normalizeCloudinaryUrl = (uploadUrl) => {
  if (!uploadUrl) return '';
  
  // Si c'est une URL complète, extraire le public ID
  if (uploadUrl.startsWith('http')) {
    return extractPublicId(uploadUrl);
  }
  
  // Sinon, c'est probablement déjà un public ID
  return uploadUrl;
};

export default {
  getCloudinaryImageUrl,
  extractPublicId,
  normalizeCloudinaryUrl,
};
