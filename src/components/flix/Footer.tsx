export function Footer() {
  return (
    <footer className="relative bg-[#060606] border-t-2 border-red-600/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-8 items-start">
        <div>
          <div dir="ltr" className="flex items-baseline gap-2">
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
        <div className="md:text-left text-sm text-white/60 space-y-1">
          <div><span className="text-white/40">للطلبات والتواصل:</span> <span dir="ltr">01109664083</span></div>
          <div><span className="text-white/40">للدفع فقط:</span> <span dir="ltr">01014956483</span></div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-red-400/90 px-4">
        ⚠️ ممنوع استرجاع الفلوس بعد التحويل لأي سبب — إلا في حالة خطأ من جانبنا أو تأخير ❌
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/40">
        © 2025 FLIX STORE — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
