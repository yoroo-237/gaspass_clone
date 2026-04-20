import AdminLog from '../models/AdminLog.js';
import logger from '../utils/logger.js';

/**
 * Middleware factory — à appliquer sur chaque route admin critique
 * Usage: router.put('/orders/:id', verifyAdmin, logAdminAction('UPDATE_ORDER', 'Order'), handler)
 */
export const logAdminAction = (action, entity) => async (req, res, next) => {
  // On wrappe res.json pour intercepter la réponse
  const originalJson = res.json.bind(res);

  res.json = async (body) => {
    // Ne logger que les succès (status < 400)
    if (res.statusCode < 400) {
      try {
        await AdminLog.create({
          adminId:   req.adminId,
          action,
          entity,
          entityId:  req.params?.id || null,
          after:     req.body || null,
          ip:        req.ip || req.headers['x-forwarded-for'],
          userAgent: req.headers['user-agent']
        });
      } catch (err) {
        logger.error('AdminLog error', { error: err.message });
      }
    }
    return originalJson(body);
  };

  next();
};

export default { logAdminAction };
