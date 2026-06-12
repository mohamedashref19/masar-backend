import { Link } from "react-router-dom";
import { FiDollarSign, FiClock, FiActivity, FiTag } from "react-icons/fi";

export default function ProjectCard({ project }) {
  // دالة ذكية لإعطاء بادج مستوى التعقيد لونًا ديناميكيًا فخمًا يتطابق مع الباك إند
  const getComplexityStyle = (comp) => {
    const rawComp = String(comp).toLowerCase();
    if (rawComp.includes("high") || rawComp.includes("متقدم"))
      return "bg-red-500/10 text-red-400 border-red-500/20";
    if (
      rawComp.includes("low") ||
      rawComp.includes("flexible") ||
      rawComp.includes("بسيط")
    )
      return "bg-green-500/10 text-green-400 border-green-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20"; // Medium
  };

  // تأمين لقطة مصفوفة المهارات تحت أي مسمى قادم من السيرفر
  const skillsList = project.skillsRequired || project.required_skills || [];
  const projectStatus = project.status?.toLowerCase() || "open";

  return (
    <div
      dir="rtl"
      className="group rounded-2xl border border-white/[0.05] bg-gradient-to-br from-white/[0.02] to-transparent p-5 shadow-lg hover:border-secondary/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all flex flex-col justify-between h-full relative overflow-hidden text-right"
    >
      {/* خط توهج علوي خفي ينير عند الـ Hover لملامح الـ Ultra-Premium Look */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-secondary/0 to-transparent group-hover:via-secondary/40 transition-all duration-500" />

      <div>
        {/* صف الرأس: العنوان والميزانية */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="space-y-1">
            <h3 className="text-sm md:text-base font-black text-white group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
              {project.title}
            </h3>
            {/* شارة حالة المشروع الحية تظهر بأناقة */}
            {projectStatus === "open" && (
              <span className="inline-block text-[8px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.2 rounded-sm">
                📬 متاح فوراً
              </span>
            )}
          </div>

          {/* كبسولة الميزانية المأمنة كلياً بالـ LTR */}
          <span
            className="inline-flex items-center text-xs font-black text-secondary bg-secondary/5 border border-secondary/20 px-2.5 py-1 rounded-lg shrink-0 font-sans"
            dir="ltr"
          >
            ${project.budget}
          </span>
        </div>

        {/* وصف كراسة الشروط والمواصفات */}
        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3 font-light h-15 overflow-hidden">
          {project.description ||
            "مواصفات فنية مصاغة ومعتمدة عبر خوارزميات مسار الذكية."}
        </p>

        {/* لستة الكبسولات الفنية للـ Skills الزجاجية */}
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {skillsList.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-slate-950 text-slate-300 text-[10px] font-medium px-2.5 py-1 rounded-md border border-white/[0.04]"
            >
              {skill}
            </span>
          ))}
          {skillsList.length > 3 && (
            <span className="bg-slate-950 text-slate-500 text-[10px] px-2 py-1 rounded-md border border-white/[0.04] font-bold">
              +{skillsList.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* ذيل الكارت المطور: الفئة والتعقيد وزر المتابعة */}
      <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.05] mt-auto">
        <div className="flex flex-col gap-1 text-[10px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <FiActivity className="text-slate-400" />
            <span>التعقيد:</span>
            <strong
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide border uppercase ${getComplexityStyle(project.complexity)}`}
            >
              {project.complexity || "Medium"}
            </strong>
          </span>
        </div>

        {/* زرار عرض التفاصيل الانسيابي مع سهم متحرك لليسار بالتوافق مع العربي */}
        <Link
          to={`/projects/${project._id}`}
          className="inline-flex items-center text-xs font-bold text-secondary gap-1 group/link"
        >
          <span>تفاصيل العقد</span>
          <span className="group-hover/link:-translate-x-1 transition-transform">
            ←
          </span>
        </Link>
      </div>
    </div>
  );
}
