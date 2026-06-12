import LoginForm from "../features/auth/components/LoginForm";
import { useLogin } from "../features/auth/hooks/useLogin";
import { motion } from "framer-motion"; // 🎯 حقن الحركة المتناسقة مع بقية الصفحات
import logo from "../../public/logo.png"; // 🌟 استيراد شعار مسار لاستخدامه في الهيدر الترحيبي

export default function Login() {
  const { mutate: login, isPending } = useLogin();

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#080B10] px-4 py-12 relative overflow-hidden text-right selection:bg-secondary/30 font-['Outfit']"
    >
      {/* 🌌 تأثيرات الإضاءة الخلفية الـ Cyber-Punk Glow الموحدة مع الهوم بيج */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/3 h-[450px] w-[450px] rounded-full bg-secondary/5 blur-[130px] animate-pulse [animation-duration:6s]" />
        <div className="absolute bottom-[-100px] right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px] animate-pulse [animation-duration:8s]" />
      </div>

      {/* الحاوية الحركية المأمنة لصندوق الدخول */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        {/* البنية الخارجية الزجاجية الفخمة المحيطة بالـ Form */}
        <div className="relative rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-2xl p-8 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* خط الإضاءة العلوي الـ Crisp الأنيق لجمال الـ Card */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* هيدر ترحيبي صغير أعلى الـ Form لتنظيم المحتوى بصرياً */}
          <div className="text-center mb-8">
            <div className="inline-flex w-35 h-12   items-center justify-center  mb-4">
              <img
                src={logo}
                alt="شعار مسار"
                style={{ width: "68px", height: "48px" }}
              />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              مرحباً بك في مسار
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              سجل دخولك الآن للوصول لغرف الصياغة الذكية وإدارة مشاريعك وعقودك
              التقنية.
            </p>
          </div>

          {/* حقن الفورم الأساسي الخاص بك */}
          <LoginForm onSubmit={login} isLoading={isPending} />
        </div>
      </motion.div>
    </div>
  );
}
