from channels.middleware import BaseMiddleware
from django.db import close_old_connections

from app.jwt_utils import decode_token, get_user_id
from app.repo import get_user_by_user_id
from asgiref.sync import sync_to_async

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        scope["user"] = None

        # Query string: ?token=xxxx
        query_string = scope.get("query_string", b"").decode()
        token = None

        if "token=" in query_string:
            token = query_string.split("token=")[1].split("&")[0]

        if not token:
            return await super().__call__(scope, receive, send)

        try:
            payload = decode_token(token)
            user_id = get_user_id(payload)

            # wrap get_user_by_user_id in sync_to_async
            user = await sync_to_async(get_user_by_user_id)(user_id)

            if user:
                scope["user"] = user

        except Exception as e:
            print(f"WS JWT Auth Failed: {e}")
            scope["user"] = None

        return await super().__call__(scope, receive, send)
