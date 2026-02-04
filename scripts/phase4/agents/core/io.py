from __future__ import annotations

import subprocess
from dataclasses import dataclass
from typing import List, Optional


@dataclass
class CmdOutput:
    returncode: int
    stdout: str
    stderr: str


def run_cmd(cmd: List[str], timeout_sec: int = 120, cwd: Optional[str] = None) -> CmdOutput:
    """
    Runs a command safely (no shell=True) and captures stdout/stderr.
    Works on Windows PowerShell terminal too.
    """
    p = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=timeout_sec,
        cwd=cwd,
    )
    return CmdOutput(returncode=p.returncode, stdout=p.stdout, stderr=p.stderr)
