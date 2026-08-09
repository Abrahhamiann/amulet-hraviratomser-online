import httpx


class AmuletApiError(RuntimeError):
    def __init__(self, message: str, status_code: int = 0):
        super().__init__(message)
        self.status_code = status_code


class AmuletApi:
    def __init__(self, base_url: str, secret: str):
        self.base_url = base_url.rstrip("/")
        self.headers = {"x-telegram-bot-secret": secret}

    async def _request(self, method: str, path: str, **kwargs):
        try:
            async with httpx.AsyncClient(timeout=12.0, headers=self.headers) as client:
                response = await client.request(method, f"{self.base_url}{path}", **kwargs)
        except httpx.HTTPError as exc:
            raise AmuletApiError("Amulet API is unavailable") from exc

        if response.is_error:
            try:
                message = response.json().get("message", "Amulet API request failed")
            except ValueError:
                message = "Amulet API request failed"
            raise AmuletApiError(message, response.status_code)
        return response.json()

    async def connect(self, payload: dict):
        return await self._request("POST", "/connect", json=payload)

    async def account(self, chat_id: int | str):
        return await self._request("GET", "/account", params={"chatId": str(chat_id)})

    async def invitation(self, chat_id: int | str, invitation_id: str):
        return await self._request(
            "GET",
            f"/invitations/{invitation_id}",
            params={"chatId": str(chat_id)},
        )

    async def settings(self, chat_id: int | str, **settings):
        return await self._request(
            "PATCH",
            "/settings",
            json={"chatId": str(chat_id), **settings},
        )

    async def disconnect(self, chat_id: int | str):
        return await self._request(
            "DELETE",
            "/disconnect",
            json={"chatId": str(chat_id)},
        )

    async def admin_dashboard(self, chat_id: int | str):
        return await self._request(
            "GET",
            "/admin/dashboard",
            params={"chatId": str(chat_id)},
        )

    async def admin_orders(self, chat_id: int | str, page: int = 0):
        return await self._request(
            "GET",
            "/admin/orders",
            params={"chatId": str(chat_id), "page": page},
        )

    async def admin_order(self, chat_id: int | str, order_id: str):
        return await self._request(
            "GET",
            f"/admin/orders/{order_id}",
            params={"chatId": str(chat_id)},
        )

    async def admin_messages(self, chat_id: int | str, page: int = 0):
        return await self._request(
            "GET",
            "/admin/messages",
            params={"chatId": str(chat_id), "page": page},
        )

    async def admin_delete_all_messages(self, chat_id: int | str):
        return await self._request(
            "DELETE",
            "/admin/messages",
            json={"chatId": str(chat_id)},
        )

    async def admin_message(self, chat_id: int | str, message_id: str):
        return await self._request(
            "GET",
            f"/admin/messages/{message_id}",
            params={"chatId": str(chat_id)},
        )

    async def admin_reply(
        self,
        chat_id: int | str,
        message_id: str,
        message: str,
    ):
        return await self._request(
            "POST",
            f"/admin/messages/{message_id}/reply",
            json={
                "chatId": str(chat_id),
                "subject": "Reply from Amulet",
                "message": message,
            },
        )
