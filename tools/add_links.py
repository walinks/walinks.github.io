#!/usr/bin/env python3
"""Add new invite links to data/groups.json, then rebuild js/groups-data.js.

Put one group per line in a text file:   page | category | Group name | invite URL
  pages:      jobs, movies, entertainment, friendship
  categories: jobs -> pakistan|gulf|online
              movies -> all|hollywood|bollywood|south|netflix|web
              entertainment -> funny|entertainment|movies|anime
              friendship -> all

Usage:  python3 tools/add_links.py new_links.txt
Only https://chat.whatsapp.com/<code> and whatsapp.com/channel links are accepted.
"""
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LINK_RE = re.compile(r'^https://(chat\.whatsapp\.com/[A-Za-z0-9]{10,}|www\.whatsapp\.com/channel/[A-Za-z0-9]+)$')
PAGES = {"jobs", "movies", "entertainment", "friendship"}

def main(path):
    data_file = ROOT / "data/groups.json"
    data = json.loads(data_file.read_text(encoding="utf-8"))
    added = skipped = 0
    for n, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip() or line.startswith("#"):
            continue
        parts = [p.strip() for p in line.split("|")]
        if len(parts) != 4 or parts[0] not in PAGES:
            print(f"line {n}: skipped (expected 'page | category | name | url')"); skipped += 1; continue
        page, cat, name, link = parts
        link = link.split("?")[0]
        if not LINK_RE.match(link):
            print(f"line {n}: skipped (not a valid WhatsApp invite URL)"); skipped += 1; continue
        if any(g["link"].split("?")[0] == link for g in data[page]):
            print(f"line {n}: skipped (already listed)"); skipped += 1; continue
        data[page].append({"name": name, "link": link, "cat": cat or "all"})
        added += 1
    data_file.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"added {added}, skipped {skipped}")
    subprocess.run([sys.executable, str(ROOT / "tools/build_data.py")], check=True)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
