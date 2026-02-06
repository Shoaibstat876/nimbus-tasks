import os
import httpx

DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
STATESTORE_NAME = os.getenv("STATESTORE_NAME", "statestore")

def dapr_state_url(key: str) -> str:
    return f"http://127.0.0.1:{DAPR_HTTP_PORT}/v1.0/state/{STATESTORE_NAME}/{key}"

async def state_get(key: str) -> bool:
    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await client.get(dapr_state_url(key))
        return r.status_code == 200 and (r.text or "").strip() not in ("", "null")

async def state_put(key: str, value: str = "1") -> None:
    async with httpx.AsyncClient(timeout=5.0) as client:
        await client.post(
            f"http://127.0.0.1:{DAPR_HTTP_PORT}/v1.0/state/{STATESTORE_NAME}",
            json=[{"key": key, "value": value}],
        )
