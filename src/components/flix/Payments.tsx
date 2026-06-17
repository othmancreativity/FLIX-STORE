import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const methods = [
  { name: "InstaPay", sub: "تحويل فوري" },
  { name: "Vodafone Cash", sub: "محفظة فودافون" },
  { name: "Telda", sub: "كارت تيلدا" },
];

export function Payments() {
  return (
    <section className="relative py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <span className="text-red-400 text-sm tracking-[0.3em] font-display">— طرق الدفع —</span>
          <h2 className="section-heading text-chrome mt-2">ادفع بسهولة</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {methods.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-flix p-6 text-center"
            >
              <div className="font-display text-xl text-white tracking-wide">{m.name}</div>
              <div className="text-xs text-white/50 mt-1">{m.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/50">
          <Lock className="w-4 h-4 text-green-400" />
          جميع المدفوعات آمنة ومحمية بالكامل
        </div>
      </div>
    </section>
  );
}
