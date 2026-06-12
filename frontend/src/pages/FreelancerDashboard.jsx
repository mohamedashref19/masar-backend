import { Link } from "react-router-dom";
import { useFreelancerDashboard } from "../features/dashboard/hooks/useFreelancerDashboard";
import { Button } from "../components";
import {
  FiSearch,
  FiFolder,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiArrowLeft,
  FiClock,
} from "react-icons/fi";

export default function FreelancerDashboard() {
  const { proposals, stats, isLoading } = useFreelancerDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
        <span className="text-xs text-slate-500 font-medium">
          جاري مزامنة قنوات عروضك الذكية...
        </span>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="container mx-auto py-12 px-4 mt-20 max-w-6xl text-right relative selection:bg-secondary/30"
    >
      {/* 🌌 تأثير إضاءة خلفي فخم للكروت */}
      <div className="absolute top-10 right-1/3 w-80 h-80 rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      {/* 🎯 الهيدر المطور */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-white/[0.05] pb-6">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">
            بوابة إدارة العروض والتعاقدات
          </span>
          <h1 className="text-3xl font-black text-white mt-1">
            لوحة تحكم المستقل المهنية
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            راقب كفاءة عروضك الفنية، وتابع تحديثات لجان التحكيم والعملاء أولاً
            بأول.
          </p>
        </div>
        <Link to="/projects">
          <Button
            variant="accent"
            className="px-6 py-3.5 font-bold rounded-xl shadow-[0_15px_30px_rgba(228,255,0,0.1)] hover:shadow-[0_15px_30px_rgba(228,255,0,0.25)] hover:scale-[1.02] transition-all flex items-center gap-2 text-slate-950"
          >
            <FiSearch size={16} /> اقتنص مشاريع جديدة الآن
          </Button>
        </Link>
      </div>

      {/* 📊 كروت الإحصائيات (Premium Bento Display) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-12">
        {/* 1. إجمالي العروض */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent p-5 group hover:border-slate-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold">
              إجمالي العروض
            </span>
            <div className="p-2 bg-slate-900 border border-white/5 text-slate-400 rounded-xl text-sm">
              <FiTrendingUp />
            </div>
          </div>
          <span className="text-4xl font-black text-white block mt-4" dir="ltr">
            {stats?.total || 0}
          </span>
          <p className="text-[10px] text-slate-600 font-medium mt-1">
            جميع الطلبات التي قدمتها بالسيستم
          </p>
        </div>

        {/* 2. قيد المراجعة */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent p-5 group hover:border-slate-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold">
              قيد المراجعة الفنية
            </span>
            <div className="p-2 bg-yellow-500/5 border border-yellow-500/10 text-yellow-400 rounded-xl text-sm">
              <FiClock />
            </div>
          </div>
          <span
            className="text-4xl font-black text-yellow-400 block mt-4"
            dir="ltr"
          >
            {stats?.pending || 0}
          </span>
          <p className="text-[10px] text-slate-600 font-medium mt-1">
            بانتظار مراجعة العميل والـ AI
          </p>
        </div>

        {/* 3. العروض المقبولة */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent p-5 group hover:border-slate-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold">
              العروض المعتمدة
            </span>
            <div className="p-2 bg-green-500/5 border border-green-500/10 text-green-400 rounded-xl text-sm">
              <FiCheckCircle />
            </div>
          </div>
          <span
            className="text-4xl font-black text-green-400 block mt-4"
            dir="ltr"
          >
            {stats?.accepted || 0}
          </span>
          <p className="text-[10px] text-slate-600 font-medium mt-1">
            مشاريع انطلقت قيد التنفيذ المالي
          </p>
        </div>

        {/* 4. العروض المرفوضة */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent p-5 group hover:border-slate-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold">
              العروض المستبعدة
            </span>
            <div className="p-2 bg-red-500/5 border border-red-500/10 text-red-400 rounded-xl text-sm">
              <FiXCircle />
            </div>
          </div>
          <span
            className="text-4xl font-black text-red-400 block mt-4"
            dir="ltr"
          >
            {stats?.rejected || 0}
          </span>
          <p className="text-[10px] text-slate-600 font-medium mt-1">
            لم توفق أو تم إغلاق ملفها
          </p>
        </div>
      </div>

      {/* 🎯 قائمة العروض المقدمة كـ Premium Grid Shell */}
      <div className="bg-[#0D121A] border border-white/[0.05] rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b border-white/[0.05] bg-gradient-to-r from-white/[0.01] to-transparent flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FiFolder className="text-secondary" /> كراسة العروض المودعة
              حاليًا
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              تحليل هيكلي لعقودك المسجلة عبر قاعدة بيانات مسار
            </p>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="p-16 text-center border-t border-white/[0.02]">
            <span className="text-4xl block mb-4">📭</span>
            <p className="text-slate-400 text-sm mb-4">
              لم تقم بتقديم أي عروض فنية على المشاريع حتى الآن.
            </p>
            <Link to="/projects">
              <Button
                variant="outline"
                className="text-xs border-slate-800 text-slate-300 hover:bg-white/5 py-2.5"
              >
                ابدأ فحص سوق المشاريع
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-950/40 border-b border-white/[0.05] text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  <th className="p-4 pr-6">الملف الفني للمشروع</th>
                  <th className="p-4">قيمة التعاقد</th>
                  <th className="p-4">النطاق الزمني</th>
                  <th className="p-4">حالة الجلسة</th>
                  <th className="p-4 text-center pl-6">الإجراء المباشر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {proposals.map((proposal) => (
                  <tr
                    key={proposal._id}
                    className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 pr-6 max-w-[240px] truncate">
                      <span className="font-bold text-slate-200 group-hover:text-secondary transition-colors block text-sm">
                        {proposal.project?.title || "مشروع غير معروف"}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        ID: {proposal._id.slice(-8)}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-300" dir="ltr">
                      ${proposal.price}
                    </td>
                    <td className="p-4 text-slate-400 font-light">
                      {proposal.duration} يوماً بحد أقصى
                    </td>
                    <td className="p-4">
                      {proposal.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 bg-amber-500/5 text-amber-400 border border-amber-500/10 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                          <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />{" "}
                          قيد المراجعة
                        </span>
                      )}
                      {proposal.status === "accepted" && (
                        <span className="inline-flex items-center gap-1.5 bg-green-500/5 text-green-400 border border-green-500/10 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                          <span className="w-1 h-1 rounded-full bg-green-400" />{" "}
                          معتمد ومقبول
                        </span>
                      )}
                      {proposal.status === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 bg-red-500/5 text-red-400 border border-red-500/10 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                          <span className="w-1 h-1 rounded-full bg-red-400" />{" "}
                          مستبعد
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center pl-6">
                      <Link
                        to={`/projects/${proposal.project?._id || proposal.project}`}
                      >
                        <button className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary bg-secondary/5 hover:bg-secondary border border-secondary/20 hover:border-secondary text-secondary hover:text-slate-950 px-3 py-2 rounded-lg transition-all group/btn">
                          فحص البنية 👁️{" "}
                          <span className="group-hover/btn:-translate-x-0.5 transition-transform">
                            <FiArrowLeft />
                          </span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
