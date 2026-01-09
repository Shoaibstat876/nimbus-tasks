# tests/test_health.py

from fastapi.testclient import TestClient

from app.main import app


def test_health_ok():
    """
    Health Gate:
    - Endpoint: GET /api/health
    - Contract: { "ok": true }
    """
    with TestClient(app) as client:
        r = client.get("/api/health")

    assert r.status_code == 200

    data = r.json()
    assert data == {"ok": True}
