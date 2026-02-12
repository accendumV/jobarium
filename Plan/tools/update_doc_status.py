#!/usr/bin/env python3
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


ALLOWED = {"Draft v1", "In review", "Approved", "Superseded"}


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def main() -> None:
    parser = argparse.ArgumentParser(description="Update document status in registry DB with history.")
    parser.add_argument("--id", required=True, help="Document id, e.g. D-014")
    parser.add_argument("--status", required=True, help="New status")
    parser.add_argument("--by", required=True, help="Actor name, e.g. CEO or CTO")
    parser.add_argument("--note", default="", help="Optional change note")
    parser.add_argument(
        "--db",
        default=str(Path(__file__).resolve().parents[1] / "db" / "document_registry.json"),
        help="Path to registry JSON DB",
    )
    args = parser.parse_args()

    if args.status not in ALLOWED:
        raise SystemExit(f"Invalid status '{args.status}'. Allowed: {', '.join(sorted(ALLOWED))}")

    db_path = Path(args.db)
    if not db_path.exists():
        raise SystemExit(f"DB not found: {db_path}")

    data = json.loads(db_path.read_text(encoding="utf-8"))
    docs = data.get("documents", [])
    doc = next((d for d in docs if d.get("id") == args.id), None)
    if not doc:
        raise SystemExit(f"Document id not found: {args.id}")

    old = doc.get("status")
    ts = now_iso()

    doc["status"] = args.status
    doc["updated_at"] = ts
    doc["updated_by"] = args.by
    if args.note:
        doc["notes"] = args.note

    data["updated_at"] = ts
    history = data.setdefault("history", [])
    history.append(
        {
            "timestamp": ts,
            "actor": args.by,
            "action": "status_update",
            "note": args.note,
            "changes": [
                {
                    "id": args.id,
                    "field": "status",
                    "from": old,
                    "to": args.status,
                }
            ],
        }
    )

    db_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Updated {args.id}: {old} -> {args.status}")


if __name__ == "__main__":
    main()
