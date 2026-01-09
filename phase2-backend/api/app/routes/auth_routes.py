# app/routes/auth_routes.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlmodel import Session, select

from ..database import get_session
from ..models import User
from ..auth import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["auth"])

# IMPORTANT:
# Swagger OAuth2 "Authorize" uses password flow and hits tokenUrl with FORM DATA:
#   username=<email>&password=<password>
# So our /login must accept OAuth2PasswordRequestForm.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class RegisterIn(BaseModel):
    email: EmailStr
    password: str


# Optional: keep JSON login for manual clients (Postman etc.)
class LoginIn(BaseModel):
    email: EmailStr
    password: str


# Response models (API Contract clarity)
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


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> User:
    """
    Reads Bearer token, decodes it, resolves the user, and returns the User row.
    """
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


@router.post("/register", response_model=RegisterOut, status_code=status.HTTP_201_CREATED)
def register(data: RegisterIn, session: Session = Depends(get_session)):
    email = data.email.strip().lower()

    if len(data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password too short (min 6)",
        )

    existing = session.exec(select(User).where(User.email == email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(email=email, hashed_password=hash_password(data.password))
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"ok": True, "id": user.id, "email": user.email}


@router.post("/login", response_model=TokenOut)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    """
    Swagger Authorize ✅
    Uses OAuth2 password flow:
      - username is the EMAIL
      - password is the PASSWORD
    """
    email = (form_data.username or "").strip().lower()

    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login/json", response_model=TokenOut)
def login_json(data: LoginIn, session: Session = Depends(get_session)):
    """
    Optional convenience endpoint (Postman / custom clients).
    Keeps your original JSON login behavior.
    """
    email = data.email.strip().lower()

    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(data.password, user.hashed_password):
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
    # Stateless JWT: client deletes token
    return {"ok": True}
