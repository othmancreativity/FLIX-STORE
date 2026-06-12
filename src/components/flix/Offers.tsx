import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { waLink, WA_NUMBERS } from "@/lib/products";
import { MessageCircle, ChevronDown, Gamepad2 } from "lucide-react";

type GameId = string;
type SubOption = "Prim5" | "Prim4" | "Sec";

type Game = {
  id: GameId;
  title: string;
  platforms: string[];
  pricing: Partial<Record<SubOption, number>>;
  gradient: string;
  accent: string;
  badge: string;
  image: string;
};

const GAMES: Game[] = [
  { id: "gta5", title: "Grand Theft Auto V", platforms: ["PS4", "PS5"], pricing: { Prim5: 500, Prim4: 350, Sec: 300 }, gradient: "from-amber-600 via-orange-700 to-red-900", accent: "text-amber-300", badge: "GTA V", image: "/images/games/gta5.webp" },
  { id: "ea-fc26", title: "EA Sports FC 26", platforms: ["PS4", "PS5"], pricing: { Prim5: 600, Prim4: 350, Sec: 300 }, gradient: "from-blue-600 via-blue-700 to-indigo-900", accent: "text-blue-300", badge: "FC 26", image: "/images/games/ea-fc26.webp" },
  { id: "bf6", title: "Battlefield 6", platforms: ["PS5"], pricing: { Prim5: 1350, Sec: 950 }, gradient: "from-orange-600 via-amber-700 to-yellow-900", accent: "text-orange-300", badge: "BF 6", image: "/images/games/bf6.webp" },
  { id: "007-fl", title: "007: First Light", platforms: ["PS5"], pricing: { Prim5: 1600, Sec: 1200 }, gradient: "from-zinc-800 via-zinc-900 to-black", accent: "text-zinc-300", badge: "007", image: "/images/games/007-fl.webp" },
  { id: "ghost-yotei", title: "Ghost of Yōtei", platforms: ["PS5"], pricing: { Prim5: 1500, Sec: 1000 }, gradient: "from-red-700 via-rose-800 to-stone-900", accent: "text-red-300", badge: "YŌTEI", image: "/images/games/ghost-yotei.webp" },
  { id: "rdr2", title: "Red Dead Redemption II", platforms: ["PS4", "PS5"], pricing: { Prim5: 500, Prim4: 350, Sec: 300 }, gradient: "from-red-800 via-amber-900 to-yellow-950", accent: "text-red-300", badge: "RDR II", image: "/images/games/rdr2.webp" },
  { id: "wwe-2k26", title: "WWE 2K26", platforms: ["PS5"], pricing: { Prim5: 1600, Sec: 1200 }, gradient: "from-red-600 via-rose-700 to-pink-900", accent: "text-red-300", badge: "WWE", image: "/images/games/wwe-2k26.webp" },
  { id: "minecraft", title: "Minecraft", platforms: ["PS4", "PS5"], pricing: { Prim5: 500, Prim4: 350, Sec: 300 }, gradient: "from-emerald-600 via-green-700 to-lime-900", accent: "text-emerald-300", badge: "Minecraft", image: "/images/games/minecraft.webp" },
  { id: "re-requiem", title: "Resident Evil: Requiem", platforms: ["PS5"], pricing: { Prim5: 1450, Sec: 1000 }, gradient: "from-red-950 via-rose-950 to-black", accent: "text-red-400", badge: "RE", image: "/images/games/re-requiem.webp" },
  { id: "marvel-wolverine", title: "Marvel Wolverine", platforms: ["PS5"], pricing: { Prim5: 1600, Sec: 1200 }, gradient: "from-yellow-500 via-amber-600 to-blue-800", accent: "text-yellow-300", badge: "WOLVERINE", image: "/images/games/marvel-wolverine.webp" },
];

const SUB_LABELS: Record<SubOption, string> = { Prim5: "Prim5", Prim4: "Prim4", Sec: "Sec" };
const SUB_DESCS: Record<SubOption, string> = { Prim5: "حساب أساسي 5", Prim4: "حساب أساسي 4", Sec: "حساب ثانوي" };

export function Offers() {
  const [expanded, setExpanded] = useState<GameId | null>(null);
  const [selected, setSelected] = useState<Record<GameId, SubOption>>({});

  const toggleGame = (id: GameId) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <section id="offers" className="section-below-fold relative py-24 px-4 sm:px-6 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <span className="text-red-400 text-sm tracking-[0.3em] font-display">— عروض خاصة —</span>
          <h2 className="section-heading text-chrome mt-2">عروض الصيف</h2>
          <p className="text-white/60 mt-3">عروض الصيف — اضغط على اللعبة لعرض الأسعار والطلب</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {GAMES.map((game) => {
            const isOpen = expanded === game.id;
            const subOpts = Object.keys(game.pricing) as SubOption[];
            const activeSub = selected[game.id] ?? subOpts[0];
            const price = game.pricing[activeSub]!;
            const msg = `مرحباً FLIX STORE، أريد طلب: ${game.title} ${activeSub} (${price} جنيه)`;

            return (
              <div key={game.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                  className="card-flix p-0 overflow-hidden cursor-pointer group"
                  onClick={() => toggleGame(game.id)}
                >
                  {/* Cover image */}
                    <div className={"h-44 relative overflow-hidden " + (game.image ? "bg-black" : "bg-gradient-to-br " + game.gradient)}>
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.title}
                        width="320"
                        height="176"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
                      <div>
                        <div className="font-display text-[10px] tracking-[0.2em] text-white/50">{game.badge}</div>
                        <h3 className="font-display text-base text-white leading-tight mt-0.5">{game.title}</h3>
                      </div>
                      <div className={`shrink-0 ${isOpen ? "rotate-180" : ""} transition-transform duration-300`}>
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      </div>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="px-4 py-2.5 flex items-center gap-2 border-t border-white/5">
                    <Gamepad2 className="w-3.5 h-3.5 text-white/40" />
                    {game.platforms.map((p) => (
                      <span key={p} className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/70">{p}</span>
                    ))}
                  </div>
                </motion.div>

                {/* Expanded configurator */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="card-flix p-4 mt-2 border-t-2"
                        style={{ borderTopColor: "rgba(204,0,0,0.6)" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-xs text-white/40 tracking-widest mb-3 font-display">— اختر الحساب —</div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {subOpts.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setSelected((prev) => ({ ...prev, [game.id]: opt }))}
                              className={`px-2 py-2.5 rounded-lg font-display text-xs transition-all border ${
                                activeSub === opt
                                  ? "bg-gradient-to-b from-red-500/30 to-red-700/20 border-red-500 text-white shadow-[0_0_15px_rgba(204,0,0,0.4)]"
                                  : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                              }`}
                            >
                              {SUB_LABELS[opt]}
                              <div className="text-[9px] mt-0.5 opacity-60 font-sans">{SUB_DESCS[opt]}</div>
                            </button>
                          ))}
                        </div>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-display text-3xl text-red-stroke">{price}</span>
                          <span className="text-white/60 text-xs">EGP</span>
                        </div>

                        <a
                          href={waLink(WA_NUMBERS[0], msg)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-flix !py-2 !px-4 !text-xs w-full"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> اطلب عبر WhatsApp
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
