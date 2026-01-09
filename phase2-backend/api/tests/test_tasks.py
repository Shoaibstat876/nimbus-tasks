# tests/test_tasks.py

import os
from fastapi.testclient import TestClient

from app.main import app


TASKS_BASE = "/api/tasks"


def _login(client: TestClient) -> str:
    """
    Auth Gate helper: login using seeded user from conftest.py.
    """
    email = os.getenv("TEST_USER_EMAIL")
    password = os.getenv("TEST_USER_PASSWORD")
    assert email and password, "TEST_USER_EMAIL / TEST_USER_PASSWORD not set (check conftest.py)"

    r = client.post(
        "/api/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"

    data = r.json()
    assert "access_token" in data
    return data["access_token"]


def _post_task(client: TestClient, headers: dict, title: str) -> dict:
    r = client.post(TASKS_BASE, json={"title": title}, headers=headers)
    assert r.status_code == 201, f"Create failed: {r.status_code} {r.text}"

    task = r.json()
    assert isinstance(task.get("id"), int)
    assert task.get("title") == title
    assert task.get("user_id") is not None
    return task


def _list_tasks(client: TestClient, headers: dict) -> list:
    r = client.get(TASKS_BASE, headers=headers)
    assert r.status_code == 200, f"List failed: {r.status_code} {r.text}"

    items = r.json()
    assert isinstance(items, list)
    return items


def _put_task(client: TestClient, headers: dict, task_id: int, title: str) -> dict:
    r = client.put(f"{TASKS_BASE}/{task_id}", json={"title": title}, headers=headers)
    assert r.status_code == 200, f"Update failed: {r.status_code} {r.text}"
    return r.json()


def _toggle_task(client: TestClient, headers: dict, task_id: int) -> dict:
    r = client.patch(f"{TASKS_BASE}/{task_id}/toggle", headers=headers)
    assert r.status_code == 200, f"Toggle failed: {r.status_code} {r.text}"
    return r.json()


def _delete_task(client: TestClient, headers: dict, task_id: int) -> None:
    r = client.delete(f"{TASKS_BASE}/{task_id}", headers=headers)
    assert r.status_code == 204, f"Delete failed: {r.status_code} {r.text}"


def test_tasks_crud_flow():
    """
    CRUD Gate (Owner-only):
    - Create → List → Update → Toggle → Delete → List verifies removal
    """
    with TestClient(app) as client:
        token = _login(client)
        headers = {"Authorization": f"Bearer {token}"}

        created = _post_task(client, headers, "Test Task 1")
        task_id = created["id"]

        items = _list_tasks(client, headers)
        assert any(t.get("id") == task_id for t in items)

        updated = _put_task(client, headers, task_id, "Updated")
        assert updated.get("id") == task_id
        assert updated.get("title") == "Updated"

        toggled = _toggle_task(client, headers, task_id)
        assert toggled.get("id") == task_id

        _delete_task(client, headers, task_id)

        items2 = _list_tasks(client, headers)
        assert all(t.get("id") != task_id for t in items2)



##run this in terminal
## cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
## .\.venv\Scripts\Activate.ps1
## python -m pytest -q tests\test_tasks.py

