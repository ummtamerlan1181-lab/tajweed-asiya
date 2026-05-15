import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN: str = os.environ["BOT_TOKEN"]
ADMIN_CHAT_ID: int = int(os.environ["ADMIN_CHAT_ID"])
GOOGLE_SHEET_ID: str = os.environ.get("GOOGLE_SHEET_ID", "")
GOOGLE_CREDS_PATH: str = os.environ.get("GOOGLE_CREDS_PATH", "creds.json")

ASIYA_TG = "https://t.me/Asiya_um"
