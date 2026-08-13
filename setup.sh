#!/usr/bin/env bash
# Local blotter server (no secrets, public-source cards only).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
python3 "$ROOT/scripts/generate_seed.py"
PORT="${PORT:-8767}"
echo "Spark Ledger  →  http://127.0.0.1:${PORT}/"
echo "SHIP / KILL / HOLD from public reports. Ctrl-C to stop."
exec python3 -m http.server "$PORT" --bind 127.0.0.1
