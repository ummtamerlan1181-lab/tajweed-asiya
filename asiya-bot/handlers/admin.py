"""Admin notifications and commands."""
import html
from aiogram import Router, Bot, F
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from config import ADMIN_CHAT_ID
from services.sheets import _get_sheet

router = Router()


def _e(value) -> str:
    """HTML-escape a value safely."""
    return html.escape(str(value)) if value else "—"


def _format_application(data: dict) -> str:
    username = data.get("tg_username", "нет")
    tg_id    = data.get("tg_id", "—")
    return (
        "📋 <b>Новая заявка на занятия</b>\n"
        "────────────────────\n"
        f"👤 <b>Имя:</b> {_e(data.get('name'))}\n"
        f"🎂 <b>Возраст:</b> {_e(data.get('age'))}\n"
        f"📖 <b>Читает Коран:</b> {_e(data.get('reads_quran'))}\n"
        f"📊 <b>Уровень:</b> {_e(data.get('level'))}\n"
        f"💬 <b>Сложности:</b> {_e(data.get('difficulties'))}\n"
        f"👥 <b>Для кого:</b> {_e(data.get('for_whom'))}\n"
        f"🌐 <b>Онлайн:</b> {_e(data.get('online_ok'))}\n"
        f"📞 <b>Контакт:</b> {_e(data.get('contact'))}\n"
        f"🔗 <b>TG:</b> {_e(username)} (id: {_e(tg_id)})\n"
        "────────────────────"
    )


def _admin_kb(tg_id: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(
            text="💬 Написать ученице",
            url=f"tg://user?id={tg_id}",
        ),
    ]])


async def notify_admin(bot: Bot, data: dict):
    try:
        await bot.send_message(
            ADMIN_CHAT_ID,
            _format_application(data),
            parse_mode="HTML",
            reply_markup=_admin_kb(data.get("tg_id", 0)),
        )
    except Exception as e:
        print(f"[Admin notify] Error: {e}")


# ── Admin commands
@router.message(Command("stats"), F.chat.id == ADMIN_CHAT_ID)
async def cmd_stats(message: Message):
    try:
        sheet = _get_sheet()
        all_rows = sheet.get_all_values()
        total = max(0, len(all_rows) - 1)
        await message.answer(f"📊 Всего заявок: <b>{total}</b>", parse_mode="HTML")
    except Exception as e:
        await message.answer(f"Ошибка: {e}")


@router.message(Command("help"), F.chat.id == ADMIN_CHAT_ID)
async def cmd_help(message: Message):
    await message.answer(
        "Команды администратора:\n"
        "/stats — количество заявок\n"
        "/help — эта справка\n\n"
        "При новой заявке бот пришлёт карточку с кнопкой «Написать ученице»."
    )
