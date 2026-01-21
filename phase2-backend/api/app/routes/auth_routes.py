# app/routes/auth_routes.py

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlmodel import Session, select

from ..database import get_session
from ..models import User
from ..auth import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["auth"])

# Swagger OAuth2 "Authorize" uses password flow and hits tokenUrl with FORM DATA
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# =========================
# Schemas
# =========================

class RegisterIn(BaseModel):
    email: EmailStr
    password: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str


class UserOut(BaseModel):
    id: int
    email: EmailStr


class RegisterOut(BaseModel):
    ok: bool
    id: int
    email: EmailStr


# =========================
# Helpers
# =========================

def normalize_email(v: str) -> str:
    return (v or "").strip().lower()


def _validate_register_payload(raw: dict) -> RegisterIn:
    # Pydantic v2 / v1 compatibility
    try:
        return RegisterIn.model_validate(raw)  # type: ignore[attr-defined]
    except AttributeError:
        return RegisterIn.parse_obj(raw)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> User:
    sub = decode_token(token)
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    try:
        user_id = int(sub)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")

    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


async def _read_register_payload(request: Request) -> dict:
    """
    Robust payload reader:
    - JSON
    - JSON with wrong headers
    - Form-data
    Prevents 422 json_invalid forever.
    """
    content_type = (request.headers.get("content-type") or "").lower()

    # 1) Proper JSON
    if "application/json" in content_type:
        try:
            raw = await request.json()
            if isinstance(raw, dict):
                return raw
            raise HTTPException(status_code=400, detail="JSON body must be an object")
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON body")

    # 2) Try JSON even if headers are wrong
    try:
        body = await request.body()
        text = body.decode("utf-8", errors="ignore").strip()
    except Exception:
        text = ""

    if text.startswith("{") and text.endswith("}"):
        try:
            raw = await request.json()
            if isinstance(raw, dict):
                return raw
        except Exception:
            pass

    # 3) Fallback to form
    try:
        form = await request.form()
        return dict(form)
    except Exception:
        raise HTTPException(status_code=400, detail="Unsupported or empty request body")


# =========================
# Routes
# =========================

@router.post("/register", response_model=RegisterOut, status_code=status.HTTP_201_CREATED)
async def register(request: Request, session: Session = Depends(get_session)):
    raw = await _read_register_payload(request)
    data = _validate_register_payload(raw)

    email = normalize_email(data.email)
    password = (data.password or "").strip()

    if len(password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password too short (min 6)",
        )

    # Pre-check (fast path)
    existing = session.exec(select(User).where(User.email == email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(email=email, hashed_password=hash_password(password))

    try:
        session.add(user)
        session.commit()
        session.refresh(user)

    except Exception:
        session.rollback()

        # Handle race-condition / unique constraint safely
        existing_after = session.exec(select(User).where(User.email == email)).first()
        if existing_after:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # True DB failure
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error during registration",
        )

    return {"ok": True, "id": user.id, "email": user.email}


@router.post("/login", response_model=TokenOut)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    email = normalize_email(form_data.username)
    password = form_data.password or ""

    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login/json", response_model=TokenOut)
def login_json(data: LoginIn, session: Session = Depends(get_session)):
    email = normalize_email(data.email)
    password = (data.password or "").strip()

    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email}


@router.post("/logout")
def logout():
    return {"ok": True}
