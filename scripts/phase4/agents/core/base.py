from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, Any


@dataclass
class AgentResult:
    ok: bool
    summary: str
    artifacts: Dict[str, str]
    meta: Dict[str, Any]


class BaseAgent:
    """
    Minimal Agent contract:
    - run(task: str, **kwargs) -> AgentResult
    """

    name: str = "base"

    def run(self, task: str, **kwargs) -> AgentResult:
        raise NotImplementedError("Agent must implement run()")

    @staticmethod
    def utc_stamp() -> str:
        return datetime.utcnow().strftime("%Y%m%d-%H%M%S")

    @staticmethod
    def ensure_dir(path: Path) -> None:
        path.mkdir(parents=True, exist_ok=True)
