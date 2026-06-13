import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Flame, ChevronDown, X } from "lucide-react";
import { WA_NUMBERS, waLink } from "@/lib/products";

type Platform = "PS4" | "PS5";
type Game = {
  slug: string;
  name: string;
  poster?: string; // optional — drop a file at src/assets/games/<slug>.jpg
  platforms: Platform[];
  prices: { prim5?: number; prim4?: number; sec?: number };
  accent: string; // tailwind gradient classes for fallback card
};

const GAMES: Game[] = [
  { slug: "gta5",       name: "Grand Theft Auto V",       platforms: ["PS4", "PS5"], prices: { prim5: 500, prim4: 350, sec: 300 }, accent: "from-rose-700 via-red-900 to-black" },
  { slug: "fc26",       name: "EA Sports FC 26",          platforms: ["PS4", "PS5"], prices: { prim5: 600, prim4: 350, sec: 300 }, accent: "from-emerald-600 via-emerald-900 to-black" },
  { slug: "bf6",        name: "Battlefield 6",            platforms: ["PS5"],        prices: { prim5: 1350, sec: 950 },             accent: "from-orange-600 via-amber-900 to-black" },
  { slug: "007",        name: "007: First Light",         platforms: ["PS5"],        prices: { prim5: 1600, sec: 1200 },            accent: "from-yellow-600 via-zinc-800 to-black" },
  { slug: "yotei",      name: "Ghost of Yōtei",           platforms: ["PS5"],        prices: { prim5: 1500, sec: 1000 },            accent: "from-red-600 via-rose-900 to-black" },
  { slug: "rdr2",       name: "Red Dead Redemption II",   platforms: ["PS4", "PS5"], prices: { prim5: 500, prim4: 350, sec: 300 }, accent: "from-amber-700 via-orange-950 to-black" },
  { slug: "wwe26",      name: "WWE 2K26",                 platforms: ["PS5"],        prices: { prim5: 1600, sec: 1200 },            accent: "from-red-700 via-red-950 to-black" },
  { slug: "minecraft",  name: "Minecraft",                platforms: ["PS4", "PS5"], prices: { prim5: 500, prim4: 350, sec: 300 }, accent: "from-lime-600 via-emerald-900 to-black" },
  { slug: "re-requiem", name: "Resident Evil: Requiem",   platforms: ["PS5"],        prices: { prim5: 1450, sec: 1000 },            accent: "from-red-800 via-zinc-900 to-black" },
  { slug: "wolverine",  name: "Marvel's Wolverine",       platforms: ["PS5"],        prices: { prim5: 1600, sec: 1200 },            accent: "from-yellow-600 via-amber-900 to-black" },
];

// Try to load any user-provided posters at build time. The files are optional —
// missing slugs gracefully fall back to a stylized typographic cover.
const posterModules = import.meta.glob("../../assets/games/*.{jpg,jpeg,png,webp}", {
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
  // Fallback — stylized typographic cover, no fake/AI art
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

function PriceRow({ label, value }: { label: string; value?: number }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
      <span className="text-white/50 tracking-wider font-display">{label}</span>
      <span className="font-display"><span className="text-red-400">{value}</span> <span className="text-white/40 text-[10px]">EGP</span></span>
    </div>
  );
}

export function Offers() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {GAMES.map((g, i) => {
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

      {/* Modal */}
      <AnimatePresence>
        {openSlug && (() => {
          const g = GAMES.find((x) => x.slug === openSlug)!;
          const msg = `مرحباً FLIX STORE، أريد ${g.name} (${g.platforms.join(" / ")})`;
          return (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setOpenSlug(null)}
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
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-red-500 transition"
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
                  <div className="text-xs tracking-[0.3em] text-white/40 mb-3">الأسعار المتاحة</div>
                  <div className="rounded-lg bg-white/[0.03] border border-white/10 px-4">
                    <PriceRow label="PRIM 5" value={g.prices.prim5} />
                    <PriceRow label="PRIM 4" value={g.prices.prim4} />
                    <PriceRow label="SEC"    value={g.prices.sec} />
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    <a
                      href={waLink(WA_NUMBERS[0], msg)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-flix !text-sm w-full justify-center"
                    >
                      <MessageCircle className="h-4 w-4" /> اطلب الآن عبر WhatsApp
                    </a>
                    <a
                      href={waLink(WA_NUMBERS[1], msg)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost-flix !py-2 !text-xs w-full justify-center"
                    >
                      واتساب بديل · {WA_NUMBERS[1].replace("20", "0")}
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
