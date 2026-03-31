import TelegramBot from 'node-telegram-bot-api';
import User from '../models/User.js';
import Order from '../models/Order.js';

let bot = null;

const initializeBot = () => {
  if (bot) return bot;
  
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN not configured - Telegram features disabled');
    return null;
  }

  try {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { webHook: {} });

    if (process.env.SERVER_URL) {
      bot.setWebHook(`${process.env.SERVER_URL}/api/telegram/webhook`)
        .then(() => console.log('✅ Telegram WebHook set'))
        .catch(err => console.warn('⚠️ Telegram WebHook error:', err.message));
    }

    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;

      bot.sendMessage(chatId, 
        '👋 Bienvenue sur Gas Pass!\n\n' +
        'Tapez /link pour lier votre compte\n' +
        'Tapez /order pour commander',
        { reply_markup: { 
          keyboard: [
            [{ text: '🔗 Lier compte' }, { text: '🛍️ Commander' }],
            [{ text: '📍 Mon profil' }]
          ] 
        }}
      );
    });

    bot.onText(/\/link|🔗 Lier compte/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const code = Math.random().toString(36).substring(7);
      
      // Store code in cache (ideally use Redis)
      if (!global.telegramLinkCodes) global.telegramLinkCodes = {};
      global.telegramLinkCodes[code] = { telegramId: userId, chatId, expiresAt: Date.now() + 15 * 60 * 1000 };
      
      bot.sendMessage(chatId, 
        `📱 Code de linking: \`${code}\`\n\n` +
        `Allez sur: ${process.env.FRONTEND_URL}/telegram/link?code=${code}\n\n` +
        'Connectez-vous et confirmez le linking',
        { parse_mode: 'Markdown' }
      );
    });

    bot.onText(/\/order|🛍️ Commander/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      const user = await User.findOne({ where: { telegramId: userId } });
      if (!user) {
        return bot.sendMessage(chatId, '❌ Merci de lier votre compte d\'abord.\nTapez /link');
      }
      
      bot.sendMessage(chatId, 
        '🛍️ *Commander*\n\n' +
        'Visitez notre boutique:\n' +
        `${process.env.FRONTEND_URL}/shop\n\n` +
        'Cherchez vos produits et finalisez sur le site!',
        { parse_mode: 'Markdown' }
      );
    });

    bot.onText(/\/profile|📍 Mon profil/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      const user = await User.findOne({ where: { telegramId: userId } });
      if (!user) {
        return bot.sendMessage(chatId, '❌ Compte non lié.\nTapez /link');
      }
      
      const orderCount = await Order.count({ where: { userId: user.id } });
      const totalSpent = await Order.sum('total', { where: { userId: user.id, paymentStatus: 'completed' } }) || 0;
      
      bot.sendMessage(chatId, 
        `👤 *Votre Profil*\n\n` +
        `📧 Email: ${user.email}\n` +
        `📱 Téléphone: ${user.phone || '—'}\n` +
        `📦 Commandes: ${orderCount}\n` +
        `💰 Total dépensé: $${totalSpent.toFixed(2)}\n\n` +
        `[Voir mon compte](${process.env.FRONTEND_URL}/profile)`,
        { parse_mode: 'Markdown' }
      );
    });

    bot.onText(/\/help|ℹ️ Aide/, async (msg) => {
      const chatId = msg.chat.id;
      
      bot.sendMessage(chatId, 
        `ℹ️ *Commandes Disponibles*\n\n` +
        `/start - Menu principal\n` +
        `/link - Lier votre compte\n` +
        `/order - Accès boutique\n` +
        `/profile - Voir votre profil\n` +
        `/help - Cette aide\n\n` +
        `Besoin d'aide? Contactez-nous!`,
        { parse_mode: 'Markdown' }
      );
    });

    // Fallback for unknown commands
    bot.on('message', async (msg) => {
      if (!msg.text.startsWith('/')) return;
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, '❓ Commande inconnue. Tapez /help');
    });

    return bot;
  } catch (err) {
    console.warn('⚠️ Telegram Bot initialization failed:', err.message);
    return null;
  }
};

export const getBot = () => {
  return bot || initializeBot();
};

export const notifyUser = async (telegramId, message) => {
  try {
    const telegramBot = getBot();
    if (!telegramBot) {
      console.warn('⚠️ Telegram Bot not available');
      return;
    }
    await telegramBot.sendMessage(telegramId, message);
  } catch (err) {
    console.error('Erreur notification Telegram:', err.message);
  }
};

export const notifyAdmins = async (message) => {
  try {
    const telegramBot = getBot();
    if (!telegramBot) {
      console.warn('⚠️ Telegram Bot not available');
      return;
    }
    await telegramBot.sendMessage(process.env.TELEGRAM_ADMIN_GROUP_ID, message);
  } catch (err) {
    console.error('Erreur notification admin:', err.message);
  }
};

export default { getBot, notifyUser, notifyAdmins };
