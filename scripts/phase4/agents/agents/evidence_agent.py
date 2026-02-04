from __future__ import annotations

from pathlib import Path
from typing import List, Optional

from ..core.base import BaseAgent, AgentResult
from ..core.io import run_cmd


class EvidenceAgent(BaseAgent):
    """
    EvidenceAgent:
    - runs a command
    - writes a timestamped log file under evidence/phase4/agents/
    - returns artifact path
    """
    name = "evidence"

    def __init__(self, repo_root: Path):
        self.repo_root = repo_root
        self.evidence_dir = self.repo_root / "evidence" / "phase4" / "agents"
        self.ensure_dir(self.evidence_dir)

    def run(
        self,
        task: str,
        cmd: List[str],
        timeout_sec: int = 180,
        label: Optional[str] = None,
    ) -> AgentResult:
        stamp = self.utc_stamp()
        safe_label = (label or "command").replace(" ", "_").replace("/", "_")
        out_path = self.evidence_dir / f"{stamp}-{self.name}-{safe_label}.log"

        result = run_cmd(cmd=cmd, timeout_sec=timeout_sec, cwd=str(self.repo_root))

        log = []
        log.append("=== PHASE4 EVIDENCE LOG ===")
        log.append(f"agent: {self.name}")
        log.append(f"task: {task}")
        log.append(f"cmd: {' '.join(cmd)}")
        log.append(f"returncode: {result.returncode}")
        log.append("")
        log.append("----- STDOUT -----")
        log.append(result.stdout.strip())
        log.append("")
        log.append("----- STDERR -----")
        log.append(result.stderr.strip())
        log.append("")

        out_path.write_text("\n".join(log), encoding="utf-8")

        ok = (result.returncode == 0)
        summary = "OK: evidence captured" if ok else "FAIL: command returned non-zero (evidence captured)"

        return AgentResult(
            ok=ok,
            summary=summary,
            artifacts={"log_file": str(out_path)},
            meta={"returncode": result.returncode},
        )
