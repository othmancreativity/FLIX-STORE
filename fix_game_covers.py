#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FLIX-STORE — fix_game_covers.py
سكربت واحد خفيف يقوم بـ:
  1) حذف كل صور الألعاب القديمة من src/assets/games/
  2) تحميل صورة غلاف عمودية حقيقية (library_600x900 من Steam، نسبة 2:3)
     لكل لعبة — وهي الصورة المناسبة للعرض المربع في الموقع (مفيش قصّ غلط)
  3) لو مش متاحة، fallback إلى header.jpg، ثم بحث Steam، ثم تتسجل كمفقودة
  4) git add + commit + push على GitHub (main)
  Vercel مربوط بالـ GitHub فهيعمل deploy تلقائي بعد الـ push — مفيش خطوة يدوية.

طريقة الاستخدام: python fix_game_covers.py
"""

import os
import re
import sys
import time
import json
import urllib.request
import urllib.parse
import subprocess
from pathlib import Path

# ───────────────────────────────────────────
# إعدادات
# ───────────────────────────────────────────
PROJECT_DIR = r"D:\projects\FLIX"
GAMES_DIR = Path(PROJECT_DIR) / "src" / "assets" / "games"
BRANCH = "main"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

# slug -> (steam_app_id أو None, نص بحث احتياطي)
GAMES = [
    ("pp1", 1721470, "Poppy Playtime Chapter 1"),
    ("pp2", 1817070, "Poppy Playtime Chapter 2"),
    ("pp3", 1996150, "Poppy Playtime Chapter 3"),
    ("pp4", 2683100, "Poppy Playtime Chapter 4"),
    ("pp5", 3180090, "Poppy Playtime Chapter 5"),
    ("g-ln1", 387290, "Little Nightmares"),
    ("g-ln2", 860510, "Little Nightmares 2"),
    ("g-ln3", 2425700, "Little Nightmares 3"),
    ("g-re2", 883710, "Resident Evil 2"),
    ("g-re3", 952060, "Resident Evil 3"),
    ("g-re4remake", 2050650, "Resident Evil 4 Remake"),
    ("re-requiem", 2784090, "Resident Evil Requiem"),
    ("g-bo3", 311210, "Call of Duty Black Ops 3"),
    ("g-bo4", 812140, "Call of Duty Black Ops 4"),
    ("g-codww2", 476600, "Call of Duty WWII"),
    ("g-dl1", 239140, "Dying Light"),
    ("g-dl2", 534380, "Dying Light 2"),
    ("g-dyinglight", 3415250, "Dying Light The Beast"),
    ("g-eldenring", 1245620, "Elden Ring"),
    ("g-nightreign", 2622380, "Elden Ring Nightreign"),
    ("g-nightreigndx", 2622380, "Elden Ring Nightreign Deluxe"),
    ("g-arkevolved", 346110, "ARK Survival Evolved"),
    ("g-arkascend", 2399830, "ARK Survival Ascended"),
    ("gta5", 271590, "Grand Theft Auto V"),
    ("g-gta6", None, "Grand Theft Auto VI"),
    ("bf6", 2807960, "Battlefield 6"),
    ("yotei", None, "Ghost of Yotei PS5"),
    ("rdr2", 1174180, "Red Dead Redemption 2"),
    ("wolverine", None, "Marvel Wolverine PS5"),
    ("fc26", None, "EA Sports FC 26"),
    ("007", 2788780, "007 First Light"),
    ("g-forza6", None, "Forza Horizon 5"),
    ("wwe26", 3039360, "WWE 2K26"),
    ("g-ghostrecon", 460930, "Ghost Recon Wildlands"),
    ("g-amongus", 945360, "Among Us"),
    ("g-tombraider", 1187000, "Tomb Raider Trilogy"),
    ("g-batman", 1659420, "Batman Arkham Collection"),
    ("g-r6siege", 359550, "Rainbow Six Siege"),
    ("g-choochoo", 1638000, "Choo Choo Charles"),
    ("g-reanimal", 3046000, "REANIMAL game"),
    ("g-overcooked2", 728880, "Overcooked 2"),
    ("g-acvalhalla", 2208920, "Assassin's Creed Valhalla"),
    ("g-mk1", 1971870, "Mortal Kombat 1"),
    ("g-tekken7", 389730, "Tekken 7"),
    ("minecraft", 1672970, "Minecraft"),
    ("g-gowragnarok", None, "God of War Ragnarok PS5"),
    ("g-spiderman2", None, "Marvel Spider-Man 2 PS5"),
    ("g-horizonfw", None, "Horizon Forbidden West"),
    ("g-lastofus2", None, "The Last of Us Part 2"),
    ("g-ufc5", None, "UFC 5 EA Sports"),
    ("g-eafc25", None, "EA Sports FC 25"),
    ("g-nba2k25", None, "NBA 2K25"),
    ("g-hogwarts", 990080, "Hogwarts Legacy"),
    ("g-godofwar", 1593500, "God of War 2018"),
    ("g-stray", 1332010, "Stray"),
    ("g-itTakesTwo", 1426210, "It Takes Two"),
]


def fetch_bytes(url, timeout=15):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read()
    except Exception:
        return None


def save_if_valid(data, save_path, min_size=8_000):
    if data and len(data) > min_size:
        with open(save_path, "wb") as f:
            f.write(data)
        return True
    return False


def try_steam_app_id(app_id, save_path):
    """أولاً غلاف عمودي 2:3 (الأنسب للقصّ المربع)، ثم header كـ fallback."""
    for fname in ("library_600x900.jpg", "header.jpg"):
        url = f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/{fname}"
        data = fetch_bytes(url)
        if save_if_valid(data, save_path):
            return fname.replace(".jpg", "")
    return None


def try_steam_search(query, save_path):
    q = urllib.parse.quote(query)
    url = f"https://store.steampowered.com/search/suggest?term={q}&f=games&cc=US&l=en"
    html = fetch_bytes(url)
    if not html:
        return None
    m = re.search(rb'/app/(\d+)/', html)
    if not m:
        return None
    found_id = m.group(1).decode()
    result = try_steam_app_id(found_id, save_path)
    return f"search→{found_id}:{result}" if result else None


def delete_old_images():
    print("=" * 50)
    print("🗑️  حذف الصور القديمة...")
    print("=" * 50)
    if not GAMES_DIR.exists():
        print(f"❌ المجلد غير موجود: {GAMES_DIR}")
        sys.exit(1)
    n = 0
    for f in GAMES_DIR.glob("*"):
        if f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"):
            f.unlink()
            n += 1
    print(f"✅ تم حذف {n} صورة\n")


def download_new_images():
    print("=" * 50)
    print("📥  تحميل الأغلفة الجديدة (عمودية 2:3)...")
    print("=" * 50)
    ok, failed = [], []
    for slug, app_id, query in GAMES:
        save_path = GAMES_DIR / f"{slug}.jpg"
        source = None
        if app_id:
            source = try_steam_app_id(app_id, save_path)
        if not source:
            source = try_steam_search(query, save_path)
        if source:
            print(f"  ✅ {slug:<18} ← {source}")
            ok.append(slug)
        else:
            print(f"  ⚠️  {slug:<18} لم يتم العثور — سيظهر بالتصميم الافتراضي")
            failed.append(slug)
        time.sleep(0.3)
    print(f"\n📊 النتيجة: {len(ok)} نجحت / {len(failed)} فشلت")
    if failed:
        print(f"   بدون صورة: {', '.join(failed)}")
    print()


def run(cmd):
    print(f"▶ {cmd}")
    r = subprocess.run(cmd, shell=True, cwd=PROJECT_DIR, capture_output=True, text=True)
    if r.stdout.strip():
        print(r.stdout.strip())
    if r.stderr.strip():
        print(r.stderr.strip())
    return r.returncode


def push_and_deploy():
    print("=" * 50)
    print("🚀  رفع التغييرات على GitHub...")
    print("=" * 50)
    run("git add .")
    rc = run('git commit -m "fix: replace game covers with proper vertical poster art"')
    if rc != 0:
        print("ℹ️  لا يوجد تغييرات جديدة للـ commit (أو حدث خطأ بسيط) — سيتم تجاهله.")
    run(f"git push origin {BRANCH}")
    print("\n✅ Vercel مربوط بهذا الريبو وسيعمل Deploy تلقائياً خلال دقيقة أو اثنتين.")
    print("🌐 تابع النتيجة على: https://flix-store.vercel.app/")


if __name__ == "__main__":
    delete_old_images()
    download_new_images()
    push_and_deploy()
