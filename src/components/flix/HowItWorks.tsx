import { motion } from "framer-motion";
import { ShoppingBag, Wallet, Zap } from "lucide-react";

const steps = [
  {
    icon: ShoppingBag,
    title: "اختر منتجك ومدته",
    desc: "تصفح المنتجات واختر النوع والمدة المناسبة",
  },
  {
    icon: Wallet,
    title: "ادفع بطريقتك المفضلة",
    desc: "حول المبلغ على أحد طرق الدفع المتاحة وارفع إيصال التحويل",
  },
  {
    icon: Zap,
    title: "استقبل اشتراكك فوراً",
    desc: "بعد تأكيد الدفع، يوصلك المنتج خلال دقائق قليلة",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 px-4 sm:px-6 bg-[#060606]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-red-400 text-sm tracking-[0.3em] font-display">
            — كيف تطلب —
          </span>
          <h2 className="section-heading text-chrome mt-2">3 خطوات بسيطة</h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* connecting line */}
          <div className="hidden md:block absolute top-12 right-[16.66%] left-[16.66%] h-px bg-gradient-to-l from-transparent via-red-500/50 to-transparent" />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center shadow-[0_0_40px_rgba(204,0,0,0.5)] border-4 border-black">
                <s.icon className="w-10 h-10 text-white" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black border-2 border-red-500 flex items-center justify-center font-display text-red-400">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-2xl text-chrome mt-6 tracking-wide">
                {s.title}
              </h3>
              <p className="text-white/60 mt-2 max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
