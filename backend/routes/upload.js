import express from 'express';
import fs from 'fs';
import path from 'path';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Simple file upload middleware (in production, use multer)
const uploadFile = (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const file = req.files.image;
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validation
    if (!allowedMimes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Only JPEG, PNG, WebP, GIF allowed' });
    }

    if (file.size > maxSize) {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filepath = path.join(uploadDir, filename);

    file.mv(filepath, (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ error: 'Upload failed' });
      }

      res.json({
        success: true,
        filename,
        url: `/uploads/${filename}`
      });
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload error' });
  }
};

// POST /api/upload - Admin only
router.post('/', verifyAdmin, uploadFile);

// POST /api/upload/images - Alias for compatibility
router.post('/images', verifyAdmin, uploadFile);

export default router;
