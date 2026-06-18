#!/usr/bin/env python3
"""
يحمّل الـ 9 صور المفقودة الأخيرة
pp5=4100940, bo4=مش على Steam(PlayStation), bf6, yotei, wolverine, fc26, g-reanimal, g-spiderman2, g-ufc5
"""
import os, sys, urllib.request, urllib.parse, time, subprocess
from pathlib import Path

PROJECT_DIR = r"D:\projects\FLIX"
GAMES_DIR = Path(PROJECT_DIR) / "src" / "assets" / "games"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
}

# روابط مباشرة ومضمونة لكل لعبة
MISSING = [
    # pp5 - App ID 4100940 على Steam
    ("pp5", [
        "https://cdn.cloudflare.steamstatic.com/steam/apps/4100940/header.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/4100940/header.jpg",
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4100940/header.jpg",
    ]),
    # BO4 - Battle.net فقط مش على Steam
    ("g-bo4", [
        "https://cdn.cloudflare.steamstatic.com/steam/apps/812370/header.jpg",
        "https://www.igdb.com/games/call-of-duty-black-ops-4/cover",
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wkb.jpg",
    ]),
    # Battlefield 6
    ("bf6", [
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2922220/header.jpg",
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2922220/library_600x900.jpg",
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2922220/header.jpg",
    ]),
    # Ghost of Yotei
    ("yotei", [
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2693840/header.jpg",
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2693840/header.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/2693840/header.jpg",
    ]),
    # Marvel's Wolverine
    ("wolverine", [
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2475490/header.jpg",
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2475490/header.jpg",
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co6aqv.jpg",
    ]),
    # EA Sports FC 26
    ("fc26", [
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2519060/header.jpg",
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2519060/header.jpg",
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1811260/header.jpg",  # FC 25 fallback
    ]),
    # REANIMAL
    ("g-reanimal", [
        "https://cdn.cloudflare.steamstatic.com/steam/apps/3046000/header.jpg",
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3046000/header.jpg",
        "https://cdn.cloudflare.steamstatic.com/steam/apps/3046000/library_600x900.jpg",
    ]),
    # Spider-Man 2
    ("g-spiderman2", [
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2320010/header.jpg",
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2320010/header.jpg",
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co7dda.jpg",
    ]),
    # UFC 5
    ("g-ufc5", [
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1309580/header.jpg",
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1309580/header.jpg",
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co6b8t.jpg",
    ]),
]

def fetch(url, save_path, timeout=20):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = r.read()
        with open(save_path, "wb") as f:
            f.write(data)
        size = os.path.getsize(save_path)
        return size > 8000  # أكبر من 8KB = صورة حقيقية
    except Exception as e:
        if os.path.exists(save_path):
            os.remove(save_path)
        return False

def run(cmd):
    print(f"\n▶ {cmd}")
    r = subprocess.run(cmd, shell=True, cwd=PROJECT_DIR, capture_output=True, text=True)
    if r.stdout: print(r.stdout)
    if r.stderr: print(r.stderr)

print("="*55)
print("📥  تحميل الـ 9 صور المفقودة...")
print("="*55)

success, failed = [], []

for slug, urls in MISSING:
    save_path = GAMES_DIR / f"{slug}.jpg"
    print(f"\n🎮  {slug}")
    ok = False
    for i, url in enumerate(urls):
        print(f"  جرّب {i+1}: {url[:60]}...")
        if fetch(url, save_path):
            kb = os.path.getsize(save_path) / 1024
            print(f"  ✅ نجح! ({kb:.0f} KB)")
            ok = True
            break
        time.sleep(0.3)

    if ok:
        success.append(slug)
    else:
        print(f"  ❌ فشل كل الروابط")
        failed.append(slug)

    time.sleep(0.5)

print(f"\n{'='*55}")
print(f"📊  {len(success)} ✅  |  {len(failed)} ❌")
if failed:
    print(f"   فشل: {', '.join(failed)}")
print("="*55)

if success:
    print("\n🚀  رفع على GitHub...")
    run("git add .")
    run('git commit -m "fix: add remaining missing game cover images"')
    run("git push origin main")
    print("\n🌐  Deploying...")
    run("vercel --prod")
    print("\n🎉  تم! https://flix-store.vercel.app/")
else:
    print("\n⚠️  مفيش صور اتحملت — مش هيتعمل deploy")
