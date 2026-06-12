import { MessageCircle } from "lucide-react";
import { WA_NUMBERS, waLink } from "@/lib/products";

export function StickyWA() {
  return (
    <a
      href={waLink(WA_NUMBERS[0], "مرحباً FLIX STORE")}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 left-5 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.6)] pulse-green hover:scale-110 transition"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}
