import { Link } from "react-router-dom";
import { useClientDashboard } from "../features/dashboard/hooks/useClientDashboard";
import { Button } from "../components"; // تأكد من مسار مكوناتك
import { useDeleteProject } from "../features/projects/hooks/useProjectMutations";
import Swal from "sweetalert2";

export default function ClientDashboard() {
  const { projects, stats, isLoading } = useClientDashboard();

  const { mutate: deleteProjectBtn, isPending: isDeleting } =
    useDeleteProject();

  // دالة تأكيد الحذف
  const handleDelete = (projectId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "نعم، احذف المشروع!",
      cancelButtonText: "إلغاء",
      background: "#1e293b",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProjectBtn(projectId);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-6xl">
      {/* 🎯 الهيدر وزرار إضافة مشروع */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-heading">لوحة التحكم</h1>
          <p className="text-slate-400 mt-2">
            مرحباً بك مجدداً، إليك ملخص مشاريعك الحالية.
          </p>
        </div>
        <Link to="/post-job">
          <Button variant="accent" className="px-6 py-3">
            + أضف مشروع جديد
          </Button>
        </Link>
      </div>

      {/* 🎯 كروت الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-slate-400 text-sm font-bold mb-2">
            إجمالي المشاريع
          </span>
          <span className="text-4xl font-extrabold text-white">
            {stats.total}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-slate-400 text-sm font-bold mb-2">
            مشاريع نشطة
          </span>
          <span className="text-4xl font-extrabold text-secondary">
            {stats.active}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-slate-400 text-sm font-bold mb-2">
            مشاريع مكتملة
          </span>
          <span className="text-4xl font-extrabold text-green-500">
            {stats.completed}
          </span>
        </div>
      </div>

      {/* 🎯 قائمة المشاريع */}
      <div className="bg-primary border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">مشاريعي</h2>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 mb-4">
              لم تقم بإضافة أي مشاريع حتى الآن.
            </p>
            <Link to="/post-job">
              <Button variant="outline">أضف مشروعك الأول</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-300 text-sm">
                  <th className="p-4 font-semibold">عنوان المشروع</th>
                  <th className="p-4 font-semibold">الميزانية</th>
                  <th className="p-4 font-semibold">الحالة</th>
                  <th className="p-4 font-semibold">تاريخ النشر</th>
                  <th className="p-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project._id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="p-4 text-white font-medium max-w-[200px] truncate">
                      {project.title}
                    </td>
                    <td className="p-4 text-slate-300">${project.budget}</td>
                    <td className="p-4">
                      {project.status === "open" && (
                        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs">
                          مفتوح
                        </span>
                      )}
                      {project.status === "in_progress" && (
                        <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs">
                          قيد التنفيذ
                        </span>
                      )}
                      {project.status === "completed" && (
                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs">
                          مكتمل
                        </span>
                      )}
                      {project.status === "canceled" && (
                        <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs">
                          ملغي
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(project.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* زرار الإدارة / رؤية العروض */}
                        <Link to={`/projects/${project._id}`}>
                          <button
                            className="text-secondary hover:text-white transition-colors text-xs font-bold bg-slate-800 hover:bg-secondary/20 px-3 py-2 rounded-lg"
                            title="إدارة المشروع"
                          >
                            👁️ إدارة
                          </button>
                        </Link>

                        {/* زرار التعديل */}
                        {/* هنوديه لصفحة التعديل (هنبنيها بعدين أو لو بوب-أب) */}
                        <Link to={`/projects/edit/${project._id}`}>
                          <button
                            className="text-blue-400 hover:text-white transition-colors text-xs font-bold bg-slate-800 hover:bg-blue-500/20 px-3 py-2 rounded-lg"
                            title="تعديل المشروع"
                          >
                            ✏️ تعديل
                          </button>
                        </Link>

                        {/* زرار الحذف */}
                        <button
                          onClick={() => handleDelete(project._id)}
                          disabled={isDeleting}
                          className="text-red-400 hover:text-white transition-colors text-xs font-bold bg-slate-800 hover:bg-red-500/20 px-3 py-2 rounded-lg disabled:opacity-50"
                          title="حذف المشروع"
                        >
                          {isDeleting ? "⏳" : "🗑️ حذف"}
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
