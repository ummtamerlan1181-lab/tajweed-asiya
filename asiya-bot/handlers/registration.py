"""Full registration FSM flow."""
from aiogram import Router, F
from aiogram.types import CallbackQuery, Message
from aiogram.fsm.context import FSMContext
from states.registration import Registration
from keyboards.main_menu import (
    reads_quran_kb, level_kb, for_whom_kb, online_kb, main_menu
)
from services.sheets import append_application
from handlers.admin import notify_admin

router = Router()

# ── Step labels for inline buttons
READS_LABELS = {"rq_yes": "Да", "rq_little": "Немного", "rq_no": "Нет"}
LEVEL_LABELS  = {"lvl_zero": "С нуля", "lvl_beginner": "Начинающий", "lvl_errors": "Читаю, но с ошибками"}
FW_LABELS     = {"fw_self": "Для себя", "fw_child": "Для ребёнка", "fw_both": "Для себя и ребёнка"}
ONLINE_LABELS = {"on_yes": "Да, подходит", "on_discuss": "Уточним"}


# ── Start registration
@router.callback_query(F.data == "register")
async def start_registration(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text(
        "Хорошо, давайте познакомимся 🌿\n\n"
        "Как вас зовут? (можно просто имя)"
    )
    await state.set_state(Registration.name)
    await callback.answer()


# ── Name
@router.message(Registration.name)
async def got_name(message: Message, state: FSMContext):
    await state.update_data(name=message.text.strip())
    await message.answer("Сколько вам лет?")
    await state.set_state(Registration.age)


# ── Age
@router.message(Registration.age)
async def got_age(message: Message, state: FSMContext):
    await state.update_data(age=message.text.strip())
    await message.answer(
        "Вы уже читаете Коран?",
        reply_markup=reads_quran_kb(),
    )
    await state.set_state(Registration.reads_quran)


# ── Reads Quran
@router.callback_query(Registration.reads_quran, F.data.in_(READS_LABELS))
async def got_reads(callback: CallbackQuery, state: FSMContext):
    await state.update_data(reads_quran=READS_LABELS[callback.data])
    await callback.message.edit_text(
        "Как бы вы оценили свой уровень чтения?",
        reply_markup=level_kb(),
    )
    await state.set_state(Registration.level)
    await callback.answer()


# ── Level
@router.callback_query(Registration.level, F.data.in_(LEVEL_LABELS))
async def got_level(callback: CallbackQuery, state: FSMContext):
    await state.update_data(level=LEVEL_LABELS[callback.data])
    await callback.message.edit_text(
        "Какие сложности вы испытываете при чтении?\n\n"
        "Напишите в свободной форме — это поможет устазе лучше подготовиться."
    )
    await state.set_state(Registration.difficulties)
    await callback.answer()


# ── Difficulties (free text)
@router.message(Registration.difficulties)
async def got_difficulties(message: Message, state: FSMContext):
    await state.update_data(difficulties=message.text.strip())
    await message.answer(
        "Обучение для кого?",
        reply_markup=for_whom_kb(),
    )
    await state.set_state(Registration.for_whom)


# ── For whom
@router.callback_query(Registration.for_whom, F.data.in_(FW_LABELS))
async def got_for_whom(callback: CallbackQuery, state: FSMContext):
    await state.update_data(for_whom=FW_LABELS[callback.data])
    await callback.message.edit_text(
        "Онлайн-формат вам подходит?",
        reply_markup=online_kb(),
    )
    await state.set_state(Registration.online_ok)
    await callback.answer()


# ── Online OK
@router.callback_query(Registration.online_ok, F.data.in_(ONLINE_LABELS))
async def got_online(callback: CallbackQuery, state: FSMContext):
    await state.update_data(online_ok=ONLINE_LABELS[callback.data])
    await callback.message.edit_text(
        "Оставьте, пожалуйста, ваш Telegram username или номер телефона,\n"
        "чтобы устаза смогла с вами связаться."
    )
    await state.set_state(Registration.contact)
    await callback.answer()


# ── Contact → finish
@router.message(Registration.contact)
async def got_contact(message: Message, state: FSMContext):
    data = await state.get_data()
    data["contact"] = message.text.strip()
    data["tg_username"] = f"@{message.from_user.username}" if message.from_user.username else "нет"
    data["tg_id"] = message.from_user.id

    # Thank the user
    await message.answer(
        "Джазакаллаху хайран! ✨\n\n"
        "Ваша заявка принята. Устаза Асия свяжется с вами в ближайшее время.\n\n"
        "Да пребудет с вами баракат в этом стремлении 🌿",
        reply_markup=main_menu(),
    )

    # Save to Google Sheets
    append_application(data)

    # Notify admin
    await notify_admin(message.bot, data)
    await state.clear()
