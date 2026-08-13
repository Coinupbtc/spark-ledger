#!/usr/bin/env bash
# Headless: blotter headline + sourced SHIP/KILL + integrity PASS.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-18768}"
python3 "$ROOT/scripts/generate_seed.py" >/dev/null
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT" >/tmp/spark-ledger-http.log 2>&1 &
PID=$!
cleanup() { kill "$PID" 2>/dev/null || true; }
trap cleanup EXIT
sleep 0.6
DOM=$(brave-browser --headless --disable-gpu --no-sandbox --dump-dom --virtual-time-budget=8000 \
  "http://127.0.0.1:${PORT}/" 2>/dev/null || true)
echo "$DOM" | grep -q 'Recipes start the server' || { echo "FAIL: headline"; exit 1; }
echo "$DOM" | grep -q '169.4' || { echo "FAIL: missing v8 coding number"; exit 1; }
echo "$DOM" | grep -q 'cache-reuse' || { echo "FAIL: missing kill card"; exit 1; }
echo "$DOM" | grep -q 'Source integrity' || { echo "FAIL: integrity kpi"; exit 1; }
echo "$DOM" | grep -q 'MiaAI Labs' || { echo "FAIL: scoped credit"; exit 1; }
TICKET=$(brave-browser --headless --disable-gpu --no-sandbox --dump-dom --virtual-time-budget=6000 \
  "http://127.0.0.1:${PORT}/?id=SK-008" 2>/dev/null || true)
echo "$TICKET" | grep -q 'github.com/Coinupbtc/miaai35-tune' || { echo "FAIL: public source on ticket"; exit 1; }
echo "$TICKET" | grep -q 'SHIP' || { echo "FAIL: ship ticket"; exit 1; }
KILL=$(brave-browser --headless --disable-gpu --no-sandbox --dump-dom --virtual-time-budget=6000 \
  "http://127.0.0.1:${PORT}/?filter=KILL" 2>/dev/null || true)
echo "$KILL" | grep -q 'data-open="SK-013"' || { echo "FAIL: kill filter missing SK-013"; exit 1; }
if echo "$KILL" | grep -q 'data-open="SK-001"'; then echo "FAIL: SHIP row on KILL filter"; exit 1; fi
echo "SMOKE PASS — blotter + sourced cards + KILL filter"
