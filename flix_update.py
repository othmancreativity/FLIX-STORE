#!/usr/bin/env python3
"""
FLIX-STORE Updater Script
- يضيف Search Bar في صفحة الألعاب
- يحمّل صور حقيقية لكل لعبة من RAWG API أو IGDB
- يرفع التغييرات على GitHub
- يعمل Deploy على Vercel
"""

import os
import sys
import json
import shutil
import subprocess
import urllib.request
import urllib.parse
import time
from pathlib import Path

# =============================================
# ⚙️ الإعدادات - عدّلها حسب جهازك
# =============================================
PROJECT_DIR = r"D:\projects\FLIX"
GITHUB_REPO = "othmancreativity/FLIX-STORE"
BRANCH = "main"

# RAWG API Key - مجاني من https://rawg.io/apidocs
# سجّل وخذ API key واكتبها هنا
RAWG_API_KEY = "3d34752d782e4b3bbf214b083967353d"

# =============================================
# 🎮 قائمة الألعاب مع أسمائها الصحيحة للبحث
# =============================================
GAMES = [
    {"file": "007.webp",           "search": "James Bond 007",                "title": "007"},
    {"file": "bf6.webp",           "search": "Battlefield 6",                 "title": "Battlefield 6"},
    {"file": "fc26.webp",          "search": "FIFA FC 26",                    "title": "EA Sports FC 26"},
    {"file": "g-acvalhalla.jpg",   "search": "Assassin's Creed Valhalla",     "title": "AC Valhalla"},
    {"file": "g-amongus.jpg",      "search": "Among Us",                      "title": "Among Us"},
    {"file": "g-arkascend.jpg",    "search": "ARK Survival Ascended",         "title": "ARK Ascended"},
    {"file": "g-arkevolved.png",   "search": "ARK Survival Evolved",          "title": "ARK Evolved"},
    {"file": "g-batman.png",       "search": "Batman Arkham Knight",          "title": "Batman Arkham Knight"},
    {"file": "g-bo3.jpg",          "search": "Call of Duty Black Ops 3",      "title": "COD BO3"},
    {"file": "g-bo4.jpg",          "search": "Call of Duty Black Ops 4",      "title": "COD BO4"},
    {"file": "g-choochoo.jpg",     "search": "Choo Choo Charles",             "title": "Choo-Choo Charles"},
    {"file": "g-codww2.jpg",       "search": "Call of Duty WW2",              "title": "COD WWII"},
    {"file": "g-dl1.jpg",          "search": "Dying Light",                   "title": "Dying Light"},
    {"file": "g-dl2.jpg",          "search": "Dying Light 2",                 "title": "Dying Light 2"},
    {"file": "g-dyinglight.jpg",   "search": "Dying Light Platinum Edition",  "title": "Dying Light Platinum"},
    {"file": "g-eldenring.jpg",    "search": "Elden Ring",                    "title": "Elden Ring"},
    {"file": "g-forza6.jpg",       "search": "Forza Motorsport 6",            "title": "Forza Motorsport 6"},
    {"file": "g-ghostrecon.png",   "search": "Ghost Recon Wildlands",         "title": "Ghost Recon"},
    {"file": "g-gowragnarok.jpg",  "search": "God of War Ragnarok",           "title": "God of War Ragnarök"},
    {"file": "g-gta6.png",         "search": "Grand Theft Auto 6",            "title": "GTA 6"},
    {"file": "g-ln1.png",          "search": "Little Nightmares",             "title": "Little Nightmares"},
    {"file": "g-ln2.jpg",          "search": "Little Nightmares 2",           "title": "Little Nightmares 2"},
    {"file": "g-ln3.jpg",          "search": "Little Nightmares 3",           "title": "Little Nightmares 3"},
    {"file": "g-mk1.jpg",          "search": "Mortal Kombat 1 2023",          "title": "Mortal Kombat 1"},
    {"file": "g-nightreign.png",   "search": "Elden Ring Nightreign",         "title": "Elden Ring Nightreign"},
    {"file": "g-nightreigndx.png", "search": "Elden Ring Nightreign Deluxe",  "title": "Nightreign Deluxe"},
    {"file": "g-overcooked2.jpg",  "search": "Overcooked 2",                  "title": "Overcooked 2"},
    {"file": "g-r6siege.jpg",      "search": "Rainbow Six Siege",             "title": "Rainbow Six Siege"},
    {"file": "g-re2.jpg",          "search": "Resident Evil 2 Remake",        "title": "RE2 Remake"},
    {"file": "g-re3.jpg",          "search": "Resident Evil 3 Remake",        "title": "RE3 Remake"},
    {"file": "g-re4remake.jpg",    "search": "Resident Evil 4 Remake",        "title": "RE4 Remake"},
    {"file": "g-re9.jpg",          "search": "Resident Evil 9",               "title": "Resident Evil 9"},
    {"file": "g-reanimal.jpg",     "search": "Resident Evil Welcome to Raccoon City", "title": "RE Animal"},
    {"file": "g-tekken7.jpg",      "search": "Tekken 7",                      "title": "Tekken 7"},
    {"file": "g-tombraider.jpg",   "search": "Shadow of the Tomb Raider",     "title": "Tomb Raider"},
    {"file": "gta5.webp",          "search": "Grand Theft Auto V",            "title": "GTA V"},
    {"file": "minecraft.webp",     "search": "Minecraft",                     "title": "Minecraft"},
    {"file": "rdr2.webp",          "search": "Red Dead Redemption 2",         "title": "RDR2"},
    {"file": "re-requiem.webp",    "search": "Resident Evil Requiem",         "title": "RE Requiem"},
    {"file": "wolverine.webp",     "search": "Marvel Wolverine",              "title": "Marvel's Wolverine"},
    {"file": "wwe26.webp",         "search": "WWE 2K26",                      "title": "WWE 2K26"},
    {"file": "yotei.webp",         "search": "Ghost of Yotei",                "title": "Ghost of Yotei"},
]

IMAGES_DIR = Path(PROJECT_DIR) / "src" / "assets" / "games"


# =============================================
# 🔧 الدوال المساعدة
# =============================================

def run(cmd, cwd=None, check=True):
    """تشغيل أمر في الـ shell"""
    print(f"\n▶ {cmd}")
    result = subprocess.run(
        cmd, shell=True, cwd=cwd or PROJECT_DIR,
        capture_output=True, text=True
    )
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr)
    if check and result.returncode != 0:
        print(f"❌ فشل الأمر: {cmd}")
        sys.exit(1)
    return result


def fetch_url(url, save_path=None, timeout=15):
    """تحميل URL"""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = resp.read()
            if save_path:
                with open(save_path, "wb") as f:
                    f.write(data)
                return True
            return data.decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"  ⚠️ فشل تحميل {url}: {e}")
        return None


def get_game_image_url_rawg(game_name):
    """جيب رابط صورة اللعبة من RAWG API"""
    if RAWG_API_KEY == "YOUR_RAWG_API_KEY_HERE":
        return None
    query = urllib.parse.quote(game_name)
    url = f"https://api.rawg.io/api/games?key={RAWG_API_KEY}&search={query}&page_size=1"
    data = fetch_url(url)
    if data:
        try:
            obj = json.loads(data)
            results = obj.get("results", [])
            if results and results[0].get("background_image"):
                return results[0]["background_image"]
        except Exception:
            pass
    return None


def get_game_image_url_steam(game_name):
    """
    بديل مجاني: ابحث عن صورة اللعبة من SteamGridDB أو موقع مفتوح
    هنا بنستخدم Wikipedia / OpenGraph كـ fallback
    """
    # Steam Store Search (مجاني بدون API key)
    query = urllib.parse.quote(game_name)
    url = f"https://store.steampowered.com/search/suggest?term={query}&f=games&cc=US&l=en"
    data = fetch_url(url)
    if data:
        # parse simple HTML to find app IDs
        import re
        match = re.search(r'href="https://store\.steampowered\.com/app/(\d+)/', data)
        if match:
            app_id = match.group(1)
            # Steam header image (460x215)
            img_url = f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/header.jpg"
            return img_url
    return None


def download_game_images():
    """حمّل صور الألعاب الحقيقية"""
    print("\n" + "="*50)
    print("📥 تحميل صور الألعاب...")
    print("="*50)

    success = 0
    failed = []

    for game in GAMES:
        img_path = IMAGES_DIR / game["file"]
        print(f"\n🎮 {game['title']}...")

        # جرّب RAWG أولاً
        img_url = get_game_image_url_rawg(game["search"])

        # جرّب Steam كـ fallback
        if not img_url:
            img_url = get_game_image_url_steam(game["search"])

        if img_url:
            # حدّد الامتداد الصحيح
            ext = Path(game["file"]).suffix
            temp_path = str(img_path) + ".tmp"
            if fetch_url(img_url, temp_path):
                # تحقق إن الملف اتحمّل صح (أكبر من 5KB)
                if os.path.exists(temp_path) and os.path.getsize(temp_path) > 5000:
                    shutil.move(temp_path, img_path)
                    print(f"  ✅ تم تحميل صورة {game['title']}")
                    success += 1
                else:
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
                    print(f"  ⚠️ الصورة صغيرة جداً، محتفظ بالأصلية")
                    failed.append(game["title"])
            else:
                failed.append(game["title"])
        else:
            print(f"  ⚠️ مش لاقي صورة لـ {game['title']}, محتفظ بالأصلية")
            failed.append(game["title"])

        time.sleep(0.3)  # تجنب rate limiting

    print(f"\n📊 النتيجة: {success} صورة اتحملت، {len(failed)} محتفظ بيها")
    if failed:
        print(f"   ألعاب بدون صور جديدة: {', '.join(failed)}")


def create_search_component():
    """إنشاء مكوّن بحث جديد"""
    search_path = Path(PROJECT_DIR) / "src" / "components" / "flix" / "GameSearch.tsx"

    content = '''import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

interface Game {
  id: string | number;
  title: string;
  image?: string;
  price?: number | string;
  category?: string;
  [key: string]: unknown;
}

interface GameSearchProps {
  games: Game[];
  onFilter: (filtered: Game[]) => void;
  placeholder?: string;
}

export default function GameSearch({ games, onFilter, placeholder = "ابحث عن لعبة..." }: GameSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return games;
    const q = query.toLowerCase();
    return games.filter((g) =>
      g.title?.toLowerCase().includes(q) ||
      g.category?.toLowerCase().includes(q)
    );
  }, [query, games]);

  // أبلغ المكوّن الأب بالتغيير
  const handleChange = (value: string) => {
    setQuery(value);
    const q = value.toLowerCase();
    const result = !value.trim()
      ? games
      : games.filter((g) =>
          g.title?.toLowerCase().includes(q) ||
          g.category?.toLowerCase().includes(q)
        );
    onFilter(result);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <div className="relative flex items-center">
        {/* أيقونة البحث */}
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />

        {/* حقل البحث */}
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          dir="rtl"
          className="
            w-full
            bg-white/10 backdrop-blur-md
            border border-white/20
            rounded-2xl
            py-3 pr-12 pl-10
            text-white placeholder-gray-400
            text-base
            outline-none
            focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30
            transition-all duration-200
            shadow-lg
          "
        />

        {/* زر مسح البحث */}
        {query && (
          <button
            onClick={() => handleChange("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* عداد النتائج */}
      {query && (
        <p className="text-center text-sm text-gray-400 mt-2">
          {filtered.length === 0
            ? "مفيش نتائج 😔"
            : `${filtered.length} لعبة`}
        </p>
      )}
    </div>
  );
}
'''

    with open(search_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ تم إنشاء GameSearch.tsx")


def update_products_component():
    """تعديل Products.tsx لإضافة Search Bar"""
    products_path = Path(PROJECT_DIR) / "src" / "components" / "flix" / "Products.tsx"

    if not products_path.exists():
        print("⚠️ ملف Products.tsx مش موجود!")
        return

    with open(products_path, "r", encoding="utf-8") as f:
        content = f.read()

    # تحقق إذا Search مضافة خلاص
    if "GameSearch" in content:
        print("ℹ️ Search Bar موجودة بالفعل في Products.tsx")
        return

    # أضف import في أول الملف
    import_line = 'import GameSearch from "./GameSearch";\n'
    if import_line not in content:
        # أضف بعد آخر import
        lines = content.split("\n")
        last_import_idx = 0
        for i, line in enumerate(lines):
            if line.startswith("import "):
                last_import_idx = i
        lines.insert(last_import_idx + 1, 'import GameSearch from "./GameSearch";')
        content = "\n".join(lines)

    # أضف state للـ filtered games
    if "filteredGames" not in content:
        # ابحث عن أول useState
        state_insert = '''  const [filteredGames, setFilteredGames] = useState<typeof products>(products);\n'''
        # أضفه بعد أول {  في الـ component function
        idx = content.find("export default function")
        if idx == -1:
            idx = content.find("export function")
        if idx == -1:
            idx = content.find("const Products")
        if idx != -1:
            brace_idx = content.find("{", idx)
            if brace_idx != -1:
                content = content[:brace_idx+1] + "\n" + state_insert + content[brace_idx+1:]

    # أضف useState import لو مش موجود
    if "useState" not in content:
        content = content.replace(
            'import React',
            'import React, { useState }'
        )
        if "from 'react'" in content and "useState" not in content:
            content = content.replace(
                "from 'react'",
                "{ useState } from 'react'"
            )

    # أضف GameSearch قبل أول <div className أو <section
    search_jsx = '''      <GameSearch
        games={products}
        onFilter={setFilteredGames}
        placeholder="ابحث عن لعبة..."
      />\n'''

    # ابحث عن مكان مناسب لإضافة Search (قبل grid الألعاب)
    grid_markers = [
        'grid-cols',
        '<div className="grid',
        'products.map',
        'games.map',
    ]
    for marker in grid_markers:
        idx = content.find(marker)
        if idx != -1:
            # ارجع للسطر السابق
            line_start = content.rfind("\n", 0, idx)
            content = content[:line_start] + "\n" + search_jsx + content[line_start:]
            print(f"✅ تم إضافة Search Bar قبل '{marker}'")
            break

    # استبدل products.map بـ filteredGames.map
    content = content.replace("products.map(", "filteredGames.map(")
    content = content.replace("{products.map(", "{filteredGames.map(")

    with open(products_path, "w", encoding="utf-8") as f:
        f.write(content)

    print("✅ تم تعديل Products.tsx")


def add_responsive_styles():
    """أضف styles للـ search bar في styles.css"""
    styles_path = Path(PROJECT_DIR) / "src" / "styles.css"

    extra_css = """
/* ===== Game Search Bar ===== */
.game-search-wrapper {
  width: 100%;
  max-width: 640px;
  margin: 0 auto 2rem;
  padding: 0 1rem;
}

@media (max-width: 640px) {
  .game-search-wrapper {
    padding: 0 0.75rem;
    margin-bottom: 1.5rem;
  }
}
"""

    with open(styles_path, "a", encoding="utf-8") as f:
        f.write(extra_css)

    print("✅ تم إضافة styles للـ Search Bar")


def update_vite_config():
    """تعديل vite.config.ts لإضافة nitro: vercel"""
    vite_path = Path(PROJECT_DIR) / "vite.config.ts"

    if not vite_path.exists():
        print("⚠️ vite.config.ts مش موجود!")
        return

    with open(vite_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "preset" in content and "vercel" in content:
        print("ℹ️ nitro preset=vercel موجود بالفعل")
        return

    # أضف nitro config
    old = """export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});"""

    new = """export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
});"""

    if old in content:
        content = content.replace(old, new)
        with open(vite_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("✅ تم تعديل vite.config.ts لإضافة nitro preset=vercel")
    else:
        # محاولة بديلة
        if "nitro" not in content:
            content = content.replace(
                "});",
                '  nitro: {\n    preset: "vercel",\n  },\n});',
                1
            )
            with open(vite_path, "w", encoding="utf-8") as f:
                f.write(content)
            print("✅ تم إضافة nitro config في vite.config.ts")


def git_push():
    """ارفع التغييرات على GitHub"""
    print("\n" + "="*50)
    print("🚀 رفع التغييرات على GitHub...")
    print("="*50)

    run("git add .", cwd=PROJECT_DIR)
    run('git commit -m "feat: add game search bar + update game images + fix vercel deploy"', cwd=PROJECT_DIR)
    run(f"git push origin {BRANCH}", cwd=PROJECT_DIR)
    print("✅ تم الرفع على GitHub بنجاح!")


def vercel_deploy():
    """Deploy على Vercel"""
    print("\n" + "="*50)
    print("🌐 Deploying على Vercel...")
    print("="*50)

    # تحقق إن vercel CLI موجود
    result = run("vercel --version", check=False)
    if result.returncode != 0:
        print("⚠️ vercel CLI مش مثبت، بيتثبت دلوقتي...")
        run("npm install -g vercel")

    # Deploy على production
    run("vercel --prod --yes", cwd=PROJECT_DIR)
    print("✅ تم الـ Deploy بنجاح!")
    print(f"🌍 الموقع: https://flix-store.vercel.app/")


# =============================================
# 🚀 التشغيل الرئيسي
# =============================================

def main():
    print("="*60)
    print("🎮 FLIX-STORE Updater")
    print("="*60)

    # تحقق إن المجلد موجود
    if not Path(PROJECT_DIR).exists():
        print(f"❌ المجلد مش موجود: {PROJECT_DIR}")
        sys.exit(1)

    if not IMAGES_DIR.exists():
        print(f"❌ مجلد الصور مش موجود: {IMAGES_DIR}")
        sys.exit(1)

    print(f"📁 المشروع: {PROJECT_DIR}")
    print(f"🖼️  مجلد الصور: {IMAGES_DIR}")

    # ============ الخطوة 1: تحميل الصور ============
    if RAWG_API_KEY != "YOUR_RAWG_API_KEY_HERE":
        print("\n✅ RAWG API Key موجود، بيحمّل الصور...")
        download_game_images()
    else:
        print("\n⚠️  RAWG API Key مش موجود، بيجرب Steam بدله...")
        download_game_images()

    # ============ الخطوة 2: إنشاء Search Component ============
    print("\n" + "="*50)
    print("🔍 إنشاء Search Bar Component...")
    print("="*50)
    create_search_component()

    # ============ الخطوة 3: تعديل Products.tsx ============
    print("\n" + "="*50)
    print("✏️  تعديل Products.tsx...")
    print("="*50)
    update_products_component()

    # ============ الخطوة 4: إضافة Styles ============
    add_responsive_styles()

    # ============ الخطوة 5: تعديل vite.config.ts ============
    print("\n" + "="*50)
    print("⚙️  تعديل vite.config.ts...")
    print("="*50)
    update_vite_config()

    # ============ الخطوة 6: GitHub Push ============
    git_push()

    # ============ الخطوة 7: Vercel Deploy ============
    vercel_deploy()

    print("\n" + "="*60)
    print("🎉 كل التعديلات اتعملت بنجاح!")
    print(f"🌍 الموقع: https://flix-store.vercel.app/")
    print("="*60)


if __name__ == "__main__":
    main()
