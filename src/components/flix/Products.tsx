import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { waLink, WA_NUMBERS } from "@/lib/products";
import { Check, MessageCircle, Sparkles, Gamepad2 } from "lucide-react";

type SubOption = "Prim5" | "Prim4" | "Sec";
type Tier = "Essential" | "Extra";
type Duration = "شهر" | "3 شهور" | "سنة";

const TIERS: { id: Tier; tagline: string; perks: string[] }[] = [
  { id: "Essential", tagline: "الاساسي", perks: ["ألعاب شهرية", "اللعب أونلاين", "تخزين سحابي"] },
  { id: "Extra", tagline: "الموصى به", perks: ["كل مزايا Essential", "+400 لعبة في الكتالوج", "ألعاب Ubisoft+"] },
];

const SUB_OPTIONS: { id: SubOption; label: string; desc: string }[] = [
  { id: "Prim5", label: "Prim5", desc: "حساب أساسي 5" },
  { id: "Prim4", label: "Prim4", desc: "حساب أساسي 4" },
  { id: "Sec", label: "Sec", desc: "حساب ثانوي" },
];

const DURATIONS: Duration[] = ["شهر", "3 شهور", "سنة"];

const PRICES: Record<Tier, Record<Duration, Record<SubOption, number>>> = {
  Essential: {
    "شهر": { Prim5: 450, Prim4: 225, Sec: 75 },
    "3 شهور": { Prim5: 900, Prim4: 350, Sec: 150 },
    "سنة": { Prim5: 1800, Prim4: 600, Sec: 350 },
  },
  Extra: {
    "شهر": { Prim5: 600, Prim4: 300, Sec: 150 },
    "3 شهور": { Prim5: 1200, Prim4: 600, Sec: 400 },
    "سنة": { Prim5: 3000, Prim4: 1000, Sec: 800 },
  },
};

const TIER_STYLE: Record<Tier, { accent: string; border: string; glow: string; iconBg: string }> = {
  Essential: {
    accent: "text-blue-400",
    border: "border-blue-500/40",
    glow: "rgba(59,130,246,0.35)",
    iconBg: "from-blue-500 to-blue-800",
  },
  Extra: {
    accent: "text-red-400",
    border: "border-red-500/40",
    glow: "rgba(220,38,38,0.35)",
    iconBg: "from-red-500 to-red-800",
  },
};

export function Products() {
  const [tier, setTier] = useState<Tier>("Extra");
  const [sub, setSub] = useState<SubOption>("Prim5");
  const [dur, setDur] = useState<Duration>("شهر");

  const price = useMemo(() => PRICES[tier][dur][sub], [tier, dur, sub]);
  const style = TIER_STYLE[tier];
  const msg = `مرحباً FLIX STORE، أريد طلب: PlayStation Plus ${tier} ${sub} - ${dur} (${price} جنيه)`;

  return (
    <section id="products" className="section-below-fold relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-red-400 text-sm tracking-[0.3em] font-display">— المنتج المتاح —</span>
          <h2 className="section-heading text-chrome mt-2">PlayStation Plus</h2>
          <p className="text-white/60 mt-3">اختر النوع والحساب والمدة — السعر يتغير تلقائياً</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className={`card-flix p-6 sm:p-10 relative overflow-hidden ${style.border}`}
        >
          {/* Background glow */}
          <div
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30 blur-3xl"
            style={{ background: `radial-gradient(circle, ${style.glow}, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-30 blur-3xl"
            style={{ background: `radial-gradient(circle, ${style.glow}, transparent 70%)` }}
          />

          <div className="relative">
            <div className="flex items-center gap-2 text-xs tracking-widest mb-6">
              <Gamepad2 className="h-4 w-4" />
              <span className={style.accent}>SONY PLAYSTATION</span>
            </div>

            {/* Tier selector */}
            <div className="mb-6">
              <div className="text-sm text-white/60 mb-3">النوع</div>
              <div className="grid grid-cols-2 gap-2">
                {TIERS.map((t) => {
                  const ts = TIER_STYLE[t.id];
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTier(t.id)}
                      className={`relative px-4 py-3 rounded-lg font-display tracking-wider text-sm transition-all border ${
                        tier === t.id
                          ? `bg-gradient-to-b ${ts.iconBg}/20 ${ts.border} text-white`
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                      }`}
                      style={tier === t.id ? { boxShadow: `0 0 20px ${ts.glow}` } : undefined}
                    >
                      {t.id === "Extra" && tier !== "Extra" && (
                        <span className="absolute -top-2.5 right-2 text-[9px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">الأفضل</span>
                      )}
                      PS Plus {t.id}
                      <div className="text-[10px] mt-0.5 opacity-70">{t.tagline}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-option selector */}
            <div className="mb-6">
              <div className="text-sm text-white/60 mb-3">الحساب</div>
              <div className="grid grid-cols-3 gap-2">
                {SUB_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSub(o.id)}
                    className={`px-3 py-3 rounded-lg font-display tracking-wider text-sm transition-all border ${
                      sub === o.id
                        ? `bg-gradient-to-b ${style.iconBg}/20 ${style.border} text-white`
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                    }`}
                    style={sub === o.id ? { boxShadow: `0 0 20px ${style.glow}` } : undefined}
                  >
                    {o.label}
                    <div className="text-[10px] mt-0.5 opacity-70 font-sans">{o.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration selector */}
            <div className="mb-6">
              <div className="text-sm text-white/60 mb-3">المدة</div>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDur(d)}
                    className={`px-3 py-3 rounded-lg font-display tracking-wider text-sm transition-all border ${
                      dur === d
                        ? `bg-gradient-to-b ${style.iconBg}/20 ${style.border} text-white`
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                    }`}
                    style={dur === d ? { boxShadow: `0 0 20px ${style.glow}` } : undefined}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Perks */}
            <ul className="space-y-2 mb-6">
              {TIERS.find((t) => t.id === tier)!.perks.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-white/75">
                  <Check className="h-4 w-4 text-green-400" /> {p}
                </li>
              ))}
            </ul>

            {/* Price + CTA */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                  <div className="text-xs tracking-[0.3em] text-white/40">السعر الإجمالي</div>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span
                      key={`${tier}-${sub}-${dur}`}
                      className="font-display text-6xl sm:text-7xl text-red-stroke leading-none"
                    >
                      {price}
                    </span>
                    <span className="text-white/60 text-lg">EGP</span>
                  </div>
                  <div className="mt-1 text-sm text-white/50">
                    PS Plus {tier} · {sub} · {dur}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-300">
                    <Sparkles className="h-3 w-3" /> تسليم فوري بعد الدفع
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:min-w-[220px]">
                  <a
                    href={waLink(WA_NUMBERS[0], msg)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-flix !text-base"
                  >
                    <MessageCircle className="h-5 w-5" /> اطلب عبر WhatsApp
                  </a>
                  <a
                    href={waLink(WA_NUMBERS[1], msg)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost-flix !py-2.5 !text-xs"
                  >
                    واتساب بديل · {WA_NUMBERS[1].replace("20", "0")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
