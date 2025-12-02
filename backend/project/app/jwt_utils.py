# yourapp/jwt_utils.py
import jwt
import datetime
from .repo import get_user_by_user_id
from django.conf import settings

def generate_access_token(user):
    """
    Returns a JWT access token (short-lived).
    """
    iat = datetime.datetime.now()
    payload = {
        "iss": settings.JWT_ISSUER,
        "iat": iat,
        "exp": iat + settings.JWT_ACCESS_TOKEN_LIFETIME,
        "type": "access",
        "user_id": user["user_id"],
        "user_role": user["role"],
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token


def generate_refresh_token(user):
    """
    Returns a JWT refresh token (longer-lived).
    """
    iat = datetime.datetime.now()
    payload = {
        "iss": settings.JWT_ISSUER,
        "iat": iat,
        "exp": iat + settings.JWT_REFRESH_TOKEN_LIFETIME,
        "type": "refresh",
        "user_id": user["user_id"],
        "user_role": user["role"],
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token


def decode_token(token, verify_exp=True):
    """
    Decodes token and returns payload or raises jwt exceptions.
    """
    options = {"verify_exp": verify_exp}
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            options=options,
            issuer=settings.JWT_ISSUER,
        )
    except jwt.ExpiredSignatureError or jwt.InvalidTokenError:
        raise
    return payload


def get_user_id(payload):
    user_id = payload.get("user_id")
    if user_id is None:
        raise Exception("invalid token")
    return user_id


def refresh_access_token(refresh_token):
    try:
        payload = decode_token(refresh_token)
    except jwt.ExpiredSignatureError or jwt.InvalidTokenError:
        raise
    if payload is None or payload.get("type") != "refresh":
        raise Exception("Invalid refresh token")

    user_id = payload["user_id"]
    user = get_user_by_user_id(user_id)
    new_access = generate_access_token(user)
    return new_access
