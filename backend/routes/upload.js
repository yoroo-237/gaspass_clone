import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { verifyAdmin } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Configurer Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Vérifier que les variables Cloudinary sont configurées
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  logger.warn('⚠️  Variables Cloudinary manquantes — uploads non disponibles');
}

// Configuration Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gaspass/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    resource_type: 'auto',
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
    ]
  }
});

// Filtre fichiers
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format non autorisé — JPEG, PNG, WebP, GIF uniquement'), false);
  }
};

// Configuration multer avec Cloudinary
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Middleware de gestion d'erreur multer
const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// POST /api/upload — Upload produit
router.post('/', verifyAdmin, handleUpload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu' });
  }

  logger.info(`✅ Upload Cloudinary: ${req.file.path}`);

  res.json({
    success: true,
    filename: req.file.filename,
    url: req.file.path, // URL Cloudinary complète
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// POST /api/upload/images — alias
router.post('/images', verifyAdmin, handleUpload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu' });
  }

  res.json({
    success: true,
    filename: req.file.filename,
    url: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

export default router;
