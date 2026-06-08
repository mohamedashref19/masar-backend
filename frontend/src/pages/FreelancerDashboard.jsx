import { Link } from "react-router-dom";
import { useFreelancerDashboard } from "../features/dashboard/hooks/useFreelancerDashboard";
import { Button } from "../components";

export default function FreelancerDashboard() {
  const { proposals, stats, isLoading } = useFreelancerDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-6xl animate-fade-in-up">
      {/* 🎯 الهيدر */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-heading">لوحة تحكم المستقل</h1>
          <p className="text-slate-400 mt-2">
            تابع حالة عروضك ومشاريعك الحالية.
          </p>
        </div>
        <Link to="/projects">
          <Button variant="accent" className="px-6 py-3">
            🔍 تصفح مشاريع جديدة
          </Button>
        </Link>
      </div>

      {/* 🎯 كروت الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-slate-400 text-sm font-bold mb-2">
            إجمالي العروض
          </span>
          <span className="text-3xl font-extrabold text-white">
            {stats.total}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-slate-400 text-sm font-bold mb-2">
            قيد المراجعة
          </span>
          <span className="text-3xl font-extrabold text-yellow-400">
            {stats.pending}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-slate-400 text-sm font-bold mb-2">
            عروض مقبولة
          </span>
          <span className="text-3xl font-extrabold text-green-500">
            {stats.accepted}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-slate-400 text-sm font-bold mb-2">
            عروض مرفوضة
          </span>
          <span className="text-3xl font-extrabold text-red-500">
            {stats.rejected}
          </span>
        </div>
      </div>

      {/* 🎯 قائمة العروض المقدمة */}
      <div className="bg-primary border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">
            العروض المقدمة (My Proposals)
          </h2>
        </div>

        {proposals.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 mb-4">
              لم تقم بتقديم أي عروض حتى الآن.
            </p>
            <Link to="/projects">
              <Button variant="outline">ابدأ في تقديم العروض</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-300 text-sm">
                  <th className="p-4 font-semibold">المشروع</th>
                  <th className="p-4 font-semibold">قيمة العرض</th>
                  <th className="p-4 font-semibold">مدة التنفيذ</th>
                  <th className="p-4 font-semibold">الحالة</th>
                  <th className="p-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr
                    key={proposal._id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="p-4 text-white font-medium max-w-[250px] truncate">
                      {/* الباك إند غالباً بيرجع بيانات المشروع جوه العرض (populate) */}
                      {proposal.project?.title || "مشروع غير معروف"}
                    </td>
                    <td className="p-4 text-slate-300">${proposal.price}</td>
                    <td className="p-4 text-slate-300">
                      {proposal.duration} أيام
                    </td>
                    <td className="p-4">
                      {proposal.status === "pending" && (
                        <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs">
                          قيد المراجعة
                        </span>
                      )}
                      {proposal.status === "accepted" && (
                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs">
                          مقبول
                        </span>
                      )}
                      {proposal.status === "rejected" && (
                        <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs">
                          مرفوض
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        to={`/projects/${proposal.project?._id || proposal.project}`}
                      >
                        <button className="text-secondary hover:text-white transition-colors text-xs font-bold bg-slate-800 hover:bg-secondary/20 px-3 py-2 rounded-lg">
                          👁️ عرض المشروع
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
