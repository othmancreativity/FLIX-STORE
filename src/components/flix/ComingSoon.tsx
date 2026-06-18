import { motion } from "framer-motion";
import { Clock, Tv, Gamepad2, Music2, Clapperboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Brand = {
  name: string;
  wordmark: string;
  tagline: string;
  gradient: string;
  accent: string;
  Icon: LucideIcon;
  font?: string;
};

const UPCOMING: Brand[] = [
  {
    name: "Netflix",
    wordmark: "NETFLIX",
    tagline: "اشتراكات الأفلام والمسلسلات",
    gradient: "from-red-700 via-red-900 to-black",
    accent: "text-red-500",
    Icon: Clapperboard,
    font: "font-display tracking-[0.18em]",
  },
  {
    name: "Shahid VIP",
    wordmark: "shahid",
    tagline: "المحتوى العربي الحصري",
    gradient: "from-purple-700 via-fuchsia-900 to-black",
    accent: "text-fuchsia-300",
    Icon: Tv,
    font: "font-display lowercase tracking-tight italic",
  },
  {
    name: "Xbox Game Pass",
    wordmark: "XBOX",
    tagline: "مكتبة ألعاب ضخمة",
    gradient: "from-emerald-600 via-emerald-950 to-black",
    accent: "text-emerald-300",
    Icon: Gamepad2,
    font: "font-display tracking-[0.22em]",
  },
  {
    name: "Spotify",
    wordmark: "Spotify",
    tagline: "موسيقى بلا إعلانات",
    gradient: "from-green-600 via-green-900 to-black",
    accent: "text-green-300",
    Icon: Music2,
    font: "font-display tracking-tight",
  },
];

export function ComingSoon() {
  return (
    <section id="soon" className="relative py-24 px-4 sm:px-6 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-red-400 text-sm tracking-[0.3em] font-display">— توسعنا مستمر —</span>
          <h2 className="section-heading text-chrome mt-2">المزيد قادم قريباً</h2>
          <p className="text-white/60 mt-3">نحضّر باقة متكاملة من أفضل المنتجات الرقمية — ترقّبوا الإطلاق</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPCOMING.map((u, i) => {
            const { Icon } = u;
            return (
              <motion.div
                key={u.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent group hover:border-red-500/40 transition-all"
              >
                <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-1 rounded-full bg-red-500 text-white shadow-[0_0_12px_rgba(204,0,0,0.7)]">
                  <Clock className="h-3 w-3" /> قريباً
                </span>

                <div
                  dir="ltr"
                  className={`relative h-40 bg-gradient-to-br ${u.gradient} overflow-hidden flex flex-col items-center justify-center gap-2`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.22),transparent_65%)]" />
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                      backgroundSize: "22px 22px",
                    }}
                  />
                  <Icon className={`relative h-9 w-9 ${u.accent} drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]`} />
                  <span
                    className={`relative text-3xl sm:text-4xl text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.7)] ${u.font ?? "font-display"}`}
                  >
                    {u.wordmark}
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </div>

                <div className="p-4">
                  <div className="font-display text-lg text-white/90 tracking-wider">{u.name}</div>
                  <div className="text-xs text-white/40 mt-1">{u.tagline}</div>
                  <div className="mt-3 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-red-500 to-red-700 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10 text-sm text-white/50">
          هل تريد منتجاً معيناً؟{" "}
          <a href="#contact" className="text-red-400 hover:text-red-300 underline underline-offset-4">
            راسلنا واطلبه
          </a>
        </div>
      </div>
    </section>
  );
}
