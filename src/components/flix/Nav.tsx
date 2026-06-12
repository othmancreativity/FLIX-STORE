import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" dir="ltr">
          <span className="font-display text-xl sm:text-2xl tracking-[0.2em] text-chrome">FLIX</span>
          <span className="font-display text-xl sm:text-2xl tracking-[0.2em] text-red-stroke">STORE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#products" className="hover:text-white transition">المنتجات</a>
          <a href="#offers" className="hover:text-white transition">عروض الصيف</a>
          <a href="#soon" className="hover:text-white transition">قريباً</a>
          <a href="#why" className="hover:text-white transition">لماذا نحن</a>
          <a href="#how" className="hover:text-white transition">كيف تطلب</a>
          <a href="#contact" className="hover:text-white transition">تواصل معنا</a>
        </nav>
        <a href="#products" className="btn-flix !py-2 !px-4 !text-xs">اطلب الآن</a>
      </div>
    </header>
  );
}
