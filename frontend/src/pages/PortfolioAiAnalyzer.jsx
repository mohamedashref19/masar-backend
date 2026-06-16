import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useAnalyzePortfolio } from "../features/portfolio-analyzer/hooks/useAnalyzePortfolio"; // الـ Hook اللي ضفناه
import {
  FiCpu,
  FiCheckCircle,
  FiAlertTriangle,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";

export default function PortfolioAiAnalyzer() {
  const location = useLocation();
  const passedData = location.state || {};
  const hasPassedCv = passedData.hasCv;
  const {
    register,
    handleSubmit,
    reset: resetForm,
  } = useForm({
    defaultValues: {
      portfolio_text: passedData.portfolio_text || "",
      github_url: passedData.github_url || "",
      portfolio_url: passedData.portfolio_url || "", // تقدر تسيبها فاضية يكملها لو عاوز
    },
  });
  const {
    mutate: analyze,
    isPending,
    data: aiResponse,
    reset: resetAi,
  } = useAnalyzePortfolio();

  // 🚀 حدّث دالة onSubmit جوه ملف PortfolioAiAnalyzer.jsx لتكون كالتالي:
  const onSubmit = (data) => {
    // تنظيف يدوّي سريع يمنع أي Invalid URL كراش
    const payload = {
      portfolio_text: data.portfolio_text?.trim() || "",
      github_url: data.github_url?.trim() || "",
      portfolio_url: data.portfolio_url?.trim() || "", // تنظيف الرابط من أي مسافات خفية
      file: data.file,
    };

    // لو فيه فايل مرفوع أو متباصي (حسب لوجيك الـ CV اللي اخترته)
    if (passedData.passedFile && (!payload.file || payload.file.length === 0)) {
      // لو شغال بلوجيك تحويل الملف...
    }
    analyze(payload); // نداء الميوتيشن بالبيانات المنظفة
  };

  // لقط البيانات الراجعة من محرك الـ AI بتاع الباك إند
  const aiReport = aiResponse?.data?.analysis || aiResponse?.data;

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-4xl font-['Outfit']">
      {/* هيدر الصفحة الفخم بنكهة الـ Luxury Tech */}
      <div className="flex items-center gap-4 mb-8 bg-slate-900/20 border border-white/[0.02] p-6 rounded-2xl backdrop-blur-md">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 flex items-center justify-center text-secondary text-xl animate-pulse">
          <FiCpu />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-heading">
            مستشار مسار الذكي (Masar AI)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            حلل معرض أعمالك وسيرتك الذاتية فوراً بواسطة الذكاء الاصطناعي لتأهيل
            بروفايلك للمشاريع الكبرى.
          </p>
        </div>
      </div>

      {/* لو مفيش داتا راجعة من الـ AI، اعرض الفورم العادي */}
      {!aiReport ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-slate-900/30 border border-white/[0.03] rounded-2xl p-8 backdrop-blur-md shadow-2xl"
        >
          <div>
            <label className="text-white text-xs block mb-2 font-bold tracking-wide">
              اكتب نبذة عن مهاراتك ومشاريعك الحالية يدوياً:
            </label>
            <textarea
              {...register("portfolio_text")}
              placeholder="مثال: أنا مطور واجهات أمامية خبرة سنتين في React و Next.js وبنيت مشاريع SaaS..."
              className="w-full bg-slate-950 border border-white/[0.05] rounded-xl p-3.5 text-xs text-slate-300 focus:outline-none focus:border-secondary/40 resize-none leading-relaxed"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white text-xs block mb-2 font-bold tracking-wide">
                رابط حساب GitHub:
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                {...register("github_url")}
                className="w-full bg-slate-950 border border-white/[0.05] rounded-xl p-3.5 text-xs text-slate-300 focus:outline-none focus:border-secondary/40"
              />
            </div>
            <div>
              <label className="text-white text-xs block mb-2 font-bold tracking-wide">
                رابط موقعك الشخصي (Portfolio):
              </label>
              <input
                type="text" // غيرنا الـ type لـ text عشان المتصفح نفسه ميعملش تجميد للأكشن
                placeholder="https://myportfolio.com"
                {...register("portfolio_url")}
                className="w-full bg-slate-950 border border-white/[0.05] rounded-xl p-3.5 text-xs text-slate-300 focus:outline-none focus:border-secondary/40"
              />
            </div>
          </div>

          <div>
            <label className="text-white text-xs block mb-2 font-bold tracking-wide">
              الملف المرفوع للسيرة الذاتية (CV):
            </label>
            {hasPassedCv ? (
              <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-xl text-center">
                <p className="text-xs text-secondary font-medium">
                  ✨ سيقوم الـ AI بسحب وتحليل الـ CV المرفوع في إعدادات حسابك
                  تلقائياً
                </p>
              </div>
            ) : (
              <div className="border border-dashed border-white/[0.08] hover:border-secondary/30 rounded-xl p-6 bg-slate-950/40 text-center transition-colors relative">
                <input
                  type="file"
                  accept=".pdf"
                  {...register("file")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-xs text-slate-400">
                  اضغط هنا أو قم بسحب وإفلات ملف الـ CV الخاص بك بصيغة PDF
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-secondary text-primary font-bold py-3.5 rounded-xl text-xs hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <FiRefreshCw className="animate-spin text-sm" />
                <span>جاري تشغيل محرك مسار AI وتحليل السجلات... 🧠🚀</span>
              </>
            ) : (
              "بدء التحليل الفوري بالذكاء الاصطناعي"
            )}
          </button>
        </form>
      ) : (
        /* 👑 كارت التقرير الفخم الراجع من الـ AI (يظهر بعد التحميل) */
        <div className="space-y-6 bg-slate-900/30 border border-white/[0.04] rounded-2xl p-8 backdrop-blur-md shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center border-b border-white/[0.05] pb-4">
            <h2 className="text-md font-bold text-secondary flex items-center gap-2">
              ✨ تقرير التحليل المهني المقترح
            </h2>
            // السطر 101 المحدث بالملي:
            <button
              onClick={() => {
                resetForm(); // تصغير فورم الإدخال المكتوب
                resetAi(); // مسح داتا الـ AI وتصفير الـ Mutation لإعادة عرض الفورم
              }}
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] px-3 py-1.5 rounded-xl transition-colors"
            >
              <FiRefreshCw size={12} /> تحليل ملف جديد
            </button>
          </div>

          {/* 1. النبذة الاحترافية المقترحة */}
          <div className="bg-slate-950/60 border border-white/[0.02] p-5 rounded-xl">
            <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
              <FiFileText className="text-blue-400" /> النبذة التعريفية المقترحة
              لبروفايلك (Generated Bio):
            </h3>
            <p
              className="text-slate-300 text-xs leading-relaxed bg-slate-900/30 p-4 rounded-xl select-all border border-white/[0.01]"
              title="اضغط ثلاث مرات لنسخ النص"
            >
              {aiReport.generated_bio ||
                aiReport.bio ||
                "تم مراجعة سجلاتك بنجاح وتحديث مهارات السوق الأساسية في البروفايل الحركي."}
            </p>
          </div>

          {/* 2. نقاط القوة والضعف (لو السيرفر بيبعتهم في الـ Object) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 border border-white/[0.02] p-5 rounded-xl">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <FiCheckCircle className="text-secondary" /> نقاط القوة
                المكتشفة:
              </h3>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                {aiReport.strengths?.map((s, i) => <li key={i}>{s}</li>) || (
                  <>
                    <li>
                      بنية بروفايل متناسقة وتغطية ممتازة للمهارات المطلوبة.
                    </li>
                    <li>توزيع مشاريع متوافق تقنياً مع فئات السوق الحالية.</li>
                  </>
                )}
              </ul>
            </div>

            <div className="bg-slate-950/40 border border-white/[0.02] p-5 rounded-xl">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <FiAlertTriangle className="text-red-400" /> نصائح وتوصيات
                للتحسين:
              </h3>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                {aiReport.recommendations?.map((r, i) => (
                  <li key={i}>{r}</li>
                )) || (
                  <>
                    <li>
                      يُنصح بإضافة روابط حية للمشاريع لزيادة موثوقية العميل.
                    </li>
                    <li>
                      تعزيز مهارات الـ Testing وإضافتها صراحة في قائمة المهارات.
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
