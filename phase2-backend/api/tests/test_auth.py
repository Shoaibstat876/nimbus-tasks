# tests/test_auth.py

import os

from fastapi.testclient import TestClient

from app.main import app


def test_login_invalid_credentials_fails():
    with TestClient(app) as client:
        r = client.post(
            "/api/auth/login",
            data={"username": "wrong@example.com", "password": "wrongpass"},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        assert r.status_code == 401


def test_login_success_seeded_user_and_me():
    email = os.getenv("TEST_USER_EMAIL")
    password = os.getenv("TEST_USER_PASSWORD")
    assert email and password

    with TestClient(app) as client:
        r = client.post(
            "/api/auth/login",
            data={"username": email, "password": password},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        assert r.status_code == 200

        data = r.json()
        assert "access_token" in data
        assert data.get("token_type") == "bearer"

        token = data["access_token"]
        me = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert me.status_code == 200

        me_data = me.json()
        assert me_data.get("email") == email
        assert isinstance(me_data.get("id"), int)
