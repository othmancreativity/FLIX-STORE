import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "أحمد م.",
    initial: "أ",
    color: "from-red-500 to-red-800",
    text: "اشتريت PS Plus Extra PRIM 5 وجالي خلال 4 دقائق بالظبط، سعر ممتاز وتسليم سريع جداً، هينصح بيهم",
  },
  {
    name: "سارة أ.",
    initial: "س",
    color: "from-purple-500 to-pink-700",
    text: "عملت اشتراك Essential SEC واتبعتلي البيانات فوراً، خدمة محترمة وأسعار أحسن من أي متجر تاني",
  },
  {
    name: "كريم ف.",
    initial: "ك",
    color: "from-blue-500 to-indigo-800",
    text: "من أفضل المتاجر في مصر لاشتراكات البلايستيشن، أصلية 100% وبيسلموا بسرعة مش طبيعية",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-black via-[#0c0606] to-black">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-red-400 text-sm tracking-[0.3em] font-display">
            — آراء العملاء —
          </span>
          <h2 className="section-heading text-chrome mt-2">
            ماذا يقول عملاؤنا؟
          </h2>
          <div className="flex justify-center gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-6 h-6 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <div className="text-white/60 mt-2 text-sm">
            متوسط 5.0 من 5 — بناءً على آلاف التقييمات
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-flix p-7"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center font-display text-xl text-white`}
                >
                  {r.initial}
                </div>
                <div>
                  <div className="font-display text-white tracking-wide">
                    {r.name}
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-white/75 text-sm leading-relaxed">
                "{r.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
