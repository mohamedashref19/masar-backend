import { useState } from "react";
import { Link } from "react-router-dom";
import { useClientDashboard } from "../features/dashboard/hooks/useClientDashboard";
import { Button } from "../components";
import { useDeleteProject } from "../features/projects/hooks/useProjectMutations";
import Swal from "sweetalert2";
import {
  FiPlusCircle,
  FiFolder,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiGrid,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

export default function ClientDashboard() {
  const { projects = [], stats, isLoading } = useClientDashboard();
  const { mutate: deleteProjectBtn, isPending: isDeleting } =
    useDeleteProject();

  // 🎯 دالة تأكيد الحذف بستايل السايبير المتناسق مع ألوان المنصة
  const handleDelete = (projectId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف مستندات المشروع نهائياً ولن تتمكن من تراجع الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#1e293b",
      confirmButtonText: "نعم، احذف المشروع 🗑️",
      cancelButtonText: "إلغاء",
      background: "#0D121A",
      color: "#f1f5f9",
      customClass: {
        popup: "border border-white/[0.08] rounded-2xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProjectBtn(projectId);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
        <span className="text-xs text-slate-500 font-medium">
          جاري تحديث قنوات مشاريعك...
        </span>
      </div>
    );
  }

  // مصفوفة منسقة لتغذية كروت الـ Bento العلوي ديناميكياً
  const statsCards = [
    {
      label: "إجمالي المشاريع المودعة",
      value: stats?.total || 0,
      icon: <FiGrid />,
      border: "hover:border-slate-800",
    },
    {
      label: "مشاريع نشطة (قيد العمل)",
      value: stats?.active || 0,
      icon: <FiActivity className="text-secondary" />,
      border: "hover:border-secondary/30",
      color: "text-secondary",
    },
    {
      label: "مشاريع مكتملة ومغلقة",
      value: stats?.completed || 0,
      icon: <FiCheckCircle className="text-green-400" />,
      border: "hover:border-green-500/20",
      color: "text-green-400",
    },
  ];

  return (
    <div
      dir="rtl"
      className="container mx-auto py-12 px-4 mt-20 max-w-6xl text-right relative selection:bg-secondary/30"
    >
      {/* هالة توهج خلفية */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-accent/[0.02] blur-[130px] pointer-events-none" />

      {/* 🎯 هيدر اللوحة الفخم */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 border-b border-white/[0.05] pb-6">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">
            منظومة إدارة التعاقدات والـ AI
          </span>
          <h1 className="text-3xl font-black text-white mt-1">
            لوحة تحكم أعمالك
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            مرحباً بك مجدداً. تابع متطلبات مشاريعك الحالية، وافحص ترشيحات
            المستقلين لايف.
          </p>
        </div>
        <Link to="/post-job">
          <Button
            variant="accent"
            className="px-6 py-3.5 font-bold rounded-xl shadow-[0_15px_30px_rgba(228,255,0,0.1)] hover:shadow-[0_15px_30px_rgba(228,255,0,0.25)] hover:scale-[1.02] transition-all flex items-center gap-2 text-slate-950"
          >
            <FiPlusCircle size={16} /> انشر مشروعاً فنيًا جديداً
          </Button>
        </Link>
      </div>

      {/* 📊 كروت الإحصائيات (Premium Bento Box Display) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {statsCards.map((card, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent p-6 transition-all ${card.border}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-bold">
                {card.label}
              </span>
              <div className="p-2 bg-slate-900 border border-white/5 rounded-xl text-sm">
                {card.icon}
              </div>
            </div>
            <span
              className={`text-4xl font-black block mt-4 ${card.color || "text-white"}`}
              dir="ltr"
            >
              {card.value}
            </span>
          </div>
        ))}
      </div>

      {/* 🎯 جدول قائمة المشاريع المطور */}
      <div className="bg-[#0D121A] border border-white/[0.05] rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b border-white/[0.05] bg-gradient-to-r from-white/[0.01] to-transparent flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FiFolder className="text-secondary" /> سجل طلباتك ومشاريعك
              المسجلة
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              مراقبة دورة حياة الملفات والتحقق من العقود
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="p-16 text-center border-t border-white/[0.02]">
            <span className="text-4xl block mb-4">📂</span>
            <p className="text-slate-400 text-sm mb-4">
              لم تقم بإيداع أو نشر أي مشاريع على السيرفر حتى الآن.
            </p>
            <Link to="/post-job">
              <Button
                variant="outline"
                className="text-xs border-white/10 text-slate-300 hover:bg-white/5 py-2.5"
              >
                انشر مشروعك الأول الآن
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-950/40 border-b border-white/[0.05] text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  <th className="p-4 pr-6">عنوان الملف البرمجي</th>
                  <th className="p-4">الميزانية المرصودة</th>
                  <th className="p-4">حالة البند</th>
                  <th className="p-4">تاريخ النشر الرقمي</th>
                  <th className="p-4 text-center pl-6">
                    إجراءات المراقبة والتحكم
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {projects.map((project) => (
                  <tr
                    key={project._id}
                    className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 pr-6 max-w-[220px] truncate">
                      <span className="font-bold text-slate-200 group-hover:text-secondary transition-colors block text-sm">
                        {project.title}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        ID: {project._id?.slice(-8)}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-300" dir="ltr">
                      ${project.budget}
                    </td>
                    <td className="p-4">
                      {/* تأمين ومزامنة حالات الكود من الباك إند بالملي */}
                      {project.status === "open" && (
                        <span className="inline-flex items-center gap-1.5 bg-blue-500/5 text-blue-400 border border-blue-500/10 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                          <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />{" "}
                          متاح للتقديم
                        </span>
                      )}
                      {(project.status === "in_progress" ||
                        project.status === "in-progress") && (
                        <span className="inline-flex items-center gap-1.5 bg-amber-500/5 text-amber-400 border border-amber-500/10 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                          <span className="w-1 h-1 rounded-full bg-amber-400" />{" "}
                          قيد التنفيذ المالي
                        </span>
                      )}
                      {project.status === "completed" && (
                        <span className="inline-flex items-center gap-1.5 bg-green-500/5 text-green-400 border border-green-500/10 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                          <span className="w-1 h-1 rounded-full bg-green-400" />{" "}
                          مكتمل ومسلم
                        </span>
                      )}
                      {(project.status === "canceled" ||
                        project.status === "cancelled") && (
                        <span className="inline-flex items-center gap-1.5 bg-red-500/5 text-red-400 border border-red-500/10 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
                          <span className="w-1 h-1 rounded-full bg-red-400" />{" "}
                          ملغي ومغلق
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 font-light">
                      {new Date(project.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-4 text-center pl-6">
                      <div className="flex items-center justify-center gap-2">
                        {/* إدارة */}
                        <Link to={`/projects/${project._id}`}>
                          <button
                            className="p-2 text-secondary bg-secondary/5 border border-secondary/15 rounded-lg hover:bg-secondary hover:text-slate-950 transition-all flex items-center justify-center"
                            title="إدارة المشروع ومعاينة العروض"
                          >
                            <FiEye size={14} />
                          </button>
                        </Link>

                        {/* تعديل */}
                        <Link to={`/projects/edit/${project._id}`}>
                          <button
                            className="p-2 text-blue-400 bg-blue-500/5 border border-blue-500/15 rounded-lg hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center"
                            title="تعديل مواصفات المشروع"
                          >
                            <FiEdit2 size={14} />
                          </button>
                        </Link>

                        {/* حذف */}
                        <button
                          onClick={() => handleDelete(project._id)}
                          disabled={isDeleting}
                          className="p-2 text-red-400 bg-red-500/5 border border-red-500/15 rounded-lg hover:bg-red-500 hover:text-white disabled:opacity-40 transition-all flex items-center justify-center"
                          title="حذف طلب المشروع نهائيًا"
                        >
                          {isDeleting ? (
                            <span className="w-3.5 h-3.5 border-2 border-t-transparent border-red-400 rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 size={14} />
                          )}
                        </button>
                      </div>
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
