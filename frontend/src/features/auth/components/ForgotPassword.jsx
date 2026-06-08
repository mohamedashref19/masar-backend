import { useState } from "react";
import { motion } from "framer-motion";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { FiMail, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { mutate: sendOTP, isPending } = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) sendOTP(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-['Outfit']">
      {/* دوائر الإضاءة في الخلفية للحفاظ على جمالية الـ HCI */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-heading mb-2">
            نسيت كلمة السر؟
          </h1>
          <p className="text-body">
            لا تقلق، أدخل بريدك الإلكتروني وسنرسل لك كود التحقق.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-2 mr-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pr-12 pl-4 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-secondary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isPending ? "جاري الإرسال..." : "إرسال الكود"}
            {!isPending && <FiArrowRight />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-sm text-slate-500 hover:text-secondary transition-colors"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
