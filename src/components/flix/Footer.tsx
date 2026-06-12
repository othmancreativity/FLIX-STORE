export function Footer() {
  return (
    <footer className="relative bg-[#060606] border-t-2 border-red-600/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-8 items-start">
        <div>
          <div className="flex items-baseline gap-2" dir="ltr">
            <span className="font-display text-3xl tracking-[0.2em] text-chrome">FLIX</span>
            <span className="font-display text-3xl tracking-[0.2em] text-red-stroke">STORE</span>
          </div>
          <div className="text-xs text-white/40 mt-2">متجر الترفيه الرقمي الأول</div>
        </div>
        <div className="flex gap-6 text-sm text-white/60 md:justify-center">
          <a href="#products" className="hover:text-red-400 transition">المنتجات</a>
          <a href="#soon" className="hover:text-red-400 transition">قريباً</a>
          <a href="#why" className="hover:text-red-400 transition">لماذا نحن</a>
          <a href="#how" className="hover:text-red-400 transition">كيف تطلب</a>
          <a href="#contact" className="hover:text-red-400 transition">تواصل</a>
        </div>
        <div className="md:text-left text-sm text-white/50" dir="ltr">
          <div>WhatsApp: 0110 966 4083</div>
          <div>WhatsApp: 0101 495 6483</div>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/40">
        © 2026 FLIX STORE — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
