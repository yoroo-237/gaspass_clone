import TelegramBot from 'node-telegram-bot-api';
import User from '../models/User.js';
import Order from '../models/Order.js';
import TelegramLinkCode from '../models/TelegramLinkCode.js';
import logger from '../utils/logger.js';
import { icons } from '../utils/icons.js';

let bot = null;

const initializeBot = () => {
  if (bot) return bot;

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    logger.warn('TELEGRAM_BOT_TOKEN non configuré — Telegram désactivé');
    return null;
  }

  try {
    // ✅ En dev: polling, en prod: webhook
    const isProduction = process.env.NODE_ENV === 'production';
    
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: !isProduction,
      webHook: isProduction ? {} : false
    });

    // Configurer webhook seulement en production
    if (isProduction && process.env.SERVER_URL) {
      bot.setWebHook(`${process.env.SERVER_URL}/api/telegram/webhook`)
        .then(() => logger.info('Telegram WebHook configuré'))
        .catch(err => logger.warn(`Telegram WebHook error: ${err.message}`));
    } else if (!isProduction) {
      logger.info('Telegram: polling mode (développement)');
    }

    // ─── COMMANDES CLIENT ───────────────────────────────────────────

    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId,
        `${icons.wave} *Bienvenue sur Gas Pass!*\n\n` +
        'Commandes disponibles:\n' +
        '/link — Lier votre compte\n' +
        '/orders — Vos dernières commandes\n' +
        '/profile — Votre profil\n' +
        '/help — Aide',
        { parse_mode: 'Markdown',
          reply_markup: {
            keyboard: [
              [{ text: `${icons.link} Lier compte` }, { text: `${icons.package} Mes commandes` }],
              [{ text: `${icons.profile} Mon profil` },  { text: `${icons.help} Aide` }]
            ],
            resize_keyboard: true
          }
        }
      );
    });

    bot.onText(/\/link|🔗 Lier compte/, async (msg) => {
      const chatId  = msg.chat.id;
      const tgId    = msg.from.id;
      const code    = Math.random().toString(36).substring(2, 9).toUpperCase();

      try {
        // Supprimer les anciens codes non utilisés pour ce telegramId
        await TelegramLinkCode.destroy({
          where: { telegramId: tgId, used: false }
        });

        await TelegramLinkCode.create({
          code,
          telegramId: tgId,
          chatId,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        });

        bot.sendMessage(chatId,
          `${icons.link} *Code de liaison: \`${code}\`*\n\n` +
          `Rendez-vous sur:\n${process.env.FRONTEND_URL}/telegram/link?code=${code}\n\n` +
          `${icons.warning} Ce code expire dans *15 minutes*`,
          { parse_mode: 'Markdown' }
        );
      } catch (err) {
        logger.error('Erreur génération code link', { error: err.message });
        bot.sendMessage(chatId, `${icons.error} Erreur, réessayez dans quelques instants.`);
      }
    });

    bot.onText(/\/orders|📦 Mes commandes/, async (msg) => {
      const chatId = msg.chat.id;
      const tgId   = msg.from.id;

      try {
        const user = await User.findOne({ where: { telegramId: tgId } });
        if (!user) {
          return bot.sendMessage(chatId,
            `${icons.error} Compte non lié.\nTapez /link pour commencer.`,
            { parse_mode: 'Markdown' }
          );
        }

        const orders = await Order.findAll({
          where: { userId: user.id },
          order: [['createdAt', 'DESC']],
          limit: 5
        });

        if (orders.length === 0) {
          return bot.sendMessage(chatId, `${icons.empty} Aucune commande pour le moment.`);
        }

        const statusMap = {
          pending:    icons.pending, processing: icons.processing,
          shipped:    icons.shipped, completed:  icons.completed, cancelled: icons.cancelled
        };

        const list = orders.map(o =>
          `${statusMap[o.status] || '•'} \`${o.orderNumber}\` — $${parseFloat(o.total).toFixed(2)}`
        ).join('\n');

        bot.sendMessage(chatId,
          `${icons.package} *Vos 5 dernières commandes:*\n\n${list}`,
          { parse_mode: 'Markdown' }
        );
      } catch (err) {
        logger.error('Erreur fetch orders Telegram', { error: err.message });
        bot.sendMessage(chatId, `${icons.error} Erreur serveur.`);
      }
    });

    bot.onText(/\/profile|👤 Mon profil/, async (msg) => {
      const chatId = msg.chat.id;
      const tgId   = msg.from.id;

      try {
        const user = await User.findOne({ where: { telegramId: tgId } });
        if (!user) {
          return bot.sendMessage(chatId, `${icons.error} Compte non lié.\nTapez /link`);
        }

        const orderCount  = await Order.count({ where: { userId: user.id } });
        const totalSpent  = await Order.sum('total', {
          where: { userId: user.id, paymentStatus: 'completed' }
        }) || 0;

        bot.sendMessage(chatId,
          `${icons.profile} *Votre Profil*\n\n` +
          `${icons.info} ${user.email}\n` +
          `${icons.phone} ${user.phone || '—'}\n` +
          `${icons.package} Commandes: ${orderCount}\n` +
          `${icons.price} Total dépensé: $${parseFloat(totalSpent).toFixed(2)}`,
          { parse_mode: 'Markdown' }
        );
      } catch (err) {
        bot.sendMessage(chatId, `${icons.error} Erreur serveur.`);
      }
    });

    bot.onText(/\/help|ℹ️ Aide/, (msg) => {
      bot.sendMessage(msg.chat.id,
        `${icons.help} *Aide Gas Pass Bot*\n\n` +
        `/start — Menu principal\n` +
        `/link — Lier votre compte\n` +
        `/orders — Vos commandes\n` +
        `/profile — Votre profil\n` +
        `/help — Cette aide`,
        { parse_mode: 'Markdown' }
      );
    });

    // Fallback messages non reconnus
    bot.on('message', (msg) => {
      if (!msg.text || msg.text.startsWith('/')) return;
      bot.sendMessage(msg.chat.id,
        `${icons.question} Commande non reconnue. Tapez /help`
      );
    });

    logger.info('Telegram Bot initialisé');
    return bot;

  } catch (err) {
    logger.warn(`Telegram Bot init failed: ${err.message}`);
    return null;
  }
};

export const getBot = () => bot || initializeBot();

// ─── NOTIFICATIONS CLIENT ────────────────────────────────────────────────────

export const notifyClient = async (userId, message) => {
  try {
    const telegramBot = getBot();
    if (!telegramBot) return;

    const user = await User.findByPk(userId);
    if (!user?.telegramConnected || !user?.telegramChatId) return;

    await telegramBot.sendMessage(user.telegramChatId, message, {
      parse_mode: 'Markdown'
    });
  } catch (err) {
    logger.error('Erreur notification client Telegram', { error: err.message });
  }
};

// ─── NOTIFICATIONS ADMIN ─────────────────────────────────────────────────────

export const notifyAdmin = async (message) => {
  try {
    const telegramBot = getBot();
    if (!telegramBot) return;

    // Notifier le user admin personnel
    if (process.env.TELEGRAM_ADMIN_ID) {
      await telegramBot.sendMessage(
        process.env.TELEGRAM_ADMIN_ID,
        message,
        { parse_mode: 'Markdown' }
      );
    }

    // Notifier aussi le groupe admin si configuré
    if (process.env.TELEGRAM_ADMIN_GROUP_ID) {
      await telegramBot.sendMessage(
        process.env.TELEGRAM_ADMIN_GROUP_ID,
        message,
        { parse_mode: 'Markdown' }
      );
    }

  } catch (err) {
    logger.error('Erreur notification admin Telegram', { error: err.message });
  }
};

export default { getBot, notifyClient, notifyAdmin };
