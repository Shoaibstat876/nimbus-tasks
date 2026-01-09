#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/memory" "$ROOT/scripts" "$ROOT/templates"
echo "✅ .specify folders ensured at: $ROOT"
