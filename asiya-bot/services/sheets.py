"""Google Sheets integration — writes new applications."""
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
from config import GOOGLE_CREDS_PATH, GOOGLE_SHEET_ID

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

HEADERS = [
    "Дата", "Имя", "Возраст", "Читает Коран",
    "Уровень", "Сложности", "Для кого",
    "Онлайн", "Контакт", "Статус",
]


def _get_sheet():
    creds = Credentials.from_service_account_file(GOOGLE_CREDS_PATH, scopes=SCOPES)
    client = gspread.authorize(creds)
    return client.open_by_key(GOOGLE_SHEET_ID).sheet1


def ensure_headers():
    """Create headers on first launch if sheet is empty."""
    try:
        sheet = _get_sheet()
        if not sheet.row_values(1):
            sheet.append_row(HEADERS)
    except Exception:
        pass


def append_application(data: dict) -> bool:
    try:
        sheet = _get_sheet()
        now = datetime.now().strftime("%d.%m.%Y %H:%M")
        sheet.append_row([
            now,
            data.get("name", "—"),
            data.get("age", "—"),
            data.get("reads_quran", "—"),
            data.get("level", "—"),
            data.get("difficulties", "—"),
            data.get("for_whom", "—"),
            data.get("online_ok", "—"),
            data.get("contact", "—"),
            "Новая",
        ])
        return True
    except Exception as e:
        print(f"[Sheets] Error: {e}")
        return False
