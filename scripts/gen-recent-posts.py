#!/usr/bin/env python3
"""扫描 docs/blog/**/*.md，从 frontmatter 提取 data/date + title，
筛选近 30 天文章，生成 docs/data/recent-posts.json。"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

try:
    import yaml
except ImportError:
    print("PyYAML is required (pip install pyyaml)", file=sys.stderr)
    sys.exit(1)

DOCS_DIR = Path(__file__).resolve().parent.parent / "docs"
BLOG_DIR = DOCS_DIR / "blog"
OUTPUT = DOCS_DIR / "data" / "recent-posts.json"
DAYS = 30


def parse_frontmatter(text):
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    try:
        return yaml.safe_load(parts[1]) or {}
    except yaml.YAMLError:
        return {}


def get_date(fm):
    for key in ("data", "date"):
        val = fm.get(key)
        if val:
            if isinstance(val, datetime):
                return val
            for fmt in ("%Y/%m/%d", "%Y-%m-%d", "%Y.%m.%d"):
                try:
                    return datetime.strptime(str(val).strip(), fmt)
                except ValueError:
                    continue
    return None


def md_to_url(md_path):
    rel = md_path.relative_to(DOCS_DIR)
    return rel.with_suffix("").as_posix() + "/"


def main():
    today = datetime.now()
    cutoff = today - timedelta(days=DAYS)
    posts = []

    for md in sorted(BLOG_DIR.rglob("*.md")):
        text = md.read_text(encoding="utf-8")
        fm = parse_frontmatter(text)
        if fm.get("draft"):
            continue
        date = get_date(fm)
        if not date:
            continue
        title = fm.get("title") or md.stem
        if cutoff <= date <= today:
            posts.append({
                "title": str(title),
                "url": md_to_url(md),
                "date": date.strftime("%Y-%m-%d"),
            })

    posts.sort(key=lambda p: p["date"], reverse=True)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(posts, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Generated {OUTPUT} with {len(posts)} post(s) from last {DAYS} days.")


if __name__ == "__main__":
    main()
