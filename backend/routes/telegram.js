import express from 'express';
import { getBot } from '../services/telegramService.js';
import User from '../models/User.js';
import TelegramLinkCode from '../models/TelegramLinkCode.js';
import { verifyToken } from '../middleware/auth.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

const router = express.Router();

// Webhook Telegram
router.post('/webhook', async (req, res) => {
  try {
    const bot = getBot();
    if (!bot) {
      return res.status(503).json({ error: 'Telegram Bot not available' });
    }
    bot.processUpdate(req.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur webhook' });
  }
});

// Link Telegram user
router.post('/link', verifyToken, async (req, res) => {
  try {
    const { code, telegramId } = req.body;

    if (!code || !telegramId) {
      return res.status(400).json({ error: 'code et telegramId requis' });
    }

    // Vérifier que le code existe et n'est pas expiré
    const entry = await TelegramLinkCode.findOne({
      where: {
        code,
        used: false,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!entry) {
      return res.status(400).json({ error: 'Code invalide ou expiré' });
    }
    if (Number(entry.telegramId) !== Number(telegramId)) {
      return res.status(400).json({ error: 'Code invalide pour cet utilisateur Telegram' });
    }

    // Vérifier doublon telegramId
    const existing = await User.findOne({ where: { telegramId } });
    if (existing && existing.id !== req.userId) {
      return res.status(409).json({ error: 'Ce compte Telegram est déjà lié à un autre utilisateur' });
    }

    await User.update(
      { telegramId, telegramChatId: entry.chatId, telegramConnected: true },
      { where: { id: req.userId } }
    );

    // Marquer le code comme utilisé
    await entry.update({ used: true });

    logger.info(`Telegram linked: user ${req.userId} with telegram ${telegramId}`);
    res.json({ message: 'Telegram linked!' });
  } catch (err) {
    logger.error('Erreur linking Telegram', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Erreur linking' });
  }
});

export default router;
