import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Copy,
  Upload,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  Gamepad2,
  Clock,
  Wallet,
  ArrowLeft,
  ArrowRight,
  PartyPopper,
} from "lucide-react";

export type PurchaseOrder = {
  product: string; // e.g. "PlayStation Plus Extra" or game name
  type: string; // Essential / Extra / game name
  duration?: string | null; // null/omitted for games
  account: string; // PRIM 5 / PRIM 4 / SEC
  platform?: string | null; // PS4 / PS5 (games only)
  price: number;
};

type PayMethodId = "vodafone" | "telda" | "instapay";

const ORDER_WA = "201109664083"; // للطلبات
const PAY_NUMBER = "01014956483"; // للدفع
const TELDA_ID = "@flix90";
const INSTAPAY_LINK = "https://ipn.eg/S/flixop90/instapay/2jsoLA";

const METHODS: {
  id: PayMethodId;
  icon: string;
  title: string;
  detail: string;
  label: string;
}[] = [
  {
    id: "vodafone",
    icon: "📱",
    title: "فودافون كاش",
    detail: `اتصل أو حول على ${PAY_NUMBER}`,
    label: "Vodafone Cash",
  },
  { id: "telda", icon: "💳", title: "تيلدا", detail: TELDA_ID, label: "Telda" },
  {
    id: "instapay",
    icon: "💸",
    title: "انستاباي",
    detail: `${PAY_NUMBER} — مصطفى محمد`,
    label: "InstaPay",
  },
];

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* noop */
        }
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-white/5 border border-white/15 hover:border-red-500/60 hover:text-white text-white/80 transition"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "تم النسخ" : "نسخ"}
    </button>
  );
}

export function PurchaseFlow({
  open,
  onClose,
  order,
}: {
  open: boolean;
  onClose: () => void;
  order: PurchaseOrder | null;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [method, setMethod] = useState<PayMethodId | null>(null);
  const [name, setName] = useState("");
  const [wa, setWa] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Reset when opening
  useEffect(() => {
    if (open) {
      setStep(1);
      setMethod(null);
      setName("");
      setWa("");
      setReceipt(null);
      setReceiptUrl(null);
      setOrderId("");
    }
  }, [open]);

  useEffect(() => {
    if (!receipt) {
      setReceiptUrl(null);
      return;
    }
    const url = URL.createObjectURL(receipt);
    setReceiptUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [receipt]);

  const selectedMethod = useMemo(
    () => METHODS.find((m) => m.id === method) || null,
    [method],
  );

  if (!order) return null;

  const buildMessage = (id: string) => {
    const lines = [
      "🎮 طلب جديد — FLIX STORE",
      "━━━━━━━━━━━━━━━━━━",
      `🔑 كود الطلب: ${id}`,
      "━━━━━━━━━━━━━━━━━━",
      `👤 الاسم: ${name}`,
      `📱 واتساب العميل: ${wa}`,
      "━━━━━━━━━━━━━━━━━━",
      `🎯 المنتج: ${order.product}`,
    ];
    if (order.platform) lines.push(`🖥️ المنصة: ${order.platform}`);
    if (order.duration) lines.push(`📦 المدة: ${order.duration}`);
    lines.push(
      `💻 نوع الحساب: ${order.account}`,
      `💰 المبلغ: ${order.price} جنيه`,
      `💳 طريقة الدفع: ${selectedMethod?.label ?? ""}`,
      "━━━━━━━━━━━━━━━━━━",
      "✅ العميل أكد الدفع",
      "📸 تم رفع صورة الإيصال — سيرسلها في المحادثة",
    );
    return lines.join("\n");
  };

  const submitOrder = () => {
    const id = `FL-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(id);
    const url = `https://wa.me/${ORDER_WA}?text=${encodeURIComponent(buildMessage(id))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setStep(3);
  };

  const canSubmit = Boolean(receipt && name.trim() && wa.trim().length >= 8);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="pf-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] bg-black/85 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={onClose}
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg my-4 sm:my-0 rounded-2xl overflow-hidden border border-red-500/30 bg-[#0a0a0a] shadow-[0_0_60px_rgba(204,0,0,0.35)]"
          >
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-red-500 transition"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Stepper */}
            <div className="px-5 pt-5 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 text-[11px] font-display tracking-wider text-white/50">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        step >= s
                          ? "bg-red-600 border-red-500 text-white shadow-[0_0_12px_rgba(204,0,0,0.6)]"
                          : "border-white/15 text-white/40"
                      }`}
                    >
                      {s}
                    </span>
                    {s < 3 && (
                      <span
                        className={`w-6 h-px ${step > s ? "bg-red-500" : "bg-white/10"}`}
                      />
                    )}
                  </div>
                ))}
                <span className="ms-auto">
                  {step === 1 && "تأكيد الطلب"}
                  {step === 2 && "خطوات الدفع"}
                  {step === 3 && "تم الإرسال"}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="font-display text-2xl text-chrome">
                    تأكيد طلبك
                  </h3>

                  <div className="rounded-xl border border-red-500/30 bg-gradient-to-b from-red-950/30 to-black/30 p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-white">
                      <Gamepad2 className="h-4 w-4 text-red-400" />
                      <span className="font-display tracking-wide">
                        {order.product}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm flex-wrap">
                      {order.duration && (
                        <>
                          <Clock className="h-4 w-4 text-red-400" />
                          المدة:{" "}
                          <span className="text-white">{order.duration}</span>
                          <span className="text-white/30">·</span>
                        </>
                      )}
                      {order.platform && (
                        <>
                          <span className="text-white/70">
                            المنصة: {order.platform}
                          </span>
                          <span className="text-white/30">·</span>
                        </>
                      )}
                      <span className="text-white/70">{order.account}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Wallet className="h-4 w-4 text-red-400" />
                      المبلغ:{" "}
                      <span className="font-display text-2xl text-red-stroke ms-1">
                        {order.price}
                      </span>
                      <span className="text-white/60">جنيه</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-white/70 mb-3">
                      اختر طريقة الدفع:
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {METHODS.map((m) => {
                        const active = method === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setMethod(m.id)}
                            className={`relative text-right rounded-xl border p-3 transition-all ${
                              active
                                ? "border-red-500 bg-red-500/10 shadow-[0_0_18px_rgba(204,0,0,0.45)]"
                                : "border-white/10 bg-white/[0.03] hover:border-white/30"
                            }`}
                          >
                            {active && (
                              <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                                <Check className="h-3 w-3" />
                              </span>
                            )}
                            <div className="text-xl mb-1">{m.icon}</div>
                            <div className="font-display text-sm text-white">
                              {m.title}
                            </div>
                            <div className="text-[11px] text-white/55 mt-0.5 leading-tight">
                              {m.detail}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => method && setStep(2)}
                    disabled={!method}
                    className="btn-flix w-full !text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    التالي — تأكيد طريقة الدفع <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && selectedMethod && (
                <div className="space-y-5">
                  <h3 className="font-display text-2xl text-chrome">
                    خطوات الدفع
                  </h3>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                    <div className="flex items-center gap-2 font-display text-white">
                      <span className="text-xl">{selectedMethod.icon}</span>{" "}
                      {selectedMethod.title}
                    </div>
                    <div className="text-sm text-white/70">
                      حول مبلغ{" "}
                      <span className="font-display text-red-300 text-base">
                        {order.price}
                      </span>{" "}
                      جنيه على:
                    </div>

                    {method === "vodafone" && (
                      <div className="flex items-center justify-between gap-2 rounded-lg bg-black/40 border border-white/10 p-3">
                        <div
                          dir="ltr"
                          className="font-display text-lg text-white tracking-wider"
                        >
                          📞 {PAY_NUMBER}
                        </div>
                        <CopyBtn value={PAY_NUMBER} />
                      </div>
                    )}

                    {method === "telda" && (
                      <div className="flex items-center justify-between gap-2 rounded-lg bg-black/40 border border-white/10 p-3">
                        <div
                          dir="ltr"
                          className="font-display text-lg text-white tracking-wider"
                        >
                          👤 {TELDA_ID}
                        </div>
                        <CopyBtn value={TELDA_ID} />
                      </div>
                    )}

                    {method === "instapay" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 rounded-lg bg-black/40 border border-white/10 p-3">
                          <div>
                            <div
                              dir="ltr"
                              className="font-display text-lg text-white tracking-wider"
                            >
                              📞 {PAY_NUMBER}
                            </div>
                            <div className="text-xs text-white/60 mt-0.5">
                              👤 مصطفى محمد
                            </div>
                          </div>
                          <CopyBtn value={PAY_NUMBER} />
                        </div>
                        <a
                          href={INSTAPAY_LINK}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg bg-red-600/15 border border-red-500/50 hover:bg-red-600/25 text-red-200 text-sm transition"
                        >
                          <ExternalLink className="h-4 w-4" /> افتح رابط الدفع
                          المباشر
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Refund notice */}
                  <div className="rounded-xl border-2 border-red-500/60 bg-red-500/10 p-3.5 flex gap-2.5 text-sm text-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-display tracking-wider mb-0.5">
                        ⚠️ مهم جداً
                      </div>
                      ممنوع استرجاع الفلوس بعد التحويل لأي سبب — إلا في حالة خطأ
                      من جانبنا أو تأخير في التسليم.
                    </div>
                  </div>

                  {/* Upload */}
                  <div>
                    <div className="text-sm text-white/80 mb-2">
                      ارفع صورة التحويل 📸
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full rounded-xl border-2 border-dashed border-red-500/40 bg-black/40 hover:border-red-500 hover:bg-red-500/5 transition p-5 flex flex-col items-center justify-center gap-2 text-white/70"
                    >
                      {receiptUrl ? (
                        <>
                          <img
                            src={receiptUrl}
                            alt="إيصال"
                            className="max-h-32 rounded-md border border-white/15"
                          />
                          <span className="text-xs text-green-400 mt-1">
                            ✓ تم اختيار الصورة — اضغط للتغيير
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-7 w-7 text-red-400" />
                          <span className="text-sm">
                            اضغط لاختيار صورة الإيصال
                          </span>
                          <span className="text-[11px] text-white/40">
                            JPG / PNG / WEBP
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Fields */}
                  <div className="grid gap-3">
                    <div>
                      <label className="block text-xs text-white/60 mb-1.5">
                        الاسم
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="اسمك (عشان نعرف مين إنت)"
                  autoComplete="name"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full px-3 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-red-500 focus:outline-none text-white placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/60 mb-1.5">
                        واتساب التواصل
                      </label>
                      <input
                        value={wa}
                        onChange={(e) =>
                          setWa(e.target.value.replace(/[^\d+]/g, ""))
                        }
                        inputMode="tel"
                  autoComplete="tel"
                  placeholder="رقم واتساب التواصل معك"
                        className="w-full px-3 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-red-500 focus:outline-none text-white placeholder:text-white/30 text-right"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="btn-ghost-flix !py-2.5 !text-sm sm:w-auto"
                    >
                      <ArrowRight className="h-4 w-4" /> رجوع
                    </button>
                    <button
                      onClick={submitOrder}
                      disabled={!canSubmit}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-display tracking-wider bg-[#25D366] hover:bg-[#1ebe5b] text-black disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <MessageCircle className="h-5 w-5" /> إرسال الطلب ✅
                    </button>
                  </div>
                  <p className="text-[11px] text-white/40 text-center">
                    سيفتح واتساب برسالة جاهزة — أرسل صورة الإيصال داخل المحادثة
                    بعد فتحها.
                  </p>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="text-center space-y-5 py-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-500/15 border border-green-500/50 flex items-center justify-center">
                    <PartyPopper className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="font-display text-3xl text-chrome">
                    ✅ تم إرسال طلبك بنجاح!
                  </h3>
                  <div className="rounded-xl border-2 border-red-500/60 bg-black/60 p-5">
                    <div className="text-xs text-white/60 tracking-wider mb-2">
                      🔑 كود طلبك
                    </div>
                    <div
                      dir="ltr"
                      className="font-display text-red-stroke"
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: 900,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {orderId}
                    </div>
                    <div className="text-xs text-white/50 mt-2">
                      احتفظ بالكود ده عشان تتابع طلبك
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    سيتم التواصل معك على:{" "}
                    <span dir="ltr" className="text-white">
                      {wa}
                    </span>
                    <br />
                    خلال دقائق بعد التحقق من الدفع والصورة
                    <br />
                    <span className="text-red-300 text-xs">
                      ⚠️ لا تنسَ إرسال صورة الإيصال داخل محادثة واتساب
                    </span>
                  </p>

                  <div className="grid sm:grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/${ORDER_WA}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600/15 border border-green-500/50 hover:bg-green-600/25 text-green-200 text-sm transition"
                    >
                      <MessageCircle className="h-4 w-4" /> تواصل معنا ·
                      01109664083
                    </a>
                    <a
                      href={`https://wa.me/201014956483`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600/15 border border-green-500/50 hover:bg-green-600/25 text-green-200 text-sm transition"
                    >
                      <MessageCircle className="h-4 w-4" /> تواصل معنا ·
                      01014956483
                    </a>
                  </div>

                  <button
                    onClick={onClose}
                    className="btn-ghost-flix !py-2.5 !text-sm"
                  >
                    العودة للرئيسية
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

