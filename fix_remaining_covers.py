#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FLIX-STORE — fix_remaining_covers.py
يكمّل فقط الألعاب اللي فضلت بدون صورة من السكربت السابق،
باستخدام RAWG API (مجاني — احصل على مفتاح من https://rawg.io/apidocs).

طريقة الاستخدام:
    python fix_remaining_covers.py YOUR_RAWG_API_KEY
"""

import sys
import time
import json
import urllib.request
import urllib.parse
import subprocess
from pathlib import Path

PROJECT_DIR = r"D:\projects\FLIX"
GAMES_DIR = Path(PROJECT_DIR) / "src" / "assets" / "games"
BRANCH = "main"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

# slug -> نص بحث في RAWG
MISSING_GAMES = [
    ("pp5", "Poppy Playtime Chapter 5"),
    ("bf6", "Battlefield 6"),
    ("yotei", "Ghost of Yotei"),
    ("wolverine", "Marvel's Wolverine"),
    ("fc26", "EA Sports FC 26"),
    ("g-tombraider", "Tomb Raider"),
    ("g-reanimal", "REANIMAL"),
    ("g-gowragnarok", "God of War Ragnarok"),
    ("g-spiderman2", "Marvel's Spider-Man 2"),
    ("g-ufc5", "UFC 5"),
]


def fetch_bytes(url, timeout=15):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read()
    except Exception:
        return None


def rawg_image(query, api_key):
    q = urllib.parse.quote(query)
    url = f"https://api.rawg.io/api/games?key={api_key}&search={q}&page_size=1"
    data = fetch_bytes(url)
    if not data:
        return None
    try:
        obj = json.loads(data)
        results = obj.get("results", [])
        if results:
            return results[0].get("background_image")
    except Exception:
        pass
    return None


def save_if_valid(data, save_path, min_size=8_000):
    if data and len(data) > min_size:
        with open(save_path, "wb") as f:
            f.write(data)
        return True
    return False


def run(cmd):
    print(f"▶ {cmd}")
    r = subprocess.run(cmd, shell=True, cwd=PROJECT_DIR, capture_output=True, text=True)
    if r.stdout.strip():
        print(r.stdout.strip())
    if r.stderr.strip():
        print(r.stderr.strip())
    return r.returncode


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("الاستخدام: python fix_remaining_covers.py YOUR_RAWG_API_KEY")
        print("احصل على مفتاح مجاني من: https://rawg.io/apidocs")
        sys.exit(1)

    api_key = sys.argv[1]

    print("=" * 50)
    print("📥  تحميل الصور المتبقية عبر RAWG...")
    print("=" * 50)

    ok, failed = [], []
    for slug, query in MISSING_GAMES:
        save_path = GAMES_DIR / f"{slug}.jpg"
        img_url = rawg_image(query, api_key)
        if img_url and save_if_valid(fetch_bytes(img_url), save_path):
            print(f"  ✅ {slug:<18} ← RAWG")
            ok.append(slug)
        else:
            print(f"  ⚠️  {slug:<18} لم يتم العثور حتى عبر RAWG")
            failed.append(slug)
        time.sleep(0.3)

    print(f"\n📊 النتيجة: {len(ok)} نجحت / {len(failed)} فشلت")
    if failed:
        print(f"   لسه بدون صورة: {', '.join(failed)}")

    print("\n" + "=" * 50)
    print("🚀  رفع التغييرات على GitHub...")
    print("=" * 50)
    run("git add .")
    run('git commit -m "fix: add remaining game covers via RAWG"')
    run(f"git push origin {BRANCH}")
    print("\n✅ Vercel سيعمل Deploy تلقائياً. تابع على: https://flix-store.vercel.app/")
