from django.db import connection


def update_user_password(user_id, new_hashed_password):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE user SET password = %s WHERE user_id = %s",
                [new_hashed_password, user_id],
            )
            if cursor.rowcount == 0:
                raise Exception("User not found")
    except Exception:
        raise


def get_user_by_user_id(user_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM user WHERE user_id = %s",
                [user_id],
            )
            row = cursor.fetchone()
            user = zip_user(row, cursor.description)
            if user is None:
                raise Exception("user is not found")
            return user
    except Exception:
        raise


def get_user_by_email(email):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM user WHERE email = %s",
                [email],
            )
            row = cursor.fetchone()
            user = zip_user(row, cursor.description)
            if user is None:
                raise Exception("user is not found")
            return user
    except Exception:
        raise

def zip_user(row, description):
    if row is None:
        return None
    columns = [col[0] for col in description]
    user = dict(zip(columns, row))
    return user