from functools import wraps

from jwt import ExpiredSignatureError
from django.http import JsonResponse
from .jwt_utils import decode_token, get_user_id

def auth_user(func):
    @wraps(func)
    def wrap(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Missing token"}, status=400)
        
        token = auth_header.split(" ")[1]
        try:
            payload = decode_token(token)
            if payload is None:
                return JsonResponse({"error":"token is invalid"}, status=400)
            request.user_id = get_user_id(payload)
        except ExpiredSignatureError:
            return JsonResponse({"error": "token is expired"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
        return func(request, *args, **kwargs)
    return wrap