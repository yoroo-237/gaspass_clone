import jwt from 'jsonwebtoken';
import { isBlacklisted } from '../utils/tokenBlacklist.js';

const extractAndVerify = (token) => {
  if (!token) throw new Error('Token manquant');
  if (isBlacklisted(token)) throw new Error('Token révoqué');
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = extractAndVerify(token);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.token = token;
    next();
  } catch (err) {
    const status = err.message === 'Token manquant' ? 401 : 401;
    res.status(status).json({ error: err.message });
  }
};

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = extractAndVerify(token);
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    req.adminId = decoded.id;
    req.adminRole = decoded.role;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export { verifyToken, verifyAdmin };
