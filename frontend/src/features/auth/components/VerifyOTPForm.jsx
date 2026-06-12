import { useState, useEffect } from "react";
import { Input, Button } from "../../../components";
import { useResendOTP } from "../hooks/useResendOTP";
import { FiRefreshCw, FiCheckCircle } from "react-icons/fi";

export default function VerifyOTPForm({ onSubmit, isLoading, email }) {
  const [otpCode, setOtpCode] = useState("");
  const [timer, setTimer] = useState(60); // عداد 60 ثانية

  const { mutate: resend, isPending: isResending } = useResendOTP();

  // تشغيل العداد التنازلي المأمن
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpCode.length < 6) return;
    onSubmit(otpCode);
  };

  const handleResend = () => {
    if (timer === 0) {
      resend({ email });
      setTimer(60);
    }
  };

  return (
    // 🎯 أزلنا الـ Card والـ Shadow والهيدر المكرر لتنساب المدخلات مباشرة داخل حاوية الأب الزجاجية الفخمة
    <div dir="rtl" className="w-full text-right font-['Outfit']">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* حقل إدخال كود الـ OTP المصقول سيبرانياً */}
        <div className="relative">
          <Input
            id="otp"
            type="text"
            placeholder="000000"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))} // منع إدخال الحروف وقبول الأرقام فقط لأمان الـ Input
            maxLength={6}
            autoComplete="one-time-code"
            className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-secondary rounded-xl text-center text-xl tracking-[0.4em] font-mono font-black text-white focus:outline-none transition-colors"
          />
        </div>

        {/* زر التفعيل والتحقق المتوهج */}
        <Button
          type="submit"
          variant="accent"
          className="w-full py-3.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(228,255,0,0.1)] hover:shadow-[0_10px_25px_rgba(228,255,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 text-slate-950"
          disabled={isLoading || otpCode.length < 6}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
              <span>جاري مطابقة الشفرة وتوثيق الحساب...</span>
            </>
          ) : (
            <>
              <FiCheckCircle size={15} />
              <span>تأكيد وتفعيل الحساب الرقمي</span>
            </>
          )}
        </Button>
      </form>

      {/* 🎯 جزء إعادة الإرسال والعداد المطور بتصميم انسيابي فخم */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400 font-light flex items-center justify-center gap-1.5">
          <span>لم يصلك رمز التشفير الحركي؟</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0 || isResending}
            className={`font-bold transition-all flex items-center gap-1 ${
              timer > 0 || isResending
                ? "text-slate-600 cursor-not-allowed"
                : "text-secondary hover:text-white hover:underline cursor-pointer"
            }`}
          >
            {isResending ? (
              <>
                <FiRefreshCw size={12} className="animate-spin" />
                <span>جاري توليد كود جديد...</span>
              </>
            ) : timer > 0 ? (
              <span className="font-mono text-slate-500" dir="ltr">
                إعادة الإرسال ({timer}s)
              </span>
            ) : (
              <>
                <FiRefreshCw size={12} />
                <span>إعادة الإرسال</span>
              </>
            )}
          </button>
        </p>
      </div>
    </div>
  );
}
