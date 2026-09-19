import asyncio
import logging
import httpx
from shared.config import settings

logger = logging.getLogger("telegram_bot")

WELCOME_MESSAGE = (
    "👋 *Welcome to TalentFlow!*\n\n"
    "The #1 Telegram-native reverse employment marketplace platform in Ethiopia.\n\n"
    "💼 *For Job Seekers (Employees):*\n"
    "Create your profile, highlight your skills & work history, and let top companies discover & contact you directly.\n\n"
    "🏢 *For Employers & Recruiters:*\n"
    "Register your company, verify your business license, and browse pre-vetted candidates directly.\n\n"
    "Click the button below to launch the app! 👇"
)


async def send_welcome_message(chat_id: int):
    """Sends welcome message with Inline Keyboard WebApp launcher button."""
    url = f"https://api.telegram.org/bot{settings.BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": WELCOME_MESSAGE,
        "parse_mode": "Markdown",
        "reply_markup": {
            "inline_keyboard": [
                [
                    {
                        "text": " Launch TalentFlow App",
                        "web_app": {"url": settings.WEBAPP_URL},
                    }
                ]
            ]
        },
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=10.0)
            res_data = response.json()
            logger.info(f"Welcome message sent to chat_id {chat_id}: {res_data.get('ok')}")
            return res_data
        except Exception as e:
            logger.error(f"Failed to send Telegram welcome message: {e}")
            return None


async def start_bot_polling():
    """Long-polling task to handle Telegram commands (/start)."""
    if not settings.BOT_TOKEN or settings.BOT_TOKEN == "your_telegram_bot_token_here":
        logger.warning("BOT_TOKEN is not configured. Skipping bot polling.")
        return

    offset = 0
    bot_url = f"https://api.telegram.org/bot{settings.BOT_TOKEN}"
    logger.info(f"Started Telegram bot polling daemon for WebApp URL: {settings.WEBAPP_URL}")

    async with httpx.AsyncClient(timeout=30.0) as client:
        while True:
            try:
                get_updates_url = f"{bot_url}/getUpdates?offset={offset}&timeout=20"
                res = await client.get(get_updates_url)
                if res.status_code == 200:
                    data = res.json()
                    if data.get("ok"):
                        for update in data.get("result", []):
                            offset = update["update_id"] + 1
                            message = update.get("message", {})
                            text = message.get("text", "")
                            chat_id = message.get("chat", {}).get("id")

                            if chat_id and (text.startswith("/start") or text.startswith("/help") or text):
                                await send_welcome_message(chat_id)
            except asyncio.CancelledError:
                logger.info("Bot polling loop cancelled.")
                break
            except Exception as e:
                logger.error(f"Error in bot polling loop: {e}")
                await asyncio.sleep(3)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(start_bot_polling())
