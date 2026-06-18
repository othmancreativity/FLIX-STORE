#!/usr/bin/env python3
"""
يحمّل الصور المفقودة من مصادر بديلة
"""
import os, sys, urllib.request, urllib.parse, re, time, json
from pathlib import Path

PROJECT_DIR = r"D:\projects\FLIX"
GAMES_DIR = Path(PROJECT_DIR) / "src" / "assets" / "games"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0"}

# الألعاب المفقودة مع روابط صورها المباشرة من مصادر موثوقة
MISSING = [
    # slug         direct image URL
    ("pp1",         "https://cdn.cloudflare.steamstatic.com/steam/apps/1721470/header.jpg"),
    ("pp5",         "https://cdn.cloudflare.steamstatic.com/steam/apps/3180090/header.jpg"),
    ("re-requiem",  "https://www.capcom.com/us/files/games/re9/re9-key-art.jpg"),
    ("g-bo4",       "https://cdn.cloudflare.steamstatic.com/steam/apps/812370/header.jpg"),
    ("g-nightreigndx","https://cdn.cloudflare.steamstatic.com/steam/apps/2622380/library_600x900.jpg"),
    ("bf6",         "https://media.contentapi.ea.com/content/dam/ea/battlefield/battlefield-6/common/bf6-keyart-16x9.jpg.adapt.1920w.jpg"),
    ("yotei",       "https://image.api.playstation.com/vulcan/ap/rnd/202409/1215/1e798d64e14f9ebb1f74b9c5a2c85e01b6a6c8b0cde91ba9.jpg"),
    ("wolverine",   "https://image.api.playstation.com/vulcan/ap/rnd/202207/0422/9rHzKm3sPc0tYiANLKRg85Ey.jpg"),
    ("fc26",        "https://media.contentapi.ea.com/content/dam/ea/eafc/eafc26/common/eafc26-keyart-16x9.jpg.adapt.1920w.jpg"),
    ("007",         "https://cdn.cloudflare.steamstatic.com/steam/apps/2788780/header.jpg"),
    ("wwe26",       "https://cdn.cloudflare.steamstatic.com/steam/apps/3039360/header.jpg"),
    ("g-reanimal",  "https://cdn.cloudflare.steamstatic.com/steam/apps/3046000/header.jpg"),
    ("minecraft",   "https://cdn.cloudflare.steamstatic.com/steam/apps/1672970/header.jpg"),
    ("g-spiderman2","https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8705a9c2f8e31d71a1b78ace74b83c87fc3bba4cd.jpg"),
    ("g-ufc5",      "https://media.contentapi.ea.com/content/dam/ea/ufc/ufc5/common/ufc5-keyart-16x9.jpg.adapt.1920w.jpg"),
]

# مصادر Steam بديلة للألعاب المفقودة
STEAM_IDS_FALLBACK = {
    "pp1":          1721470,
    "pp5":          3180090,
    "g-bo4":        812370,
    "g-nightreigndx":2622380,
    "007":          2788780,
    "wwe26":        3039360,
    "g-reanimal":   3046000,
    "minecraft":    1672970,
}

def fetch(url, save_path=None, timeout=20):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = r.read()
        if save_path:
            with open(save_path, "wb") as f:
                f.write(data)
            return os.path.getsize(save_path) > 5000
        return data.decode("utf-8", errors="ignore")
    except Exception as e:
        return False

def steam_header(app_id, save_path):
    for tpl in [
        f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/header.jpg",
        f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/library_600x900.jpg",
        f"https://cdn.akamai.steamstatic.com/steam/apps/{app_id}/header.jpg",
    ]:
        if fetch(tpl, save_path):
            return True
    return False

def run(cmd, cwd=PROJECT_DIR):
    import subprocess
    print(f"\n▶ {cmd}")
    r = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if r.stdout: print(r.stdout)
    if r.stderr: print(r.stderr)

print("="*55)
print("📥  تحميل الصور المفقودة...")
print("="*55)

success, failed = [], []

for slug, url in MISSING:
    save_path = GAMES_DIR / f"{slug}.jpg"
    print(f"\n🎮  {slug}")

    ok = False

    # جرّب Steam App ID الاحتياطي أولاً
    if slug in STEAM_IDS_FALLBACK:
        ok = steam_header(STEAM_IDS_FALLBACK[slug], save_path)
        if ok:
            print(f"  ✅ Steam App {STEAM_IDS_FALLBACK[slug]}")

    # جرّب الرابط المباشر
    if not ok:
        ok = fetch(url, save_path)
        if ok:
            print(f"  ✅ Direct URL")

    if ok:
        kb = os.path.getsize(save_path) / 1024
        print(f"  📦 {kb:.0f} KB")
        success.append(slug)
    else:
        print(f"  ❌ فشل")
        failed.append(slug)

    time.sleep(0.3)

print(f"\n{'='*55}")
print(f"📊  {len(success)} ✅  |  {len(failed)} ❌")
if failed:
    print(f"   فشل: {', '.join(failed)}")

# رفع على GitHub + Deploy
print("\n" + "="*55)
print("🚀  رفع على GitHub...")
run("git add .")
run('git commit -m "fix: add missing game cover images"')
run("git push origin main")
print("\n🌐  Deploying...")
run("vercel --prod")
print("\n🎉  تم! https://flix-store.vercel.app/")
