const { google } = require('googleapis');
const path = require('path');
const cfg = require('./config');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_NAME = 'Заявки';

let _sheets = null;

async function getSheets() {
  if (_sheets) return _sheets;

  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(cfg.GOOGLE_CREDS_PATH),
    scopes: SCOPES,
  });

  _sheets = google.sheets({ version: 'v4', auth });
  return _sheets;
}

// Appends one application row to the sheet.
// data = { date, username, name, service, task, brand, features, deadline, contact }
async function appendApplication(data) {
  if (!cfg.GOOGLE_SHEET_ID) {
    console.warn('[sheets] GOOGLE_SHEET_ID not set — skipping write');
    return;
  }

  const sheets = await getSheets();
  const row = [
    data.date,
    data.username || '',
    data.name,
    data.service,
    data.task,
    data.brand,
    data.features || '',
    data.deadline,
    data.contact,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: cfg.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

// Creates header row if sheet is empty — call once on startup.
async function ensureHeader() {
  if (!cfg.GOOGLE_SHEET_ID) return;

  try {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: cfg.GOOGLE_SHEET_ID,
      range: `${SHEET_NAME}!A1:I1`,
    });

    if (res.data.values && res.data.values.length > 0) return;

    await sheets.spreadsheets.values.update({
      spreadsheetId: cfg.GOOGLE_SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          'Дата', 'Telegram', 'Имя', 'Услуга',
          'Задача', 'Бренд', 'Функции', 'Срок', 'Контакт',
        ]],
      },
    });

    console.log('[sheets] Header row created');
  } catch (e) {
    console.error('[sheets] ensureHeader error:', e.message);
  }
}

module.exports = { appendApplication, ensureHeader };
