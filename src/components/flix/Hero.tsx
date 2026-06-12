import { motion } from "framer-motion";
import { Embers } from "./Embers";
import { Zap, Flame } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* radial red glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-60"
          style={{ background: "radial-gradient(circle, rgba(204,0,0,0.35), transparent 60%)" }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(204,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(204,0,0,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>
      <Embers count={40} />

      <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-right space-y-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/40 bg-red-500/10 text-xs tracking-wider text-red-300"
          >
            <Zap className="h-3.5 w-3.5" /> تسليم فوري خلال دقائق
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display leading-[0.9] tracking-tight"
          >
            <span className="block text-2xl sm:text-3xl text-white/80 mb-2">متجر الترفيه الرقمي الأول</span>
            <span className="block" dir="ltr">
              <span className="text-[clamp(3.5rem,10vw,7rem)] text-chrome">FLIX</span>
              <span className="text-[clamp(3rem,8vw,6rem)] text-red-stroke -mt-3">STORE</span>
            </span>
            <span className="block w-24 h-1 mt-4 mx-auto lg:mx-0 lg:mr-0 bg-gradient-to-r from-red-500 to-transparent" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="text-white/70 text-base sm:text-lg max-w-xl mx-auto lg:mx-0"
          >
            اشتراكات PlayStation Plus بتسليم فوري وأسعار لا تقاوم — والمزيد من المنتجات قادم قريباً
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.35 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <a href="#products" className="btn-flix">تسوق الآن</a>
            <a href="#contact" className="btn-ghost-flix">تواصل معنا</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex gap-8 pt-6 justify-center lg:justify-start text-sm text-white/60"
          >
            <div><div className="font-display text-3xl text-white">5K+</div>عميل سعيد</div>
            <div className="w-px bg-white/10" />
            <div><div className="font-display text-3xl text-red-400">5⭐</div>تقييم العملاء</div>
            <div className="w-px bg-white/10" />
            <div><div className="font-display text-3xl text-white">24/7</div>دعم فوري</div>
          </motion.div>
        </div>

        {/* Typographic showcase — no logo image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative aspect-square max-w-lg mx-auto hidden lg:flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full blur-3xl opacity-70"
            style={{ background: "radial-gradient(circle, rgba(255,26,26,0.5), transparent 70%)" }} />
          <div className="absolute inset-8 rounded-full border border-red-500/30 animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-20 rounded-full border border-red-500/20 animate-[spin_45s_linear_infinite_reverse]" />
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative text-center"
          >
            <Flame className="h-16 w-16 text-red-500 mx-auto drop-shadow-[0_0_30px_rgba(255,26,26,0.8)]" />
            <div className="mt-4 font-display text-[7rem] leading-none text-chrome tracking-tighter">F</div>
            <div className="-mt-6 font-display text-[7rem] leading-none text-red-stroke tracking-tighter">S</div>
            <div className="mt-2 text-xs tracking-[0.4em] text-white/50">PREMIUM · DIGITAL</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Brand marquee */}
      <div className="absolute bottom-0 inset-x-0 border-t border-white/5 bg-black/40 py-4">
        <div className="marquee">
          <div className="marquee-track font-display tracking-[0.3em] text-sm text-white/40">
            {["NETFLIX", "PLAYSTATION", "SPOTIFY", "DISNEY+", "XBOX", "YOUTUBE PREMIUM", "SHAHID VIP", "APPLE ONE", "PUBG MOBILE", "FREE FIRE"].map(s => (
              <span key={s} className="flex items-center gap-16">{s}<span className="text-red-500">◆</span></span>
            ))}
          </div>
          <div className="marquee-track font-display tracking-[0.3em] text-sm text-white/40" aria-hidden>
            {["NETFLIX", "PLAYSTATION", "SPOTIFY", "DISNEY+", "XBOX", "YOUTUBE PREMIUM", "SHAHID VIP", "APPLE ONE", "PUBG MOBILE", "FREE FIRE"].map(s => (
              <span key={s} className="flex items-center gap-16">{s}<span className="text-red-500">◆</span></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
