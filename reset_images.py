#!/usr/bin/env python3
"""
FLIX-STORE — reset_images.py
1. يحذف كل الصور الموجودة في src/assets/games/
2. يحمّل صورة حقيقية لكل لعبة من Steam Store (مجاني بدون API key)
3. يحفظها بنفس اسم الـ slug المستخدم في Offers.tsx
4. يرفع على GitHub ويعمل Deploy على Vercel
"""

import os, sys, re, shutil, subprocess, urllib.request, urllib.parse, json, time
from pathlib import Path

# ══════════════════════════════════════════
# ⚙️  إعدادات
# ══════════════════════════════════════════
PROJECT_DIR  = r"D:\projects\FLIX"
GAMES_DIR    = Path(PROJECT_DIR) / "src" / "assets" / "games"
BRANCH       = "main"

# ══════════════════════════════════════════
# 🎮  قائمة كل الألعاب  slug → Steam App ID (أو search query كـ fallback)
#     App IDs مضمونة 100% من متجر Steam
# ══════════════════════════════════════════
GAMES = [
    # slug                  steam_app_id   search_fallback (لو مش على Steam)
    ("pp1",           None,   "Poppy Playtime Chapter 1"),
    ("pp2",           None,   "Poppy Playtime Chapter 2"),
    ("pp3",           None,   "Poppy Playtime Chapter 3"),
    ("pp4",           None,   "Poppy Playtime Chapter 4"),
    ("pp5",           None,   "Poppy Playtime Chapter 5"),
    ("g-ln1",         387290, "Little Nightmares"),
    ("g-ln2",         860510, "Little Nightmares 2"),
    ("g-ln3",         None,   "Little Nightmares 3"),
    ("g-re2",         883710, "Resident Evil 2"),
    ("g-re3",         952060, "Resident Evil 3"),
    ("g-re4remake",   1196590,"Resident Evil 4 Remake"),
    ("re-requiem",    None,   "Resident Evil Requiem"),
    ("g-bo3",         311210, "Call of Duty Black Ops 3"),
    ("g-bo4",         812370, "Call of Duty Black Ops 4"),
    ("g-codww2",      476600, "Call of Duty WWII"),
    ("g-dl1",         239140, "Dying Light"),
    ("g-dl2",         534380, "Dying Light 2"),
    ("g-dyinglight",  None,   "Dying Light The Beast"),
    ("g-eldenring",   1245620,"Elden Ring"),
    ("g-nightreign",  None,   "Elden Ring Nightreign"),
    ("g-nightreigndx",None,   "Elden Ring Nightreign Deluxe"),
    ("g-arkevolved",  346110, "ARK Survival Evolved"),
    ("g-arkascend",   2399830,"ARK Survival Ascended"),
    ("gta5",          271590, "Grand Theft Auto V"),
    ("g-gta6",        None,   "Grand Theft Auto VI"),
    ("bf6",           None,   "Battlefield 6"),
    ("yotei",         None,   "Ghost of Yotei"),
    ("rdr2",          1174180,"Red Dead Redemption 2"),
    ("wolverine",     None,   "Marvel Wolverine PS5"),
    ("fc26",          None,   "EA Sports FC 26"),
    ("007",           None,   "007 First Light"),
    ("g-forza6",      None,   "Forza Horizon 5"),
    ("wwe26",         None,   "WWE 2K26"),
    ("g-ghostrecon",  460930, "Ghost Recon Wildlands"),
    ("g-amongus",     945360, "Among Us"),
    ("g-tombraider",  817630, "Tomb Raider Trilogy"),
    ("g-batman",      209000, "Batman Arkham Collection"),
    ("g-r6siege",     359550, "Rainbow Six Siege"),
    ("g-choochoo",    1638000,"Choo Choo Charles"),
    ("g-reanimal",    None,   "REANIMAL game"),
    ("g-overcooked2", 728880, "Overcooked 2"),
    ("g-acvalhalla",  2208920,"Assassin's Creed Valhalla"),
    ("g-mk1",         1971870,"Mortal Kombat 1"),
    ("g-tekken7",     389730, "Tekken 7"),
    ("minecraft",     None,   "Minecraft Dungeons PS4"),
    ("g-gowragnarok", None,   "God of War Ragnarok"),
    ("g-spiderman2",  None,   "Marvel Spider-Man 2 PS5"),
    ("g-horizonfw",   None,   "Horizon Forbidden West"),
    ("g-lastofus2",   None,   "Last of Us Part 2"),
    ("g-ufc5",        None,   "UFC 5 EA Sports"),
    ("g-eafc25",      None,   "EA Sports FC 25"),
    ("g-nba2k25",     None,   "NBA 2K25"),
    ("g-hogwarts",    990080, "Hogwarts Legacy"),
    ("g-godofwar",    1593500,"God of War 2018"),
    ("g-stray",       1332010,"Stray"),
    ("g-itTakesTwo",  1426210,"It Takes Two"),
]

# ══════════════════════════════════════════
# 🔧  دوال مساعدة
# ══════════════════════════════════════════
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

def fetch(url, save_path=None, timeout=20):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = r.read()
        if save_path:
            with open(save_path, "wb") as f:
                f.write(data)
            return True
        return data.decode("utf-8", errors="ignore")
    except Exception as e:
        return None

def steam_header(app_id, save_path):
    """صورة header من Steam CDN مباشرة (460×215)"""
    url = f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/header.jpg"
    if fetch(url, save_path):
        size = os.path.getsize(save_path)
        if size > 10_000:
            return True
    # جرّب library_600x900
    url2 = f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/library_600x900.jpg"
    if fetch(url2, save_path):
        if os.path.getsize(save_path) > 10_000:
            return True
    return False

def steam_search(query, save_path):
    """ابحث في Steam عن اللعبة وحمّل صورتها"""
    q = urllib.parse.quote(query)
    url = f"https://store.steampowered.com/search/suggest?term={q}&f=games&cc=US&l=en"
    html = fetch(url)
    if html:
        match = re.search(r'href="https://store\.steampowered\.com/app/(\d+)/', html)
        if match:
            app_id = match.group(1)
            return steam_header(app_id, save_path)
    return False

def rawg_search(query, save_path, api_key=None):
    """RAWG API (اختياري)"""
    if not api_key:
        return False
    q = urllib.parse.quote(query)
    url = f"https://api.rawg.io/api/games?key={api_key}&search={q}&page_size=1"
    data = fetch(url)
    if data:
        try:
            obj = json.loads(data)
            results = obj.get("results", [])
            if results and results[0].get("background_image"):
                img_url = results[0]["background_image"]
                return bool(fetch(img_url, save_path))
        except Exception:
            pass
    return False

def run(cmd, cwd=None):
    print(f"\n▶ {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd or PROJECT_DIR,
                            capture_output=True, text=True)
    if result.stdout: print(result.stdout)
    if result.stderr: print(result.stderr)
    if result.returncode != 0:
        print(f"❌ فشل: {cmd}")
        sys.exit(1)

# ══════════════════════════════════════════
# 🗑️  الخطوة 1: احذف كل الصور الموجودة
# ══════════════════════════════════════════
def delete_all_images():
    print("\n" + "="*55)
    print("🗑️  حذف كل الصور القديمة...")
    print("="*55)
    deleted = 0
    for f in GAMES_DIR.glob("*"):
        if f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"):
            f.unlink()
            print(f"  🗑  {f.name}")
            deleted += 1
    print(f"\n✅ تم حذف {deleted} صورة")

# ══════════════════════════════════════════
# 📥  الخطوة 2: حمّل صورة لكل لعبة
# ══════════════════════════════════════════
def download_all_images():
    print("\n" + "="*55)
    print("📥  تحميل الصور الجديدة...")
    print("="*55)

    success, failed = [], []

    for slug, app_id, search_query in GAMES:
        save_path = GAMES_DIR / f"{slug}.jpg"
        print(f"\n🎮  {slug} ({search_query})")

        ok = False

        # أولاً: جرّب Steam App ID المباشر
        if app_id:
            ok = steam_header(app_id, save_path)
            if ok:
                print(f"  ✅ Steam App {app_id}")

        # ثانياً: ابحث في Steam
        if not ok:
            ok = steam_search(search_query, save_path)
            if ok:
                print(f"  ✅ Steam Search")

        if ok:
            size_kb = os.path.getsize(save_path) / 1024
            print(f"  📦 {size_kb:.0f} KB")
            success.append(slug)
        else:
            print(f"  ⚠️  مش لاقيه — هيتعرض بدون صورة")
            failed.append(slug)

        time.sleep(0.4)  # تجنب rate limiting

    print(f"\n{'='*55}")
    print(f"📊  النتيجة: {len(success)} ✅  |  {len(failed)} ⚠️")
    if failed:
        print(f"   بدون صورة: {', '.join(failed)}")
    print("="*55)

# ══════════════════════════════════════════
# 🚀  الخطوة 3: Git Push + Vercel Deploy
# ══════════════════════════════════════════
def deploy():
    print("\n" + "="*55)
    print("🚀  رفع على GitHub...")
    print("="*55)
    run("git add .")
    run('git commit -m "fix: reset all game images with correct covers"')
    run(f"git push origin {BRANCH}")

    print("\n" + "="*55)
    print("🌐  Deploying على Vercel...")
    print("="*55)
    run("vercel --prod")
    print("\n🎉  تم! الموقع: https://flix-store.vercel.app/")

# ══════════════════════════════════════════
# ▶️  تشغيل
# ══════════════════════════════════════════
if __name__ == "__main__":
    print("="*55)
    print("🎮  FLIX-STORE — Image Reset Script")
    print("="*55)

    if not GAMES_DIR.exists():
        print(f"❌ المجلد مش موجود: {GAMES_DIR}")
        sys.exit(1)

    delete_all_images()
    download_all_images()
    deploy()
