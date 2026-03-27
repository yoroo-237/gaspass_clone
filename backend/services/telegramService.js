import TelegramBot from 'node-telegram-bot-api';
import User from '../models/User.js';
import Order from '../models/Order.js';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { webHook: {} });

bot.setWebHook(`${process.env.SERVER_URL}/api/telegram/webhook`);

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
  
  // Sauvegarder le code temporaire en session (à faire avec Redis en production)
  bot.sendMessage(chatId, 
    `📱 Code de linking: \`${code}\`\n\n` +
    `Allez sur: ${process.env.FRONTEND_URL}/telegram/link?code=${code}\n\n` +
    'Connectez-vous et confirmez le linking',
    { parse_mode: 'Markdown' }
  );
});

export const notifyUser = async (telegramId, message) => {
  try {
    await bot.sendMessage(telegramId, message);
  } catch (err) {
    console.error('Erreur notification Telegram:', err);
  }
};

export const notifyAdmins = async (message) => {
  try {
    await bot.sendMessage(process.env.TELEGRAM_ADMIN_GROUP_ID, message);
  } catch (err) {
    console.error('Erreur notification admin:', err);
  }
};

export default bot;
