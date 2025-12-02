import bcrypt


def check_password(raw_password, hashed_password):
    return bcrypt.checkpw(raw_password.encode(), hashed_password.encode())


def hash_password(raw_password):
    hashed = bcrypt.hashpw(raw_password.encode(), bcrypt.gensalt())
    return hashed.decode()
