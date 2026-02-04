from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class SkillResult:
    ok: bool
    data: Dict[str, Any]
    message: str


class BaseSkill:
    name: str = "skill"

    def execute(self, **kwargs) -> SkillResult:
        raise NotImplementedError("Skill must implement execute()")
