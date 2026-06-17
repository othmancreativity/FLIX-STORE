import { motion } from "framer-motion";
import { Gamepad2, Film, Music, Joystick, Shield, Apple } from "lucide-react";

const cats = [
  {
    icon: Gamepad2,
    title: "اشتراكات بلايستيشن",
    desc: "PS Plus Essential / Extra / Premium",
  },
  {
    icon: Film,
    title: "منصات الستريمينج",
    desc: "Netflix • Disney+ • Shahid • OSN+",
  },
  {
    icon: Music,
    title: "تطبيقات الموسيقى",
    desc: "Spotify • YouTube Premium • Anghami",
  },
  {
    icon: Joystick,
    title: "رصيد الألعاب",
    desc: "PUBG • Free Fire • Fortnite • Xbox",
  },
  { icon: Shield, title: "VPN والخصوصية", desc: "NordVPN • ExpressVPN" },
  { icon: Apple, title: "خدمات Apple", desc: "iCloud • Apple One • App Store" },
];

export function Categories() {
  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="text-red-400 text-sm tracking-[0.3em] font-display">
              — عروضنا —
            </span>
            <h2 className="section-heading text-chrome mt-2">اختر فئتك</h2>
          </div>
          <p className="text-white/60 max-w-md">
            كل ما تحتاجه من ترفيه رقمي في مكان واحد
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cats.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-flix p-7 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-900/10 border border-red-500/30 group-hover:from-red-500/40 group-hover:shadow-[0_0_24px_rgba(204,0,0,0.5)] transition-all">
                  <c.icon className="w-7 h-7 text-red-400" />
                </div>
                <span className="font-display text-5xl text-white/5 group-hover:text-red-500/20 transition">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display text-xl tracking-wide text-white mb-2">
                {c.title}
              </h3>
              <p className="text-white/55 text-sm">{c.desc}</p>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
