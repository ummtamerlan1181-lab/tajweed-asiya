require('dotenv').config();

const required = ['BOT_TOKEN', 'ADMIN_CHAT_ID'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
}

module.exports = {
  BOT_TOKEN:        process.env.BOT_TOKEN,
  ADMIN_CHAT_ID:    process.env.ADMIN_CHAT_ID,
  GOOGLE_SHEET_ID:  process.env.GOOGLE_SHEET_ID  || '',
  GOOGLE_CREDS_PATH: process.env.GOOGLE_CREDS_PATH || 'creds.json',
};
