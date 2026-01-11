#!/usr/bin/env bash

# set -e: Exit on error
# set -u: Exit on unset variables
# set -o pipefail: Capture non-zero exit codes in pipelines
set -euo pipefail

TITLE="${1:-}"
ID="${2:-000}" # Optional ID parameter for Law 7 compliance

if [ -z "$TITLE" ]; then
    echo "Usage: $0 \"Spec Title\" [ID]"
    exit 1
fi

# 1. Path Resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE="$ROOT/.specify/templates/spec-template.md"
SPECS_DIR="$ROOT/.specify/specs"

# 2. Validation
if [ ! -f "$TEMPLATE" ]; then
    echo "Error: Template not found at $TEMPLATE"
    exit 1
fi

mkdir -p "$SPECS_DIR"

# 3. String Sanitization
STAMP=$(date +%Y%m%d)
# tr -cd: keep alphanumeric, spaces, underscores, hyphens
# sed: convert spaces to hyphens, lowercase, and trim
SAFE=$(echo "$TITLE" | tr -cd '[:alnum:] _-' | tr '[:upper:]' '[:lower:]' | sed -E 's/[[:space:]]+/-/g' | sed -E 's/^-+|-+$//g')

FILENAME="${ID}-${STAMP}-${SAFE}.md"
OUTFILE="$SPECS_DIR/$FILENAME"

# 4. Processing (Using a temporary file to ensure safe replacement)
sed "s/<TITLE>/$TITLE/g" "$TEMPLATE" > "$OUTFILE"
# Inject ID and DATE if placeholders exist
sed -i "s/<ID>/$ID/g" "$OUTFILE" 2>/dev/null || sed -i "" "s/<ID>/$ID/g" "$OUTFILE"
sed -i "s/<DATE>/$(date +%Y-%m-%d)/g" "$OUTFILE" 2>/dev/null || sed -i "" "s/<DATE>/$(date +%Y-%m-%d)/g" "$OUTFILE"

echo -e "--- \033[0;36mSpec Factory\033[0m ---"
echo -e "ID:   $ID"
echo -e "File: \033[0;32m$OUTFILE\033[0m"