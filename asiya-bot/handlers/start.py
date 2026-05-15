from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message
from keyboards.main_menu import main_menu

router = Router()

WELCOME = (
    "Ассаляму алейкум ва рахматуллахи ва баракатух 🌿\n\n"
    "Здесь вы можете узнать об онлайн-занятиях по таджвиду "
    "с устазой Асией и записаться на урок.\n\n"
    "Занятия — только для сестёр. Индивидуальный подход, "
    "свой темп, без стресса. 📖"
)


@router.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer(
        WELCOME,
        reply_markup=main_menu(),
    )
