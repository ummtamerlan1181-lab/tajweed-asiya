"""Asiya Tajweed Bot — entry point."""
import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage

from config import BOT_TOKEN
from handlers import start, menu, registration, admin
from services.sheets import ensure_headers

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


async def main():
    bot = Bot(token=BOT_TOKEN)
    dp  = Dispatcher(storage=MemoryStorage())

    # Register routers (order matters — registration before menu for FSM states)
    dp.include_router(start.router)
    dp.include_router(registration.router)
    dp.include_router(menu.router)
    dp.include_router(admin.router)

    # Init Google Sheets headers on startup
    ensure_headers()

    logging.info("Bot started (polling mode)")
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())


if __name__ == "__main__":
    asyncio.run(main())
