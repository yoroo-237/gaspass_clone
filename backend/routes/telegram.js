import express from 'express';
import bot from '../services/telegramService.js';
import User from '../models/User.js';

const router = express.Router();

// Webhook Telegram
router.post('/webhook', async (req, res) => {
  try {
    bot.processUpdate(req.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur webhook' });
  }
});

// Link Telegram user
router.post('/link', async (req, res) => {
  try {
    const { code, userId, telegramId } = req.body;
    
    await User.update(
      { telegramId, telegramConnected: true },
      { where: { id: userId } }
    );
    
    res.json({ message: 'Telegram linked!' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur linking' });
  }
});

export default router;
