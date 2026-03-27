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
      
      bot.sendMessage(chatId, 
        `📱 Code de linking: \`${code}\`\n\n` +
        `Allez sur: ${process.env.FRONTEND_URL}/telegram/link?code=${code}\n\n` +
        'Connectez-vous et confirmez le linking',
        { parse_mode: 'Markdown' }
      );
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
