# Vexora Studio Bot

Premium Telegram-бот для AI web studio. Node.js + Telegraf + Google Sheets.

---

## Быстрый старт

### 1. Установить Node.js

Скачать: https://nodejs.org → версия LTS.
Проверить в терминале: `node -v` → должно быть `v18+`

### 2. Установить зависимости

Открыть папку `vexora-bot` в VS Code → Terminal → New Terminal:

```
npm install
```

### 3. Создать бота в Telegram

1. Написать @BotFather → `/newbot`
2. Придумать имя и username
3. Скопировать токен вида `1234567890:AAF...`

### 4. Узнать свой Telegram ID

Написать @userinfobot → он ответит вашим `id` (число)

### 5. Настроить .env

Скопировать файл `.env.example` → переименовать в `.env`
Открыть и заполнить:

```
BOT_TOKEN=сюда_вставить_токен_от_BotFather
ADMIN_CHAT_ID=сюда_вставить_свой_id
GOOGLE_SHEET_ID=сюда_id_таблицы (необязательно)
GOOGLE_CREDS_PATH=creds.json
```

### 6. Запустить

```
npm start
```

Бот запустился — напишите ему `/start` в Telegram.

---

## Подключение Google Sheets (необязательно)

Нужно, чтобы заявки автоматически сохранялись в таблицу.

### Шаг 1: Создать Service Account в Google Cloud

1. Перейти: https://console.cloud.google.com
2. Создать новый проект (например, `vexora-bot`)
3. APIs & Services → Library → найти **Google Sheets API** → Enable
4. APIs & Services → Credentials → Create Credentials → **Service Account**
5. Заполнить имя → Create → Skip permissions → Done
6. Нажать на созданный аккаунт → Keys → Add Key → JSON
7. Скачается файл — переименовать в `creds.json` и положить в папку `vexora-bot/`

### Шаг 2: Настроить Google Sheet

1. Создать новую таблицу на drive.google.com
2. Добавить лист с именем `Заявки`
3. Скопировать ID таблицы из URL:
   `docs.google.com/spreadsheets/d/**ВОТ_ЭТО**/edit`
4. Открыть таблицу → Поделиться → добавить email сервисного аккаунта (из `creds.json`, поле `client_email`) с правами редактора

### Шаг 3: Добавить ID в .env

```
GOOGLE_SHEET_ID=скопированный_id_таблицы
```

---

## Структура папок

```
vexora-bot/
├── src/
│   ├── bot.js         — запуск, все обработчики кнопок
│   ├── config.js      — переменные окружения
│   ├── messages.js    — все тексты бота
│   ├── keyboards.js   — все кнопки
│   ├── sheets.js      — запись в Google Sheets
│   └── scenes/
│       └── apply.js   — пошаговая анкета (wizard)
├── .env               — секреты (не коммитить!)
├── .env.example       — шаблон
├── package.json
└── Procfile           — для деплоя на Railway
```

---

## Деплой на Railway (24/7)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

Переменные окружения добавить в Railway Dashboard → Variables.
