#!/usr/bin/env bash
set -e

TITLE="${1:-}"
if [ -z "$TITLE" ]; then
  echo "Usage: ./new-spec.sh \"My Spec Title\""
  exit 1
fi

SPECIFY_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE="$SPECIFY_ROOT/templates/spec-template.md"
STAMP="$(date +%F)"
SAFE="$(echo "$TITLE" | tr -cd '[:alnum:] _-' | sed -E 's/[[:space:]]+/-/g' | sed -E 's/^-+|-+$//g')"

OUTDIR="$SPECIFY_ROOT/../history/prompts/001-todo-list"
mkdir -p "$OUTDIR"

OUTFILE="$OUTDIR/${STAMP}-spec-${SAFE}.md"
sed "s/<TITLE>/${TITLE}/g" "$TEMPLATE" > "$OUTFILE"

echo "✅ New spec created: $OUTFILE"
