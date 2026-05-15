"""Handles informational menu buttons."""
from aiogram import Router, F
from aiogram.types import CallbackQuery
from keyboards.main_menu import main_menu, back_to_menu_kb

router = Router()

INFO = {
    "info_about": (
        "📖 <b>О занятиях</b>\n\n"
        "Онлайн-уроки по таджвиду и правильному чтению Корана.\n\n"
        "• Изучение правил таджвида с нуля\n"
        "• Правильное произношение арабских букв (махариджи)\n"
        "• Мадд, гунна, ихфа, изхар и другие правила\n"
        "• Суры и аяты для намаза\n"
        "• Красивое, уверенное чтение Корана\n\n"
        "Занятия только для сестёр 🧕\n"
        "Устаза Асия — 5 лет преподавания, 200+ учениц."
    ),
    "info_formats": (
        "📋 <b>Форматы обучения</b>\n\n"
        "👩 <b>Для взрослых</b>\n"
        "Индивидуальные уроки онлайн, 45–60 минут.\n"
        "По удобному расписанию.\n\n"
        "👧 <b>Для детей (от 7 лет)</b>\n"
        "Адаптированная программа.\n"
        "Живой, игровой подход.\n\n"
        "🎯 <b>Пробный урок</b>\n"
        "Знакомство и диагностика.\n"
        "Без обязательств.\n\n"
        "Все занятия проходят онлайн — Zoom, Telegram."
    ),
    "info_faq": (
        "💬 <b>Частые вопросы</b>\n\n"
        "<b>Нужно ли знать арабский?</b>\n"
        "Нет. Начинаем с самых основ.\n\n"
        "<b>Где проходят уроки?</b>\n"
        "Онлайн — Zoom или Telegram.\n\n"
        "<b>Сколько времени на результат?</b>\n"
        "Первые успехи через 2–4 недели при регулярных занятиях.\n\n"
        "<b>Можно без жёсткого расписания?</b>\n"
        "Да, возможен гибкий формат.\n\n"
        "<b>Как оплачивать?</b>\n"
        "Оплата обсуждается индивидуально. Доступны разные способы."
    ),
    "info_price": (
        "💰 <b>Стоимость</b>\n\n"
        "Стоимость занятий обсуждается индивидуально — "
        "в зависимости от формата, частоты и продолжительности уроков.\n\n"
        "Напишите устазе в Telegram, чтобы уточнить детали:\n"
        "👉 @Asiya_um"
    ),
}


@router.callback_query(F.data.in_(INFO.keys()))
async def handle_info(callback: CallbackQuery):
    key = callback.data
    await callback.message.edit_text(
        INFO[key],
        parse_mode="HTML",
        reply_markup=back_to_menu_kb(),
    )
    await callback.answer()


@router.callback_query(F.data == "menu")
async def back_to_menu(callback: CallbackQuery):
    await callback.message.edit_text(
        "Чем могу помочь? 🌿",
        reply_markup=main_menu(),
    )
    await callback.answer()
