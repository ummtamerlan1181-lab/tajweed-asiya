const { Telegraf, Scenes, session } = require('telegraf');
const cfg        = require('./config');
const msg        = require('./messages');
const kb         = require('./keyboards');
const applyScene = require('./scenes/apply');
const { ensureHeader } = require('./sheets');

const bot   = new Telegraf(cfg.BOT_TOKEN);
const stage = new Scenes.Stage([applyScene]);

bot.use(session());
bot.use(stage.middleware());

// ── /start ────────────────────────────────────────────────────────────────

bot.start(async (ctx) => {
  await ctx.reply(
    msg.GREETING(ctx.from?.first_name || ''),
    { parse_mode: 'HTML', ...kb.mainMenu() }
  );
});

bot.command('menu', async (ctx) => {
  await ctx.reply('Главное меню:', kb.mainMenu());
});

// ── Back to menu ──────────────────────────────────────────────────────────

bot.action('menu', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    msg.GREETING(ctx.from?.first_name || ''),
    { parse_mode: 'HTML', ...kb.mainMenu() }
  );
});

// ── Service info pages ────────────────────────────────────────────────────

const INFO_PAGES = {
  info_landing:   msg.INFO_LANDING,
  info_bot:       msg.INFO_BOT,
  info_ai:        msg.INFO_AI,
  info_packaging: msg.INFO_PACKAGING,
  info_design:    msg.INFO_DESIGN,
  info_consult:   msg.INFO_CONSULT,
  info_price:     msg.INFO_PRICE,
  info_cases:     msg.INFO_CASES,
};

for (const [action, text] of Object.entries(INFO_PAGES)) {
  bot.action(action, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(text, {
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
      ...kb.applyOrMenu(),
    });
  });
}

// ── Apply entry points ────────────────────────────────────────────────────

// Generic apply button — wizard handles service selection
bot.action('apply', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter('apply');
});

// Direct service shortcuts (pre-select service in wizard)
const SERVICE_MAP = {
  info_landing:   '🌐 Premium-лендинг',
  info_bot:       '🤖 Telegram-бот',
  info_ai:        '🧠 AI-автоматизация',
  info_packaging: '📦 Digital-упаковка',
  info_design:    '🎨 UX/UI-дизайн',
  info_consult:   '💬 Консультация',
};

for (const [action, service] of Object.entries(SERVICE_MAP)) {
  bot.action(`apply_${action}`, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('apply', { service });
  });
}

// ── Launch ────────────────────────────────────────────────────────────────

async function main() {
  await ensureHeader().catch(e => console.warn('[startup]', e.message));

  bot.launch();
  console.log('[bot] Vexora AI Studio bot started');

  process.once('SIGINT',  () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();
