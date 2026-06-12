import { Link } from "react-router-dom";
import { FiStar, FiCpu, FiLayers } from "react-icons/fi";

export default function FreelancerCard({ freelancer }) {
  // سحب بيانات البروفايل بأمان من الـ Object
  const fProfile = freelancer.freelancerProfile || {};
  const averageRating = fProfile.rating || 0;

  // دالة تلوين بادج مستوى الخبرة أوتوماتيكياً
  const getExperienceBadge = (level) => {
    if (level === "expert")
      return "bg-red-500/10 text-red-400 border-red-500/20";
    if (level === "intermediate")
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-green-500/10 text-green-400 border-green-500/20"; // beginner
  };

  return (
    <div
      dir="rtl"
      className="group rounded-2xl border border-white/[0.05] bg-gradient-to-br from-white/[0.02] to-transparent p-5 shadow-lg hover:border-secondary/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all flex flex-col justify-between h-full relative overflow-hidden text-right"
    >
      {/* خط التوهج السيبراني العلوي عند الـ Hover الموحد */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-secondary/0 to-transparent group-hover:via-secondary/40 transition-all duration-500" />

      <div>
        {/* صف الرأس: الأفاتار، الاسم، وتكلفة الساعة */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* إطار الصورة الشخصية المطور كـ Premium Block */}
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/[0.08] overflow-hidden flex items-center justify-center font-black text-slate-300 text-sm shadow-inner group-hover:border-secondary/30 transition-colors shrink-0">
              {freelancer.profileImage ? (
                <img
                  src={freelancer.profileImage}
                  alt={freelancer.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-base font-black bg-gradient-to-tr from-slate-950 to-slate-900 text-slate-400">
                  {freelancer.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-sm group-hover:text-secondary transition-colors truncate max-w-[130px]">
                  {freelancer.name}
                </h3>
                {/* ربط شارة التوثيق الذكية لايف بناءً على فحص الـ AI لمنع السبام */}
                {!fProfile.isSpam && (
                  <span className="text-[8px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded-sm shrink-0">
                    ✓ موثق
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                <FiCpu size={11} /> {fProfile.title || "Technical Freelancer"}
              </p>
            </div>
          </div>

          {/* كبسولة سعر الساعة المعزولة كلياً */}
          <span
            className="inline-flex items-center text-xs font-black text-secondary bg-secondary/5 border border-secondary/20 px-2.5 py-1 rounded-lg shrink-0"
            dir="ltr"
          >
            ${fProfile.hourlyRate || "20"}/hr
          </span>
        </div>

        {/* نبذة فنية مصغرة وثابتة الارتفاع للحفاظ على أبعاد الكروت بالـ Grid */}
        <p className="text-slate-400 text-xs leading-relaxed mb-5 line-clamp-2 font-light h-10 overflow-hidden">
          {fProfile.bio ||
            "مستقل تقني محترف مسجل وموثق عبر المنظومة الرقمية لمنصة مسار."}
        </p>

        {/* كبسولات المهارات الزجاجية النظيفة */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {fProfile.skills?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-slate-950 text-slate-300 text-[10px] font-medium px-2.5 py-1 rounded-md border border-white/[0.04]"
            >
              {skill}
            </span>
          ))}
          {fProfile.skills?.length > 3 && (
            <span className="bg-slate-950 text-slate-500 text-[10px] px-2 py-1 rounded-md border border-white/[0.04] font-bold">
              +{fProfile.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* ذيل الكارد المتطور: التقييمات وزر التنقل السهمي العربي */}
      <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.05] mt-auto">
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <FiStar className="text-yellow-400 fill-yellow-400" size={11} />
            <strong className="text-slate-300 font-bold" dir="ltr">
              {averageRating > 0 ? averageRating.toFixed(1) : "NEW"}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            <FiLayers size={11} />
            <strong
              className={`px-1.5 py-0.5 rounded border text-[8px] tracking-wide uppercase ${getExperienceBadge(fProfile.experienceLevel)}`}
            >
              {fProfile.experienceLevel || "Intermediate"}
            </strong>
          </span>
        </div>

        {/* زر الانتقال للملف الشخصي مع سهم عربي متحرك لليمين */}
        <Link
          to={`/freelancers/${freelancer._id}`}
          className="inline-flex items-center text-xs font-bold text-secondary gap-1 group/link"
        >
          الملف الفني{" "}
          <span className="group-hover/link:-translate-x-1 transition-transform">
            ←
          </span>
        </Link>
      </div>
    </div>
  );
}
