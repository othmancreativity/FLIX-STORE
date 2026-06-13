import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WA_NUMBERS, waLink } from "@/lib/products";
import { Embers } from "./Embers";

export function Contact() {
  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(204,0,0,0.25), transparent 60%)" }} />
      </div>
      <Embers count={25} />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[clamp(3rem,9vw,6rem)] leading-none text-chrome"
        >
          جاهز تبدأ؟
        </motion.h2>
        <p className="text-xl text-white/70 mt-4">تواصل معنا الآن على واتساب — رد فوري</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-10 max-w-2xl mx-auto">
          {WA_NUMBERS.map((num, i) => (
            <motion.a
              key={num}
              href={waLink(num, "مرحباً FLIX STORE، أريد الاستفسار عن منتجاتكم")}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex items-center justify-center gap-3 px-6 py-5 rounded-xl bg-green-600/10 border border-green-500/40 hover:bg-green-500 hover:border-green-400 transition-all"
            >
              <span className="relative">
                <MessageCircle className="w-7 h-7 text-green-400 group-hover:text-white" />
                <span className="absolute inset-0 rounded-full pulse-green" />
              </span>
              <span className="font-display text-2xl tracking-wider text-white" dir="ltr">
                +2 0{num.slice(2, 5)} {num.slice(5, 8)} {num.slice(8)}
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 text-white/40 text-sm tracking-wider font-display">
          INSTAPAY · VODAFONE CASH · WE PAY · TELDA · KLIVVR
        </div>
      </div>
    </section>
  );
}
