import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChevronDown, X, Gamepad2, Lock } from "lucide-react";
import { PurchaseFlow, type PurchaseOrder } from "./PurchaseFlow";

type Platform = "PS4" | "PS5";
type Slots = { prim5: number | null; prim4: number | null; sec: number | null };
type Game = {
  slug: string;
  name: string;
  platforms: Platform[];
  slots: Slots;
  accent: string;
};

/**
 * Single source of truth for the PlayStation Games catalog.
 * Each price is the store's EGP price for that slot. `null` means the slot
 * is not available for that game (rendered disabled/grayed in the UI).
 */
const GAMES: Game[] = [
  // —— Poppy Playtime (1 → 5, grouped together) ——
  { slug: "pp1",           name: "Poppy Playtime",                     platforms: ["PS4", "PS5"], slots: { prim5: 190,  prim4: 190,  sec: 190  }, accent: "from-pink-600 via-rose-900 to-black" },
  { slug: "pp2",           name: "Poppy Playtime 2",                   platforms: ["PS4"],        slots: { prim5: null, prim4: 240,  sec: 240  }, accent: "from-pink-600 via-rose-900 to-black" },
  { slug: "pp3",           name: "Poppy Playtime 3",                   platforms: ["PS4", "PS5"], slots: { prim5: 350,  prim4: 350,  sec: 350  }, accent: "from-pink-600 via-rose-900 to-black" },
  { slug: "pp4",           name: "Poppy Playtime 4",                   platforms: ["PS4", "PS5"], slots: { prim5: 500,  prim4: 500,  sec: 500  }, accent: "from-pink-600 via-rose-900 to-black" },
  { slug: "pp5",           name: "Poppy Playtime 5",                   platforms: ["PS4"],        slots: { prim5: null, prim4: 900,  sec: 900  }, accent: "from-pink-600 via-rose-900 to-black" },

  // —— Little Nightmares (1 → 3, grouped together) ——
  { slug: "g-ln1",         name: "Little Nightmares 1",                platforms: ["PS4"],        slots: { prim5: null, prim4: 300,  sec: null }, accent: "from-slate-700 via-zinc-900 to-black" },
  { slug: "g-ln2",         name: "Little Nightmares 2",                platforms: ["PS4"],        slots: { prim5: null, prim4: 450,  sec: null }, accent: "from-slate-700 via-zinc-900 to-black" },
  { slug: "g-ln3",         name: "Little Nightmares 3",                platforms: ["PS4"],        slots: { prim5: null, prim4: 900,  sec: null }, accent: "from-slate-700 via-zinc-900 to-black" },

  // —— Resident Evil (2, 3, 4 Remake, Requiem — grouped together) ——
  { slug: "g-re2",         name: "Resident Evil 2",                    platforms: ["PS4"],        slots: { prim5: null, prim4: 350,  sec: 350  }, accent: "from-red-800 via-zinc-900 to-black" },
  { slug: "g-re3",         name: "Resident Evil 3",                    platforms: ["PS4"],        slots: { prim5: null, prim4: 350,  sec: 350  }, accent: "from-red-800 via-zinc-900 to-black" },
  { slug: "g-re4remake",   name: "Resident Evil 4 Remake (Arabic)",    platforms: ["PS5"],        slots: { prim5: 500,  prim4: null, sec: 500  }, accent: "from-red-800 via-zinc-900 to-black" },
  { slug: "re-requiem",    name: "Resident Evil: Requiem",             platforms: ["PS5"],        slots: { prim5: 1500, prim4: null, sec: 1500 }, accent: "from-red-800 via-zinc-900 to-black" },

  // —— Call of Duty: Black Ops (3 & 4 — grouped together) ——
  { slug: "g-bo3",         name: "Call of Duty: Black Ops 3",          platforms: ["PS4", "PS5"], slots: { prim5: 750,  prim4: 750,  sec: 750  }, accent: "from-orange-700 via-stone-950 to-black" },
  { slug: "g-bo4",         name: "Call of Duty: Black Ops 4",          platforms: ["PS4"],        slots: { prim5: null, prim4: 400,  sec: null }, accent: "from-orange-700 via-stone-950 to-black" },
  { slug: "g-codww2",      name: "Call of Duty: WWII",                 platforms: ["PS4", "PS5"], slots: { prim5: 200,  prim4: 200,  sec: 200  }, accent: "from-stone-700 via-zinc-950 to-black" },

  // —— Dying Light (1, 2, The Beast — grouped together) ——
  { slug: "g-dl1",         name: "Dying Light",                        platforms: ["PS4", "PS5"], slots: { prim5: 225,  prim4: 225,  sec: 225  }, accent: "from-amber-700 via-yellow-950 to-black" },
  { slug: "g-dl2",         name: "Dying Light 2",                      platforms: ["PS4", "PS5"], slots: { prim5: 500,  prim4: 500,  sec: 500  }, accent: "from-amber-600 via-yellow-900 to-black" },
  { slug: "g-dyinglight",  name: "Dying Light: The Beast",             platforms: ["PS5"],        slots: { prim5: 1200, prim4: null, sec: 1200 }, accent: "from-amber-600 via-yellow-900 to-black" },

  // —— Elden Ring (base + Nightreign + Nightreign Deluxe — grouped together) ——
  { slug: "g-eldenring",   name: "Elden Ring",                         platforms: ["PS4", "PS5"], slots: { prim5: 900,  prim4: 900,  sec: 900  }, accent: "from-yellow-700 via-amber-950 to-black" },
  { slug: "g-nightreign",  name: "Elden Ring: Nightreign",             platforms: ["PS4"],        slots: { prim5: null, prim4: 1400, sec: null }, accent: "from-amber-700 via-yellow-950 to-black" },
  { slug: "g-nightreigndx", name: "Elden Ring: Nightreign — Deluxe Edition", platforms: ["PS5"], slots: { prim5: 2000, prim4: null, sec: null }, accent: "from-amber-600 via-yellow-900 to-black" },

  // —— ARK: Survival (Evolved + Ascended — grouped together) ——
  { slug: "g-arkevolved",  name: "ARK: Survival Evolved",              platforms: ["PS5"],        slots: { prim5: 500,  prim4: null, sec: 500  }, accent: "from-emerald-700 via-emerald-950 to-black" },
  { slug: "g-arkascend",   name: "ARK: Survival Ascended",             platforms: ["PS4", "PS5"], slots: { prim5: null, prim4: null, sec: 1100 }, accent: "from-lime-700 via-emerald-950 to-black" },

  // —— Grand Theft Auto (V + VI — grouped together) ——
  { slug: "gta5",          name: "Grand Theft Auto V",                 platforms: ["PS4", "PS5"], slots: { prim5: 500,  prim4: 350,  sec: 300  }, accent: "from-rose-700 via-red-900 to-black" },
  { slug: "g-gta6",        name: "Grand Theft Auto VI",                platforms: ["PS5"],        slots: { prim5: 2650, prim4: null, sec: 2650 }, accent: "from-pink-600 via-rose-900 to-black" },

  // —— Remaining single titles ——
  { slug: "bf6",           name: "Battlefield 6",                      platforms: ["PS5"],        slots: { prim5: 1350, prim4: null, sec: 950  }, accent: "from-orange-600 via-amber-900 to-black" },
  { slug: "yotei",         name: "Ghost of Yōtei",                     platforms: ["PS5"],        slots: { prim5: 1500, prim4: null, sec: 1000 }, accent: "from-red-600 via-rose-900 to-black" },
  { slug: "rdr2",          name: "Red Dead Redemption II",             platforms: ["PS4", "PS5"], slots: { prim5: 500,  prim4: 350,  sec: 300  }, accent: "from-amber-700 via-orange-950 to-black" },
  { slug: "wolverine",     name: "Marvel's Wolverine",                 platforms: ["PS5"],        slots: { prim5: 2000, prim4: null, sec: 2000 }, accent: "from-yellow-600 via-amber-900 to-black" },
  { slug: "fc26",          name: "FC 26",                              platforms: ["PS4"],        slots: { prim5: null, prim4: 500,  sec: 500  }, accent: "from-emerald-600 via-emerald-900 to-black" },
  { slug: "007",           name: "007: First Light",                   platforms: ["PS4", "PS5"], slots: { prim5: 1900, prim4: 1900, sec: 1900 }, accent: "from-yellow-600 via-zinc-800 to-black" },
  { slug: "g-forza6",      name: "Forza Horizon",                      platforms: ["PS5"],        slots: { prim5: 2200, prim4: null, sec: 2200 }, accent: "from-blue-600 via-indigo-900 to-black" },
  { slug: "wwe26",         name: "WWE 2K26",                           platforms: ["PS5"],        slots: { prim5: 1500, prim4: null, sec: null }, accent: "from-red-700 via-red-950 to-black" },
  { slug: "g-ghostrecon",  name: "Ghost Recon",                        platforms: ["PS4"],        slots: { prim5: null, prim4: 200,  sec: 200  }, accent: "from-stone-600 via-stone-900 to-black" },
  { slug: "g-amongus",     name: "Among Us",                           platforms: ["PS5"],        slots: { prim5: 130,  prim4: null, sec: 130  }, accent: "from-rose-500 via-rose-900 to-black" },
  { slug: "g-tombraider",  name: "Tomb Raider Trilogy",                platforms: ["PS4"],        slots: { prim5: null, prim4: 200,  sec: 200  }, accent: "from-orange-700 via-stone-900 to-black" },
  { slug: "g-batman",      name: "Batman: Arkham Collection",          platforms: ["PS4", "PS5"], slots: { prim5: 350,  prim4: 350,  sec: 350  }, accent: "from-zinc-700 via-zinc-950 to-black" },
  { slug: "g-r6siege",     name: "Rainbow Six Siege",                  platforms: ["PS4", "PS5"], slots: { prim5: 550,  prim4: 550,  sec: 550  }, accent: "from-sky-700 via-zinc-900 to-black" },
  { slug: "g-choochoo",    name: "Choo-Choo Charles",                  platforms: ["PS4"],        slots: { prim5: null, prim4: 700,  sec: 700  }, accent: "from-red-700 via-stone-900 to-black" },
  { slug: "g-reanimal",    name: "REANIMAL",                           platforms: ["PS5"],        slots: { prim5: 1250, prim4: null, sec: 1250 }, accent: "from-fuchsia-700 via-purple-950 to-black" },
  { slug: "g-overcooked2", name: "Overcooked 2",                       platforms: ["PS4", "PS5"], slots: { prim5: 300,  prim4: 300,  sec: 300  }, accent: "from-orange-500 via-amber-800 to-black" },
  { slug: "g-acvalhalla",  name: "Assassin's Creed Valhalla",          platforms: ["PS4", "PS5"], slots: { prim5: null, prim4: null, sec: 300  }, accent: "from-slate-700 via-stone-900 to-black" },
  { slug: "g-mk1",         name: "Mortal Kombat 1",                    platforms: ["PS5"],        slots: { prim5: 800,  prim4: null, sec: 800  }, accent: "from-red-700 via-zinc-950 to-black" },
  { slug: "g-tekken7",     name: "Tekken 7",                           platforms: ["PS4", "PS5"], slots: { prim5: 350,  prim4: 350,  sec: 350  }, accent: "from-purple-700 via-zinc-950 to-black" },
  { slug: "minecraft",     name: "Minecraft",                          platforms: ["PS4", "PS5"], slots: { prim5: 600,  prim4: 600,  sec: 600  }, accent: "from-lime-600 via-emerald-900 to-black" },
  { slug: "g-gowragnarok", name: "God of War Ragnarök",                platforms: ["PS4", "PS5"], slots: { prim5: 800,  prim4: 800,  sec: 800  }, accent: "from-sky-700 via-slate-950 to-black" },

  // —— 10 additional games (to reach 50 total) ——
  { slug: "g-spiderman2",  name: "Marvel's Spider-Man 2",              platforms: ["PS5"],        slots: { prim5: 1350, prim4: null, sec: 1350 }, accent: "from-red-700 via-zinc-950 to-black" },
  { slug: "g-horizonfw",   name: "Horizon Forbidden West",             platforms: ["PS4", "PS5"], slots: { prim5: 600,  prim4: 600,  sec: 600  }, accent: "from-emerald-700 via-teal-950 to-black" },
  { slug: "g-lastofus2",   name: "The Last of Us Part II",             platforms: ["PS4", "PS5"], slots: { prim5: 550,  prim4: 550,  sec: 550  }, accent: "from-stone-700 via-zinc-950 to-black" },
  { slug: "g-ufc5",        name: "UFC 5",                              platforms: ["PS5"],        slots: { prim5: 700,  prim4: null, sec: 700  }, accent: "from-red-700 via-stone-950 to-black" },
  { slug: "g-eafc25",      name: "EA Sports FC 25",                    platforms: ["PS4", "PS5"], slots: { prim5: 450,  prim4: 450,  sec: 450  }, accent: "from-emerald-600 via-emerald-900 to-black" },
  { slug: "g-nba2k25",     name: "NBA 2K25",                           platforms: ["PS4", "PS5"], slots: { prim5: 500,  prim4: 500,  sec: 500  }, accent: "from-orange-700 via-stone-950 to-black" },
  { slug: "g-hogwarts",    name: "Hogwarts Legacy",                    platforms: ["PS4", "PS5"], slots: { prim5: 700,  prim4: 700,  sec: 700  }, accent: "from-amber-700 via-yellow-950 to-black" },
  { slug: "g-godofwar",    name: "God of War (2018)",                  platforms: ["PS4", "PS5"], slots: { prim5: 350,  prim4: 350,  sec: 350  }, accent: "from-sky-700 via-slate-950 to-black" },
  { slug: "g-stray",       name: "Stray",                              platforms: ["PS4", "PS5"], slots: { prim5: 300,  prim4: 300,  sec: 300  }, accent: "from-purple-700 via-zinc-950 to-black" },
  { slug: "g-itTakesTwo",  name: "It Takes Two",                       platforms: ["PS4", "PS5"], slots: { prim5: 300,  prim4: 300,  sec: 300  }, accent: "from-pink-600 via-rose-900 to-black" },
];

// Posters live in src/assets/games/<slug>.{jpg,png,webp}. Missing files
// fall back to a typographic cover — never AI-generated art.
const posterModules = import.meta.glob("@/assets/games/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const POSTERS: Record<string, string> = {};
for (const [path, url] of Object.entries(posterModules)) {
  const m = path.match(/\/([^/]+)\.(jpg|jpeg|png|webp)$/i);
  if (m) POSTERS[m[1].toLowerCase()] = url;
}

function CoverArt({ game }: { game: Game }) {
  const url = POSTERS[game.slug.toLowerCase()];
  if (url) {
    return (
      <img
        src={url}
        alt={game.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    );
  }
  const initials = game.name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${game.accent} flex items-center justify-center`}>
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 60%)" }} />
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <span className="relative font-display text-6xl text-white/90 tracking-tighter drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">{initials}</span>
    </div>
  );
}

function SlotRow({
  label,
  value,
  onBuy,
}: {
  label: string;
  value: number | null;
  onBuy: (account: string, price: number) => void;
}) {
  const available = value !== null;
  return (
    <div
      className={`flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0 ${available ? "" : "opacity-50"}`}
    >
      <span className="text-xs text-white/60 tracking-wider font-display">{label}</span>
      {available ? (
        <div className="flex items-center gap-2">
          <span className="font-display text-sm">
            <span className="text-red-400">{value}</span>{" "}
            <span className="text-white/40 text-[10px]">جنيه</span>
          </span>
          <button
            type="button"
            onClick={() => onBuy(label, value!)}
            className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-[11px] font-display tracking-wider transition shadow-[0_0_12px_rgba(204,0,0,0.4)]"
          >
            احصل عليه — {value} 🎮
          </button>
        </div>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/10 text-white/40 text-[11px] font-display tracking-wider">
          <Lock className="h-3 w-3" /> غير متاح
        </span>
      )}
    </div>
  );
}

export function Offers() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = searchQuery.trim()
    ? GAMES.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : GAMES;

  const startBuy = (g: Game, account: string, price: number) => {
    setOrder({
      product: g.name,
      type: g.name,
      duration: null,
      account,
      platform: g.platforms.length === 1 ? g.platforms[0] : g.platforms.join(" / "),
      price,
    });
    setOpenSlug(null);
  };

  return (
    <section id="offers" className="relative py-24 px-4 sm:px-6 border-t border-white/5">
      <div className="absolute inset-0 -z-10 opacity-60"
        style={{ background: "radial-gradient(ellipse at center, rgba(204,0,0,0.12), transparent 70%)" }} />

      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-red-400 text-sm tracking-[0.3em] font-display">
            <Flame className="h-4 w-4" /> — عروض حصرية —
          </span>
          <h2 className="section-heading text-chrome mt-2">Summer Offers · عروض الصيف</h2>
          <p className="text-white/60 mt-3">اضغط على أي لعبة لعرض الأسعار وزر الطلب</p>
        </div>

        {/* ===== Search Bar ===== */}
        <div className="w-full max-w-xl mx-auto mb-8 px-2">
          <div className="relative flex items-center">
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن لعبة..."
              dir="rtl"
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3 pr-12 pl-10 text-white placeholder-gray-400 text-base outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/30 transition-all duration-200 shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-center text-sm text-gray-400 mt-2">
              {filteredGames.length === 0 ? "مفيش نتائج 😔" : `${filteredGames.length} لعبة`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredGames.map((g, i) => {
            const isOpen = openSlug === g.slug;
            return (
              <motion.button
                key={g.slug}
                type="button"
                onClick={() => setOpenSlug(g.slug)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 5) * 0.05 }}
                className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-red-500/50 transition-all hover:shadow-[0_0_24px_rgba(204,0,0,0.3)] text-right"
                aria-expanded={isOpen}
                aria-label={`عرض أسعار ${g.name}`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <CoverArt game={g} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute top-2 left-2 flex gap-1">
                    {g.platforms.map((p) => (
                      <span key={p} className="text-[9px] font-display tracking-wider px-1.5 py-0.5 rounded bg-black/70 border border-white/20 text-white/90 backdrop-blur">
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-2.5">
                    <h3 className="font-display text-[13px] sm:text-sm text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] line-clamp-2">
                      {g.name}
                    </h3>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-red-300/90 group-hover:text-red-300 transition">
                      <ChevronDown className="h-3 w-3" /> اعرض الأسعار
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-center mt-6 text-xs text-white/40">
          الأسعار بالجنيه المصري · التسليم خلال دقائق بعد تأكيد الطلب
        </p>
      </div>

      <AnimatePresence>
        {openSlug && (() => {
          const g = GAMES.find((x) => x.slug === openSlug)!;
          return (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setOpenSlug(null)}
              dir="rtl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-2xl overflow-hidden border border-red-500/30 bg-[#0a0a0a] shadow-[0_0_60px_rgba(204,0,0,0.35)]"
              >
                <button
                  onClick={() => setOpenSlug(null)}
                  aria-label="إغلاق"
                  className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-red-500 transition"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative aspect-square">
                  <CoverArt game={g} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <div className="flex gap-1.5 mb-2">
                      {g.platforms.map((p) => (
                        <span key={p} className="text-[10px] font-display tracking-wider px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-200">
                          {p}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-display text-2xl text-white leading-tight">{g.name}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs tracking-[0.3em] text-white/40 mb-3">
                    <Gamepad2 className="h-3.5 w-3.5 text-red-400" /> اختر نوع الحساب والسعر
                  </div>
                  <div className="rounded-lg bg-white/[0.03] border border-white/10 px-4">
                    <SlotRow label="PRIM 5" value={g.slots.prim5} onBuy={(a, p) => startBuy(g, a, p)} />
                    <SlotRow label="PRIM 4" value={g.slots.prim4} onBuy={(a, p) => startBuy(g, a, p)} />
                    <SlotRow label="SEC"    value={g.slots.sec}   onBuy={(a, p) => startBuy(g, a, p)} />
                  </div>
                  <p className="text-[11px] text-white/40 text-center mt-3">
                    اضغط على أي سعر لبدء عملية الدفع · الخانات الرمادية غير متاحة لهذه اللعبة
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <PurchaseFlow open={!!order} onClose={() => setOrder(null)} order={order} />
    </section>
  );
}
