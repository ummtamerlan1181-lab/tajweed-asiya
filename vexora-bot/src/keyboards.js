const { Markup } = require('telegraf');
const { TG } = require('./messages');

// ── Main menu ──────────────────────────────────────────────────────────────

const mainMenu = () => Markup.inlineKeyboard([
  [
    Markup.button.callback('🌐 Лендинг',         'info_landing'),
    Markup.button.callback('🤖 Telegram-бот',    'info_bot'),
  ],
  [
    Markup.button.callback('🧠 AI-автоматизация', 'info_ai'),
    Markup.button.callback('📦 Упаковка',         'info_packaging'),
  ],
  [
    Markup.button.callback('🎨 UX/UI-дизайн',    'info_design'),
    Markup.button.callback('💬 Консультация',     'info_consult'),
  ],
  [
    Markup.button.callback('🖼 Примеры работ',   'info_cases'),
    Markup.button.callback('💎 Стоимость',        'info_price'),
  ],
  [
    Markup.button.callback('✍️ Оставить заявку', 'apply'),
  ],
  [
    Markup.button.url('📩 Написать напрямую', TG),
  ],
]);

// ── Service selector inside wizard ───────────────────────────────────────

const serviceKb = () => Markup.inlineKeyboard([
  [Markup.button.callback('🌐 Premium-лендинг',    'svc_landing')],
  [Markup.button.callback('🤖 Telegram-бот',       'svc_bot')],
  [Markup.button.callback('🧠 AI-автоматизация',   'svc_ai')],
  [Markup.button.callback('📦 Digital-упаковка',   'svc_packaging')],
  [Markup.button.callback('🎨 UX/UI-дизайн',       'svc_design')],
  [Markup.button.callback('💬 Консультация',        'svc_consult')],
]);

// ── Brand ─────────────────────────────────────────────────────────────────

const brandKb = () => Markup.inlineKeyboard([
  [Markup.button.callback('✅ Да, есть лого и цвета', 'brand_yes')],
  [Markup.button.callback('🔸 Частично (есть идеи)',  'brand_partial')],
  [Markup.button.callback('❌ С нуля',                'brand_no')],
]);

// ── Features (multi-select) ────────────────────────────────────────────────

const ALL_FEATURES = [
  { id: 'f_forms',    label: '📋 Приём заявок' },
  { id: 'f_booking',  label: '📅 Онлайн-запись' },
  { id: 'f_pay',      label: '💳 Оплата онлайн' },
  { id: 'f_bot',      label: '🤖 Telegram-бот' },
  { id: 'f_ai',       label: '🧠 AI-ответы' },
  { id: 'f_sheets',   label: '📊 Google Sheets / CRM' },
  { id: 'f_catalog',  label: '🛍 Каталог / магазин' },
  { id: 'f_funnel',   label: '🔄 Воронка продаж' },
];

const featuresKb = (selected = []) => {
  const rows = ALL_FEATURES.map(({ id, label }) => {
    const isOn = selected.includes(id);
    return [Markup.button.callback(`${isOn ? '✦' : '○'} ${label}`, `feat_${id}`)];
  });
  rows.push([Markup.button.callback('➜ Готово', 'feat_done')]);
  return Markup.inlineKeyboard(rows);
};

// ── Deadline ──────────────────────────────────────────────────────────────

const deadlineKb = () => Markup.inlineKeyboard([
  [Markup.button.callback('🚀 Срочно (до 2 недель)',   'dl_urgent')],
  [Markup.button.callback('📅 В течение месяца',       'dl_month')],
  [Markup.button.callback('🗓 Не горит (1–3 месяца)', 'dl_calm')],
  [Markup.button.callback('💭 Пока изучаю варианты',  'dl_explore')],
]);

// ── Navigation ────────────────────────────────────────────────────────────

const backToMenu = () => Markup.inlineKeyboard([
  [Markup.button.callback('← Главное меню', 'menu')],
]);

const applyOrMenu = () => Markup.inlineKeyboard([
  [Markup.button.callback('✍️ Оставить заявку', 'apply')],
  [Markup.button.url('📩 Написать напрямую', TG)],
  [Markup.button.callback('← Назад',            'menu')],
]);

module.exports = {
  mainMenu,
  serviceKb,
  brandKb,
  ALL_FEATURES,
  featuresKb,
  deadlineKb,
  backToMenu,
  applyOrMenu,
};
