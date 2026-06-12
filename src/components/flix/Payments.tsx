import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const methods = [
  { id: "instapay", logo: "/images/payments/instapay.png" },
  { id: "vodafone-cash", logo: "/images/payments/vodafone-cash.svg" },
  { id: "we-pay", logo: "/images/payments/we-pay.svg" },
  { id: "telda", logo: "/images/payments/telda.png" },
  { id: "klivvr", logo: "/images/payments/klivvr.svg" },
];

export function Payments() {
  return (
    <section className="section-below-fold relative py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <span className="text-red-400 text-sm tracking-[0.3em] font-display">— طرق الدفع —</span>
          <h2 className="section-heading text-chrome mt-2">ادفع بسهولة</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {methods.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="p-6 flex items-center justify-center rounded-xl"
            >
              <img
                src={m.logo}
                alt={m.id}
                width="120"
                height="48"
                className="max-w-full max-h-12 object-contain"
                loading="lazy"
              />
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
