import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const UPCOMING = [
  { name: "Netflix", tagline: "اشتراكات الأفلام والمسلسلات", image: "/images/coming-soon/netflix.webp" },
  { name: "Spotify", tagline: "موسيقى بلا إعلانات", image: "/images/coming-soon/spotify.webp" },
  { name: "Shahid VIP", tagline: "المحتوى العربي الحصري", image: "/images/coming-soon/shahid.webp" },
  { name: "Xbox Game Pass", tagline: "مكتبة ألعاب ضخمة", image: "/images/coming-soon/xbox-game-pass.webp" },
];

export function ComingSoon() {
  return (
    <section id="soon" className="section-below-fold relative py-24 px-4 sm:px-6 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-red-400 text-sm tracking-[0.3em] font-display">— توسعنا مستمر —</span>
          <h2 className="section-heading text-chrome mt-2">المزيد قادم قريباً</h2>
          <p className="text-white/60 mt-3">نحضّر باقة متكاملة من أفضل المنتجات الرقمية — ترقّبوا الإطلاق</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {UPCOMING.map((u, i) => (
            <motion.div
              key={u.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent group"
            >
              <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-1 rounded-full bg-red-500 text-white shadow-[0_0_12px_rgba(204,0,0,0.7)]">
                <Clock className="h-3 w-3" /> قريباً
              </span>

              <div className="h-36 relative overflow-hidden">
                <img
                  src={u.image}
                  alt={u.name}
                  width={600}
                  height={350}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_60%)]" />
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </div>

              <div className="p-4">
                <div className="font-display text-lg text-white/90 tracking-wider">{u.name}</div>
                <div className="text-xs text-white/40 mt-1">{u.tagline}</div>
              </div>
            </motion.div>
          ))}
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
