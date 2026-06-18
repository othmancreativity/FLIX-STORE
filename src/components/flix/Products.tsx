import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Gamepad2, AlertTriangle } from "lucide-react";
import { PurchaseFlow, type PurchaseOrder } from "./PurchaseFlow";
import GameSearch from "./GameSearch";

type Tier = "Essential" | "Extra";
type Duration = "شهر" | "3 شهور" | "سنة";
type AccountType = "Prim5" | "Prim4" | "Sec";

const TIERS: { id: Tier; tagline: string; accent: string; perks: string[] }[] = [
  {
    id: "Essential",
    tagline: "الأساسي",
    accent: "blue",
    perks: ["ألعاب شهرية مجانية", "اللعب أونلاين مع الأصدقاء", "تخزين سحابي للحفظ"],
  },
  {
    id: "Extra",
    tagline: "الموصى به",
    accent: "red",
    perks: ["كل مزايا Essential", "كتالوج +400 لعبة", "ألعاب Ubisoft+ Classics"],
  },
];

const DURATIONS: { id: Duration; label: string }[] = [
  { id: "شهر", label: "شهر" },
  { id: "3 شهور", label: "3 شهور" },
  { id: "سنة", label: "سنة" },
];

const ACCOUNTS: { id: AccountType; label: string; hint: string }[] = [
  { id: "Prim5", label: "PRIM 5", hint: "أساسي على PS5" },
  { id: "Prim4", label: "PRIM 4", hint: "أساسي على PS4" },
  { id: "Sec", label: "SEC", hint: "ثانوي" },
];

// 0 = غير متاح
const PRICES: Record<Tier, Record<Duration, Record<AccountType, number>>> = {
  Essential: {
    "شهر":   { Prim5: 450, Prim4: 225, Sec: 75 },
    "3 شهور": { Prim5: 900, Prim4: 350, Sec: 150 },
    "سنة":   { Prim5: 1800, Prim4: 600, Sec: 350 },
  },
  Extra: {
    "شهر":   { Prim5: 600, Prim4: 300, Sec: 150 },
    "3 شهور": { Prim5: 1200, Prim4: 600, Sec: 400 },
    "سنة":   { Prim5: 3000, Prim4: 1000, Sec: 800 },
  },
};

export function Products() {
  const [filteredGames, setFilteredGames] = useState<typeof products>(products);

  const [tier, setTier] = useState<Tier>("Extra");
  const [dur, setDur] = useState<Duration>("شهر");
  const [acc, setAcc] = useState<AccountType>("Prim5");
  const [flowOpen, setFlowOpen] = useState(false);

  const price = useMemo(() => PRICES[tier][dur][acc], [tier, dur, acc]);
  const accLabel = ACCOUNTS.find((a) => a.id === acc)!.label;
  const order: PurchaseOrder = {
    product: `PlayStation Plus ${tier}`,
    type: tier,
    duration: dur,
    account: accLabel,
    price,
  };

  const tierAccent = tier === "Essential"
    ? { ring: "border-sky-500", glow: "shadow-[0_0_22px_rgba(56,189,248,0.4)]", fill: "from-sky-500/30 to-sky-700/20", text: "text-sky-300", chip: "bg-sky-500" }
    : { ring: "border-red-500", glow: "shadow-[0_0_22px_rgba(204,0,0,0.45)]", fill: "from-red-500/30 to-red-700/20", text: "text-red-300", chip: "bg-red-500" };

  return (
    <section id="products" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-red-400 text-sm tracking-[0.3em] font-display">— المنتج المتاح —</span>
          <h2 className="section-heading text-chrome mt-2">PlayStation Plus</h2>
          <p className="text-white/60 mt-3">اختر النوع، المدة، ونوع الحساب — والسعر يتغير تلقائياً</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-flix p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30 blur-3xl"
            style={{ background: tier === "Essential" ? "radial-gradient(circle, #0070d1, transparent 70%)" : "radial-gradient(circle, #cc0000, transparent 70%)" }} />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #cc0000, transparent 70%)" }} />

      <GameSearch
        games={products}
        onFilter={setFilteredGames}
        placeholder="ابحث عن لعبة..."
      />

          <div className="relative grid lg:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center gap-2 text-red-300 text-xs tracking-widest">
                <Gamepad2 className="h-4 w-4" /> SONY PLAYSTATION
              </div>

              {/* Tier */}
              <div className="mt-6">
                <div className="text-sm text-white/60 mb-3">النوع</div>
                <div className="grid grid-cols-2 gap-2">
                  {TIERS.map((t) => {
                    const active = tier === t.id;
                    const isBlue = t.accent === "blue";
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTier(t.id)}
                        className={`relative px-3 py-3 rounded-lg font-display tracking-wider text-sm transition-all border ${
                          active
                            ? isBlue
                              ? "bg-gradient-to-b from-sky-500/30 to-sky-700/20 border-sky-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                              : "bg-gradient-to-b from-red-500/30 to-red-700/20 border-red-500 text-white shadow-[0_0_20px_rgba(204,0,0,0.4)]"
                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                        }`}
                      >
                        {t.id === "Extra" && !active && (
                          <span className="absolute -top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">الأفضل</span>
                        )}
                        {t.id}
                        <div className="text-[10px] mt-0.5 opacity-70">{t.tagline}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration */}
              <div className="mt-6">
                <div className="text-sm text-white/60 mb-3">المدة</div>
                <div className="grid grid-cols-3 gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDur(d.id)}
                      className={`px-3 py-3 rounded-lg font-display tracking-wider text-sm transition-all border ${
                        dur === d.id
                          ? `bg-gradient-to-b ${tierAccent.fill} ${tierAccent.ring} text-white ${tierAccent.glow}`
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account type */}
              <div className="mt-6">
                <div className="text-sm text-white/60 mb-3">نوع الحساب</div>
                <div className="grid grid-cols-3 gap-2">
                  {ACCOUNTS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAcc(a.id)}
                      className={`px-3 py-3 rounded-lg font-display tracking-wider text-sm transition-all border ${
                        acc === a.id
                          ? `bg-gradient-to-b ${tierAccent.fill} ${tierAccent.ring} text-white ${tierAccent.glow}`
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                      }`}
                    >
                      {a.label}
                      <div className="text-[10px] mt-0.5 opacity-70">{a.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Perks */}
              <ul className="mt-6 space-y-2">
                {TIERS.find((t) => t.id === tier)!.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-white/75">
                    <Check className={`h-4 w-4 ${tierAccent.text}`} /> {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: price + CTA */}
            <div className="flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-r border-white/10 lg:pr-10 pt-8 lg:pt-0">
              <div>
                <div className="text-xs tracking-[0.3em] text-white/40">السعر الإجمالي</div>
                <div className="mt-3 flex items-baseline gap-3">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={`${tier}-${dur}-${acc}`}
                      initial={{ opacity: 0, y: 18, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -18, scale: 0.9 }}
                      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                      className="font-display text-7xl sm:text-8xl text-red-stroke leading-none"
                    >
                      {price}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-white/60 text-lg">جنيه</span>
                </div>
                <div className="mt-2 text-sm text-white/50">
                  {tier} · {dur} · {accLabel}
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-300">
                  <Sparkles className="h-3 w-3" /> تسليم فوري بعد الدفع
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setFlowOpen(true)}
                  className="btn-flix !text-base w-full font-bold pulse-red"
                  style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}
                >
                  احصل عليه الآن 🎮
                </button>
                <p className="text-[11px] text-red-300/80 text-center mt-1">
                  ممنوع استرجاع الفلوس بعد التحويل — إلا في حالة خطأ من جانبنا أو تأخير ❌
                </p>
                <div className="flex items-start gap-2 text-[11px] text-white/50 mt-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>الطلبات: 01109664083 · الدفع: 01014956483</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <PurchaseFlow open={flowOpen} onClose={() => setFlowOpen(false)} order={order} />
    </section>
  );
}
