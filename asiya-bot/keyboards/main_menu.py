from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


def main_menu() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="📖 О занятиях",    callback_data="info_about"),
            InlineKeyboardButton(text="📋 Форматы",       callback_data="info_formats"),
        ],
        [
            InlineKeyboardButton(text="💬 Вопросы и ответы", callback_data="info_faq"),
            InlineKeyboardButton(text="💰 Стоимость",     callback_data="info_price"),
        ],
        [
            InlineKeyboardButton(text="✍️ Записаться",   callback_data="register"),
        ],
        [
            InlineKeyboardButton(text="🌐 Сайт",            url="https://ustaza-asiya.netlify.app/"),
            InlineKeyboardButton(text="📩 Написать устазе", url="https://t.me/Asiya_um"),
        ],
    ])


def reads_quran_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text="✅ Да",      callback_data="rq_yes"),
        InlineKeyboardButton(text="🔸 Немного", callback_data="rq_little"),
        InlineKeyboardButton(text="❌ Нет",     callback_data="rq_no"),
    ]])


def level_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🌱 С нуля",               callback_data="lvl_zero")],
        [InlineKeyboardButton(text="📘 Начинающий",           callback_data="lvl_beginner")],
        [InlineKeyboardButton(text="📖 Читаю, но с ошибками", callback_data="lvl_errors")],
    ])


def for_whom_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🧕 Для себя",              callback_data="fw_self")],
        [InlineKeyboardButton(text="👧 Для ребёнка",           callback_data="fw_child")],
        [InlineKeyboardButton(text="👨‍👧 Для себя и ребёнка",    callback_data="fw_both")],
    ])


def online_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text="✅ Да, подходит", callback_data="on_yes"),
        InlineKeyboardButton(text="💬 Уточним",     callback_data="on_discuss"),
    ]])


def back_to_menu_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text="← Главное меню", callback_data="menu"),
    ]])
