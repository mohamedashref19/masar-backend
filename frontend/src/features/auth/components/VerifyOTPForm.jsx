import { useState, useEffect } from "react";
import { Input, Button } from "../../../components";
// استيراد الـ Hook الجديد
import { useResendOTP } from "../hooks/useResendOTP";

export default function VerifyOTPForm({ onSubmit, isLoading, email }) {
  const [otpCode, setOtpCode] = useState("");
  const [timer, setTimer] = useState(60); // عداد 60 ثانية

  // استدعاء دالة إعادة الإرسال
  const { mutate: resend, isPending: isResending } = useResendOTP();

  // تشغيل العداد التنازلي
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval); // تنظيف العداد لما المكون يتقفل
    }
  }, [timer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpCode.length < 6) return;
    onSubmit(otpCode);
  };

  // دالة التعامل مع الضغط على إعادة الإرسال
  const handleResend = () => {
    if (timer === 0) {
      resend({ email }); // نبعت الإيميل للباك إند
      setTimer(60); // نرستر العداد تاني
    }
  };

  return (
    <div className="w-full max-w-md bg-primary p-8 rounded-xl border border-slate-800 shadow-2xl text-center">
      <h1 className="text-3xl font-bold text-heading mb-4">تأكيد الحساب</h1>

      <p className="text-body mb-8">
        أدخل رمز التحقق المكون من 6 أرقام الذي أرسلناه إلى:
        <br />
        <span className="text-accent font-medium">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="otp"
          type="text"
          placeholder="مثال: 123456"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          maxLength={6}
          className="text-center text-2xl tracking-[0.5em] font-bold"
        />

        <Button
          type="submit"
          variant="accent"
          className="w-full"
          disabled={isLoading || otpCode.length < 6}
        >
          {isLoading ? "جاري التحقق..." : "تأكيد وتفعيل الحساب"}
        </Button>
      </form>

      {/* الجزء الخاص بإعادة الإرسال والعداد */}
      <p className="mt-6 text-sm text-body flex items-center justify-center gap-2">
        لم يصلك الرمز؟
        <button
          type="button" // مهم جداً عشان ميعملش Submit للفورم
          onClick={handleResend}
          disabled={timer > 0 || isResending}
          className={`font-medium transition-colors ${
            timer > 0 || isResending
              ? "text-slate-500 cursor-not-allowed"
              : "text-secondary hover:underline cursor-pointer"
          }`}
        >
          {isResending
            ? "جاري الإرسال..."
            : timer > 0
              ? `إعادة الإرسال بعد ${timer}ث`
              : "إعادة الإرسال"}
        </button>
      </p>
    </div>
  );
}
