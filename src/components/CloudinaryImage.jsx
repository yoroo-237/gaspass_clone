import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

/**
 * Composant Image Cloudinary optimisé
 * @param {Object} props
 * @param {string} props.src - URL de l'image ou public ID Cloudinary
 * @param {string} props.alt - Texte alternatif
 * @param {number} props.width - Largeur souhaitée (défaut: 500)
 * @param {number} props.height - Hauteur souhaitée (défaut: 500)
 * @param {string} props.crop - Mode crop: "fill", "limit", "scale" (défaut: "limit")
 * @param {string} props.className - Classes CSS
 * @param {Object} props.style - Styles inline
 * @param {boolean} props.priority - Si true, charge l'image avec priority (défaut: false)
 */
const CloudinaryImage = ({
  src,
  alt = 'Image',
  width = 500,
  height = 500,
  crop = 'limit',
  className = '',
  style = {},
  priority = false,
  ...rest
}) => {
  // Récupérer le cloud name
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  // Si pas de cloud name ou pas d'image, afficher un placeholder
  if (!cloudName || !src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: `${width}px`, height: `${height}px`, ...style }}
      >
        <span className="text-gray-400 text-sm">Image non disponible</span>
      </div>
    );
  }

  // Initialiser Cloudinary
  const cld = new Cloudinary({ cloud: { cloudName } });

  // Extraire le public ID si c'est une URL complète
  let publicId = src;
  if (src.includes('res.cloudinary.com')) {
    const match = src.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    publicId = match ? match[1] : src;
  } else if (src.startsWith('http')) {
    // Si c'est une URL locale ou externe, retourner une img classique
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        {...rest}
      />
    );
  }

  // Créer l'image optimisée
  try {
    const image = cld
      .image(publicId)
      .format('auto')
      .quality('auto')
      .resize(
        auto()
          .width(width)
          .height(height)
          .crop(crop)
          .gravity(autoGravity())
      );

    return (
      <AdvancedImage
        cldImg={image}
        alt={alt}
        className={className}
        style={{ ...style, width: `${width}px`, height: `${height}px` }}
        {...rest}
      />
    );
  } catch (error) {
    console.error('Erreur rendering Cloudinary image:', error);
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        {...rest}
      />
    );
  }
};

export default CloudinaryImage;
