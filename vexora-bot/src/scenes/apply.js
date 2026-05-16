const { Scenes } = require('telegraf');
const msg = require('../messages');
const kb  = require('../keyboards');
const { appendApplication } = require('../sheets');
const cfg = require('../config');

function e(val) {
  if (!val) return '—';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function reply(ctx, text, extra = {}) {
  return ctx.reply(text, { parse_mode: 'HTML', ...extra });
}

// ── Service selection buttons map ─────────────────────────────────────────

const SVC_MAP = {
  svc_landing:   '🌐 Premium-лендинг',
  svc_bot:       '🤖 Telegram-бот',
  svc_ai:        '🧠 AI-автоматизация',
  svc_packaging: '📦 Digital-упаковка',
  svc_design:    '🎨 UX/UI-дизайн',
  svc_consult:   '💬 Консультация',
};

// ── Step 0: Service choice ────────────────────────────────────────────────

async function stepService(ctx) {
  const preselected = ctx.scene.state?.service;
  if (preselected) {
    ctx.scene.session.service = preselected;
    await reply(ctx, msg.APPLY_START(preselected));
    await reply(ctx, msg.APPLY_NAME);
    ctx.wizard.next(); // skip to name step
    return ctx.wizard.next();
  }
  await reply(ctx, '🛠 Что будем создавать?', kb.serviceKb());
  return ctx.wizard.next();
}

// ── Step 1: Capture service → ask name ───────────────────────────────────

async function stepName(ctx) {
  if (ctx.callbackQuery) {
    const service = SVC_MAP[ctx.callbackQuery.data];
    if (!service) return;
    ctx.scene.session.service = service;
    await ctx.answerCbQuery();
    await ctx.editMessageText(msg.APPLY_START(service), { parse_mode: 'HTML' });
    await reply(ctx, msg.APPLY_NAME);
    return ctx.wizard.next();
  }
  // If service was pre-set and we skipped here, handle text as name
  if (ctx.message?.text) {
    ctx.scene.session.name = ctx.message.text.trim();
    await reply(ctx, msg.APPLY_TASK(e(ctx.scene.session.name)));
    return ctx.wizard.next();
  }
}

// ── Step 2: Capture name → ask task ──────────────────────────────────────

async function stepTask(ctx) {
  if (!ctx.message?.text) return;
  ctx.scene.session.name = ctx.message.text.trim();
  await reply(ctx, msg.APPLY_TASK(e(ctx.scene.session.name)));
  return ctx.wizard.next();
}

// ── Step 3: Capture task → ask brand ─────────────────────────────────────

async function stepBrand(ctx) {
  if (!ctx.message?.text) return;
  ctx.scene.session.task = ctx.message.text.trim();
  await reply(ctx, msg.APPLY_BRAND, kb.brandKb());
  return ctx.wizard.next();
}

// ── Step 4: Capture brand → ask features ─────────────────────────────────

async function stepFeatures(ctx) {
  if (!ctx.callbackQuery) return;

  const brandMap = {
    brand_yes:     '✅ Есть лого и цвета',
    brand_partial: '🔸 Частично',
    brand_no:      '❌ С нуля',
  };

  const brand = brandMap[ctx.callbackQuery.data];
  if (!brand) return;

  ctx.scene.session.brand    = brand;
  ctx.scene.session.features = [];

  await ctx.answerCbQuery();
  await ctx.editMessageText(
    msg.APPLY_BRAND + '\n\n<i>Выбрано: ' + brand + '</i>',
    { parse_mode: 'HTML' }
  );
  await reply(ctx, msg.APPLY_FEATURES, kb.featuresKb([]));
  return ctx.wizard.next();
}

// ── Step 5: Multi-select features → ask deadline ──────────────────────────

async function stepDeadline(ctx) {
  if (!ctx.callbackQuery) return;
  const data = ctx.callbackQuery.data;

  if (data.startsWith('feat_') && data !== 'feat_done') {
    const featureId = data.slice(5);
    const selected  = ctx.scene.session.features || [];
    ctx.scene.session.features = selected.includes(featureId)
      ? selected.filter(f => f !== featureId)
      : [...selected, featureId];

    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(
      kb.featuresKb(ctx.scene.session.features).reply_markup
    );
    return;
  }

  if (data === 'feat_done') {
    await ctx.answerCbQuery();
    const labels = kb.ALL_FEATURES
      .filter(f => (ctx.scene.session.features || []).includes(f.id))
      .map(f => f.label)
      .join(', ') || 'Не выбрано';

    ctx.scene.session.featuresLabel = labels;
    await ctx.editMessageText(
      msg.APPLY_FEATURES + '\n\n<i>Выбрано: ' + labels + '</i>',
      { parse_mode: 'HTML' }
    );
    await reply(ctx, msg.APPLY_DEADLINE, kb.deadlineKb());
    return ctx.wizard.next();
  }
}

// ── Step 6: Capture deadline → ask contact ────────────────────────────────

async function stepContact(ctx) {
  if (!ctx.callbackQuery) return;

  const deadlineMap = {
    dl_urgent:  '🚀 Срочно (до 2 недель)',
    dl_month:   '📅 В течение месяца',
    dl_calm:    '🗓 Не горит (1–3 месяца)',
    dl_explore: '💭 Пока изучаю варианты',
  };

  const deadline = deadlineMap[ctx.callbackQuery.data];
  if (!deadline) return;

  ctx.scene.session.deadline = deadline;
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    msg.APPLY_DEADLINE + '\n\n<i>Выбрано: ' + deadline + '</i>',
    { parse_mode: 'HTML' }
  );
  await reply(ctx, msg.APPLY_CONTACT);
  return ctx.wizard.next();
}

// ── Step 7: Capture contact → submit ─────────────────────────────────────

async function stepSubmit(ctx) {
  if (!ctx.message?.text) return;

  const s    = ctx.scene.session;
  const user = ctx.from;

  const data = {
    date:     new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
    username: user.username || '',
    name:     s.name     || '—',
    service:  s.service  || '—',
    task:     s.task     || '—',
    brand:    s.brand    || '—',
    features: s.featuresLabel || '—',
    deadline: s.deadline || '—',
    contact:  ctx.message.text.trim(),
  };

  try { await appendApplication(data); }
  catch (err) { console.error('[sheets]', err.message); }

  try {
    await ctx.telegram.sendMessage(
      cfg.ADMIN_CHAT_ID,
      msg.ADMIN_NEW({
        ...data,
        name:    e(data.name),
        task:    e(data.task),
        contact: e(data.contact),
        username: e(data.username),
      }),
      { parse_mode: 'HTML' }
    );
  } catch (err) { console.error('[admin]', err.message); }

  await reply(ctx, msg.APPLY_DONE(e(data.name)), kb.backToMenu());
  return ctx.scene.leave();
}

// ─── Wizard ───────────────────────────────────────────────────────────────

const applyScene = new Scenes.WizardScene(
  'apply',
  stepService,
  stepName,
  stepTask,
  stepBrand,
  stepFeatures,
  stepDeadline,
  stepContact,
  stepSubmit,
);

applyScene.command('cancel', async (ctx) => {
  await ctx.reply(msg.APPLY_CANCEL, kb.backToMenu());
  return ctx.scene.leave();
});

module.exports = applyScene;
