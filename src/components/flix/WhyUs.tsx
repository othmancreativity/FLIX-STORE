import { motion } from "framer-motion";
import { Zap, ShieldCheck, Gem, Headphones } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "تسليم فوري",
    desc: "أقل من 5 دقائق",
    stat: "5,000+",
    statLabel: "عملية تسليم",
  },
  {
    icon: ShieldCheck,
    title: "دفع آمن 100%",
    desc: "جميع طرق الدفع المصرية",
    stat: "100%",
    statLabel: "آمن ومحمي",
  },
  {
    icon: Gem,
    title: "جودة مضمونة",
    desc: "منتجات أصلية 100%",
    stat: "5.0",
    statLabel: "تقييم العملاء",
  },
  {
    icon: Headphones,
    title: "دعم 24/7",
    desc: "فريق دعم متاح دائماً",
    stat: "24/7",
    statLabel: "متاحون لخدمتك",
  },
];

export function WhyUs() {
  return (
    <section
      id="why"
      className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-black via-[#0a0a0a] to-black"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <span className="text-red-400 text-sm tracking-[0.3em] font-display">
            — لماذا نحن —
          </span>
          <h2 className="section-heading text-chrome mt-2">
            لماذا تختار FLIX STORE؟
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-flix p-6 text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl mb-5 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-800 shadow-[0_0_30px_rgba(204,0,0,0.5)]">
                <f.icon className="w-8 h-8 text-white" />
              </div>
              <div className="font-display text-4xl text-chrome">{f.stat}</div>
              <div className="text-xs text-white/50 mb-3">{f.statLabel}</div>
              <h3 className="font-display text-lg text-white tracking-wide">
                {f.title}
              </h3>
              <p className="text-sm text-white/55 mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
