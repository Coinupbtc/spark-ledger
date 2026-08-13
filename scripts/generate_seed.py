#!/usr/bin/env python3
"""Pack data/ledger.json into js/seed.js. Fail if any card lacks a source URL."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    seed = json.loads((ROOT / "data" / "ledger.json").read_text())
    missing = [c["id"] for c in seed["cards"] if not str(c.get("source") or "").startswith("https://")]
    if missing:
        raise SystemExit("cards missing public source: " + ", ".join(missing))
    decisions = {c["decision"] for c in seed["cards"]}
    if not {"SHIP", "KILL", "HOLD"} <= decisions:
        raise SystemExit("blotter must include SHIP, KILL, and HOLD")
    js = "/* generated — do not edit by hand */\nwindow.LEDGER_SEED = " + json.dumps(seed) + ";\n"
    (ROOT / "js" / "seed.js").write_text(js)
    print("wrote seed", len(seed["cards"]), "cards")


if __name__ == "__main__":
    main()
