import bcrypt


# ============================================================
# BCRYPT PASSWORD LIMIT
# ============================================================
#
# bcrypt only supports passwords up to 72 bytes.
#
# We truncate UTF-8 bytes consistently during both
# hashing and verification so the same password works.
# ============================================================

BCRYPT_MAX_BYTES = 72


def _prepare_password(password: str) -> bytes:
    """
    Convert password to UTF-8 bytes and limit it to
    bcrypt's 72-byte maximum.
    """

    if password is None:
        password = ""

    if not isinstance(password, str):
        password = str(password)

    password_bytes = password.encode("utf-8")

    return password_bytes[:BCRYPT_MAX_BYTES]


# ============================================================
# HASH PASSWORD
# ============================================================

def hash_password(password: str) -> str:
    """
    Hash password using bcrypt.
    """

    password_bytes = _prepare_password(password)

    salt = bcrypt.gensalt()

    hashed = bcrypt.hashpw(
        password_bytes,
        salt
    )

    return hashed.decode("utf-8")


# ============================================================
# VERIFY PASSWORD
# ============================================================

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Verify password against bcrypt hash.
    """

    if not hashed_password:
        return False

    try:

        password_bytes = _prepare_password(
            plain_password
        )

        hashed_bytes = hashed_password.encode("utf-8")

        return bcrypt.checkpw(
            password_bytes,
            hashed_bytes
        )

    except Exception as e:

        print("PASSWORD VERIFY ERROR:", e)

        return False