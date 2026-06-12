import RegisterForm from "../features/auth/components/RegisterForm";
import { useRegister } from "../features/auth/hooks/useRegister";
import { motion } from "framer-motion";
import logo from "../../public/logo.png";
export default function Register() {
  // بنستدعي الـ Hook الفعلي المسئول عن تسجيل الحساب
  const { mutate: registerUser, isPending } = useRegister();

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#080B10] px-4 py-12 relative overflow-hidden text-right selection:bg-secondary/30 font-['Outfit']"
    >
      {/* 🌌 تأثيرات الإضاءة الخلفية الـ Cyber-Punk Glow الموحدة للبراند بالكامل */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 right-1/4 h-[450px] w-[450px] rounded-full bg-secondary/5 blur-[130px] animate-pulse [animation-duration:7s]" />
        <div className="absolute bottom-[-100px] left-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px] animate-pulse [animation-duration:9s]" />
      </div>

      {/* الحاوية الحركية الرشيقة لصندوق التسجيل */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl z-10" // 🎯 جعلناها أعرض قليلاً (max-w-xl) لاستيعاب حقول التسجيل براحة بصرياً
      >
        {/* البنية الخارجية الزجاجية الفخمة المحيطة بالـ Register Form */}
        <div className="relative rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-2xl p-6 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* خط الإضاءة الـ Crisp الأنيق أعلى الـ Card */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* هيدر ترحيبي منسق لتوجيه المستخدم قبل إدخال الداتا */}
          <div className="text-center mb-6">
            <div className="inline-flex w-35 h-12   items-center justify-center  mb-4">
              <img
                src={logo}
                alt="شعار مسار"
                style={{ width: "68px", height: "48px" }}
              />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              إنشاء حساب جديد على مسار
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              انضم لشبكة المواهب الذكية، وابدأ في توظيف النخبة التقنية أو اقتناص
              الفرص الكبيرة.
            </p>
          </div>

          {/* حقن الفورم الأساسي والتفاعلي الخاص بك */}
          <RegisterForm onSubmit={registerUser} isLoading={isPending} />
        </div>
      </motion.div>
    </div>
  );
}
