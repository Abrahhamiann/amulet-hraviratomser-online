import html
import logging
import math
import os
from datetime import datetime
from urllib.parse import urlparse

from dotenv import load_dotenv
from telegram import (
    BotCommand,
    BotCommandScopeAllPrivateChats,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Update,
)
from telegram.constants import ChatType, ParseMode
from telegram.error import BadRequest
from telegram.ext import (
    Application,
    ApplicationBuilder,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
)

from api import AmuletApi, AmuletApiError
from i18n import LANGUAGE_NAMES, LANGUAGES, normalize_language, tr

load_dotenv()
logging.basicConfig(
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    level=logging.INFO,
)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
LOGGER = logging.getLogger("amulet_bot")
PAGE_SIZE = 5

API = AmuletApi(
    os.getenv("TELEGRAM_BOT_API_URL", "http://127.0.0.1:5000/api/telegram/bot"),
    os.getenv("TELEGRAM_BOT_API_SECRET", ""),
)


def user_language(context: ContextTypes.DEFAULT_TYPE) -> str:
    return normalize_language(context.user_data.get("language"), "en")


def main_menu(language: str, notifications_enabled: bool = True) -> InlineKeyboardMarkup:
    notification_label = tr(
        language,
        "notifications_on" if notifications_enabled else "notifications_off",
    )
    return InlineKeyboardMarkup([
        [InlineKeyboardButton(f"💌 {tr(language, 'invitations')}", callback_data="menu:invitations")],
        [
            InlineKeyboardButton(f"🌐 {tr(language, 'language')}", callback_data="menu:language"),
            InlineKeyboardButton(f"🔔 {notification_label}", callback_data="notif:toggle"),
        ],
        [InlineKeyboardButton(f"ℹ️ {tr(language, 'help')}", callback_data="menu:help")],
        [InlineKeyboardButton(f"🔌 {tr(language, 'disconnect')}", callback_data="disconnect:ask")],
    ])


def back_button(language: str, target: str = "menu:home") -> list[InlineKeyboardButton]:
    return [InlineKeyboardButton(f"← {tr(language, 'back')}", callback_data=target)]


async def edit_or_reply(update: Update, text: str, reply_markup=None):
    if update.callback_query:
        try:
            await update.callback_query.edit_message_text(
                text=text,
                parse_mode=ParseMode.HTML,
                reply_markup=reply_markup,
                disable_web_page_preview=True,
            )
        except BadRequest as exc:
            if "message is not modified" not in str(exc).lower():
                raise
    elif update.effective_message:
        await update.effective_message.reply_text(
            text=text,
            parse_mode=ParseMode.HTML,
            reply_markup=reply_markup,
            disable_web_page_preview=True,
        )


async def load_account(update: Update, context: ContextTypes.DEFAULT_TYPE):
    account = await API.account(update.effective_chat.id)
    context.user_data["language"] = normalize_language(account.get("language"), "en")
    context.user_data["notificationsEnabled"] = account.get("notificationsEnabled", True)
    return account


async def show_home(update: Update, context: ContextTypes.DEFAULT_TYPE, welcome_key: str = "menu_title"):
    try:
        account = await load_account(update, context)
    except AmuletApiError as exc:
        language = normalize_language(update.effective_user.language_code, "en")
        await edit_or_reply(
            update,
            tr(language, "not_connected" if exc.status_code == 404 else "error"),
        )
        return

    language = user_language(context)
    values = {"name": html.escape(account.get("name") or update.effective_user.first_name or "")}
    await edit_or_reply(
        update,
        tr(language, welcome_key, **values),
        main_menu(language, account.get("notificationsEnabled", True)),
    )


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_chat.type != ChatType.PRIVATE:
        return

    token = context.args[0] if context.args else ""
    if token:
        telegram_user = update.effective_user
        try:
            result = await API.connect({
                "token": token,
                "chatId": str(update.effective_chat.id),
                "telegramUserId": str(telegram_user.id),
                "username": telegram_user.username or "",
                "firstName": telegram_user.first_name or "",
                "languageCode": telegram_user.language_code or "",
            })
        except AmuletApiError as exc:
            language = normalize_language(telegram_user.language_code, "en")
            await update.effective_message.reply_text(
                tr(language, "expired" if exc.status_code == 400 else "error"),
                parse_mode=ParseMode.HTML,
            )
            return

        context.user_data["language"] = normalize_language(result.get("language"), "en")
        context.user_data["notificationsEnabled"] = True
        await show_home(update, context, "welcome")
        return

    await show_home(update, context, "welcome_back")


async def show_invitations(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        account = await load_account(update, context)
    except AmuletApiError as exc:
        language = user_language(context)
        await edit_or_reply(update, tr(language, "not_connected" if exc.status_code == 404 else "error"))
        return

    language = user_language(context)
    invitations = [item for item in account.get("invitations", []) if item.get("id")]
    if not invitations:
        await edit_or_reply(
            update,
            tr(language, "no_invitations"),
            InlineKeyboardMarkup([back_button(language)]),
        )
        return

    keyboard = [
        [InlineKeyboardButton(
            f"💌 {item.get('title') or item.get('templateTitle')}",
            callback_data=f"inv:{item['id']}",
        )]
        for item in invitations[:40]
    ]
    keyboard.append(back_button(language))
    await edit_or_reply(
        update,
        tr(language, "invitations_title"),
        InlineKeyboardMarkup(keyboard),
    )


def format_date(value: str | None) -> str:
    if not value:
        return "—"
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).strftime("%d.%m.%Y")
    except ValueError:
        return value[:10]


def is_public_web_url(value: str | None) -> bool:
    if not value:
        return False
    try:
        parsed = urlparse(value)
    except ValueError:
        return False
    hostname = (parsed.hostname or "").lower()
    return (
        parsed.scheme in {"http", "https"}
        and bool(hostname)
        and hostname not in {"localhost", "127.0.0.1", "::1"}
        and not hostname.endswith(".local")
    )


async def show_invitation(update: Update, context: ContextTypes.DEFAULT_TYPE, invitation_id: str):
    language = user_language(context)
    try:
        data = await API.invitation(update.effective_chat.id, invitation_id)
    except AmuletApiError:
        await edit_or_reply(update, tr(language, "error"), InlineKeyboardMarkup([back_button(language, "menu:invitations")]))
        return

    invitation = data["invitation"]
    summary = invitation.get("summary", {})
    text = tr(
        language,
        "invitation_details",
        title=html.escape(invitation.get("title") or "—"),
        template=html.escape(invitation.get("templateTitle") or "—"),
        date=format_date(invitation.get("date")),
        time=html.escape(invitation.get("time") or "—"),
        location=html.escape(invitation.get("location") or "—"),
        replies=summary.get("replies", 0),
        guests=summary.get("guests", 0),
    )
    invitation_url = invitation.get("url")
    if invitation_url:
        text = f"{text}\n\n<b>{tr(language, 'invitation_url')}:</b>\n<code>{html.escape(invitation_url)}</code>"

    keyboard = []
    if is_public_web_url(invitation_url):
        keyboard.append([InlineKeyboardButton(f"↗ {tr(language, 'open_invitation')}", url=invitation_url)])
    if invitation.get("ready"):
        keyboard.append([InlineKeyboardButton(
            f"👥 {tr(language, 'guest_replies')} ({summary.get('replies', 0)})",
            callback_data=f"rsvp:{invitation_id}:0",
        )])
    keyboard.append(back_button(language, "menu:invitations"))
    await edit_or_reply(update, text, InlineKeyboardMarkup(keyboard))


async def show_replies(update: Update, context: ContextTypes.DEFAULT_TYPE, invitation_id: str, page: int):
    language = user_language(context)
    try:
        data = await API.invitation(update.effective_chat.id, invitation_id)
    except AmuletApiError:
        await edit_or_reply(update, tr(language, "error"), InlineKeyboardMarkup([back_button(language, f"inv:{invitation_id}")]))
        return

    rsvps = data.get("rsvps", [])
    if not rsvps:
        await edit_or_reply(
            update,
            tr(language, "no_replies"),
            InlineKeyboardMarkup([back_button(language, f"inv:{invitation_id}")]),
        )
        return

    pages = max(1, math.ceil(len(rsvps) / PAGE_SIZE))
    page = min(max(page, 0), pages - 1)
    items = []
    status_icons = {"attending": "✅", "declined": "❌", "unsure": "❔"}
    for rsvp in rsvps[page * PAGE_SIZE:(page + 1) * PAGE_SIZE]:
        raw_message = rsvp.get("message") or ""
        short_message = f"{raw_message[:279]}…" if len(raw_message) > 280 else raw_message
        message = f"\n💬 {html.escape(short_message)}" if short_message else ""
        items.append(tr(
            language,
            "reply_item",
            icon=status_icons.get(rsvp.get("status"), "•"),
            name=html.escape(rsvp.get("guestName") or "—"),
            count=tr(language, "guests", count=rsvp.get("guestCount") or 1),
            status=tr(language, rsvp.get("status", "unsure")),
            phone=html.escape(rsvp.get("phone") or "—"),
            message=message,
        ))

    navigation = []
    if page > 0:
        navigation.append(InlineKeyboardButton(
            f"← {tr(language, 'previous')}",
            callback_data=f"rsvp:{invitation_id}:{page - 1}",
        ))
    if page < pages - 1:
        navigation.append(InlineKeyboardButton(
            f"{tr(language, 'next')} →",
            callback_data=f"rsvp:{invitation_id}:{page + 1}",
        ))
    keyboard = ([navigation] if navigation else [])
    keyboard.append(back_button(language, f"inv:{invitation_id}"))
    await edit_or_reply(
        update,
        tr(
            language,
            "replies_title",
            title=html.escape(data["invitation"].get("title") or "—"),
            page=page + 1,
            pages=pages,
            items="\n\n".join(items),
        ),
        InlineKeyboardMarkup(keyboard),
    )


async def choose_language(update: Update, context: ContextTypes.DEFAULT_TYPE):
    language = user_language(context)
    rows = [
        [InlineKeyboardButton(LANGUAGE_NAMES[code], callback_data=f"lang:{code}")]
        for code in LANGUAGES
    ]
    rows.append(back_button(language))
    await edit_or_reply(update, tr(language, "choose_language"), InlineKeyboardMarkup(rows))


async def set_language(update: Update, context: ContextTypes.DEFAULT_TYPE, language: str):
    language = normalize_language(language, "en")
    try:
        await API.settings(update.effective_chat.id, language=language)
    except AmuletApiError:
        await edit_or_reply(update, tr(user_language(context), "error"))
        return
    context.user_data["language"] = language
    await show_home(update, context)


async def toggle_notifications(update: Update, context: ContextTypes.DEFAULT_TYPE):
    language = user_language(context)
    enabled = not context.user_data.get("notificationsEnabled", True)
    try:
        await API.settings(update.effective_chat.id, notificationsEnabled=enabled)
    except AmuletApiError:
        await edit_or_reply(update, tr(language, "error"))
        return
    context.user_data["notificationsEnabled"] = enabled
    await show_home(update, context)


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        await load_account(update, context)
    except AmuletApiError as exc:
        language = user_language(context)
        await edit_or_reply(update, tr(language, "not_connected" if exc.status_code == 404 else "error"))
        return
    language = user_language(context)
    await edit_or_reply(
        update,
        tr(language, "help_text"),
        InlineKeyboardMarkup([back_button(language)]),
    )


async def ask_disconnect(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        await load_account(update, context)
    except AmuletApiError as exc:
        language = user_language(context)
        await edit_or_reply(update, tr(language, "not_connected" if exc.status_code == 404 else "error"))
        return
    language = user_language(context)
    await edit_or_reply(
        update,
        tr(language, "disconnect_confirm"),
        InlineKeyboardMarkup([
            [InlineKeyboardButton(tr(language, "disconnect_yes"), callback_data="disconnect:yes")],
            [InlineKeyboardButton(tr(language, "cancel"), callback_data="menu:home")],
        ]),
    )


async def disconnect(update: Update, context: ContextTypes.DEFAULT_TYPE):
    language = user_language(context)
    try:
        await API.disconnect(update.effective_chat.id)
    except AmuletApiError:
        await edit_or_reply(update, tr(language, "error"))
        return
    context.user_data.clear()
    await edit_or_reply(update, tr(language, "disconnected"))


async def callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data or ""

    if data == "menu:home":
        await show_home(update, context)
    elif data == "menu:invitations":
        await show_invitations(update, context)
    elif data == "menu:language":
        await choose_language(update, context)
    elif data == "menu:help":
        await help_command(update, context)
    elif data == "notif:toggle":
        await toggle_notifications(update, context)
    elif data == "disconnect:ask":
        await ask_disconnect(update, context)
    elif data == "disconnect:yes":
        await disconnect(update, context)
    elif data.startswith("lang:"):
        await set_language(update, context, data.split(":", 1)[1])
    elif data.startswith("inv:"):
        await show_invitation(update, context, data.split(":", 1)[1])
    elif data.startswith("rsvp:"):
        _, invitation_id, page = data.split(":", 2)
        await show_replies(update, context, invitation_id, int(page))


async def invitations_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await show_invitations(update, context)


async def language_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        await load_account(update, context)
    except AmuletApiError as exc:
        language = user_language(context)
        await edit_or_reply(update, tr(language, "not_connected" if exc.status_code == 404 else "error"))
        return
    await choose_language(update, context)


async def notifications_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        await load_account(update, context)
    except AmuletApiError:
        await edit_or_reply(update, tr(user_language(context), "not_connected"))
        return
    await toggle_notifications(update, context)


async def disconnect_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await ask_disconnect(update, context)


async def post_init(application: Application):
    command_descriptions = {
        "en": ("Open Amulet menu", "View purchased invitations", "Change language", "Toggle RSVP notifications", "How the bot works", "Disconnect Telegram"),
        "hy": ("Բացել Amulet ցանկը", "Դիտել գնված հրավիրատոմսերը", "Փոխել լեզուն", "Միացնել կամ անջատել ծանուցումները", "Ինչպես է աշխատում բոտը", "Անջատել Telegram-ը"),
        "ru": ("Открыть меню Amulet", "Показать купленные приглашения", "Изменить язык", "Включить или выключить уведомления", "Как работает бот", "Отключить Telegram"),
        "es": ("Abrir el menú de Amulet", "Ver invitaciones compradas", "Cambiar idioma", "Activar o pausar notificaciones", "Cómo funciona el bot", "Desconectar Telegram"),
        "fr": ("Ouvrir le menu Amulet", "Voir les invitations achetées", "Changer de langue", "Activer ou suspendre les notifications", "Fonctionnement du bot", "Déconnecter Telegram"),
        "de": ("Amulet-Menü öffnen", "Gekaufte Einladungen anzeigen", "Sprache ändern", "Benachrichtigungen ein- oder ausschalten", "So funktioniert der Bot", "Telegram trennen"),
        "it": ("Apri il menu Amulet", "Vedi gli inviti acquistati", "Cambia lingua", "Attiva o sospendi le notifiche", "Come funziona il bot", "Scollega Telegram"),
    }
    command_names = ("start", "invitations", "language", "notifications", "help", "disconnect")
    commands = [
        BotCommand(name, description)
        for name, description in zip(command_names, command_descriptions["en"])
    ]
    await application.bot.set_my_commands(
        commands,
        scope=BotCommandScopeAllPrivateChats(),
    )
    for language in LANGUAGES:
        localized_commands = [
            BotCommand(name, description)
            for name, description in zip(command_names, command_descriptions[language])
        ]
        await application.bot.set_my_commands(
            localized_commands,
            scope=BotCommandScopeAllPrivateChats(),
            language_code=language,
        )


async def on_error(update: object, context: ContextTypes.DEFAULT_TYPE):
    LOGGER.exception("Unhandled bot error", exc_info=context.error)
    if isinstance(update, Update) and update.callback_query and update.effective_message:
        language = user_language(context)
        try:
            await update.effective_message.reply_text(
                tr(language, "error"),
                parse_mode=ParseMode.HTML,
            )
        except Exception:
            LOGGER.exception("Could not show callback error to the user")


def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    secret = os.getenv("TELEGRAM_BOT_API_SECRET", "").strip()
    if not token or not secret:
        raise RuntimeError("TELEGRAM_BOT_TOKEN and TELEGRAM_BOT_API_SECRET are required")

    application = ApplicationBuilder().token(token).post_init(post_init).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("invitations", invitations_command))
    application.add_handler(CommandHandler("language", language_command))
    application.add_handler(CommandHandler("notifications", notifications_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("disconnect", disconnect_command))
    application.add_handler(CallbackQueryHandler(callback))
    application.add_error_handler(on_error)
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
