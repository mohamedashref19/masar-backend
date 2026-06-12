import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFreelancerProfile } from "../features/freelancers/hooks/useFreelancerProfile";
import ReviewsList from "../features/reviews/components/ReviewsList";
import { FiDollarSign, FiStar, FiUser, FiCpu, FiAward } from "react-icons/fi";

export default function FreelancerProfile() {
  const { id } = useParams();

  const { user: currentUser } = useSelector((state) => state.auth);
  const {
    profile,
    reviews,
    isLoading,
    isError,
    onDeleteReview,
    onUpdateReview,
  } = useFreelancerProfile(id);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
        <span className="text-xs text-slate-500 font-medium">
          جاري سحب وفحص هوية المستقل التقنية...
        </span>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div
        dir="rtl"
        className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] text-center p-4"
      >
        <span className="text-4xl mb-4">🔍</span>
        <p className="text-red-400 font-bold text-sm">
          حدث خطأ أثناء مزامنة الملف الشخصي، أو أن المعرف غير مسجل لدينا.
        </p>
      </div>
    );
  }

  const fProfile = profile.freelancerProfile || {};
  const averageRating = fProfile.rating || 0;

  return (
    <div
      dir="rtl"
      className="container mx-auto py-12 px-4 mt-20 max-w-5xl text-right relative selection:bg-secondary/30"
    >
      {/* هالة توهج محيطية فخمة خلف الكارت */}
      <div className="absolute top-24 left-1/3 w-96 h-96 rounded-full bg-secondary/[0.02] blur-[140px] pointer-events-none" />

      {/* الكارت الزجاجي الرئيسي للبروفايل */}
      <div className="bg-[#0D121A] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl mb-8 relative">
        {/* الغلاف العلوي المصقول بتدرج سيبراني */}
        <div className="h-40 bg-gradient-to-r from-slate-900 via-[#0B0F17] to-[#121824] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D121A]/80" />
        </div>

        <div className="px-6 md:px-8 pb-8 relative">
          {/* كتلة الرأس: الصورة، الاسم، والبيانات المالية */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-20 mb-8 pb-6 border-b border-white/[0.04]">
            {/* إطار الصورة الشخصية المتوهج */}
            <div className="w-32 h-32 rounded-2xl border-4 border-[#0D121A] bg-slate-950 overflow-hidden flex-shrink-0 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative group">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black bg-gradient-to-tr from-slate-900 to-slate-800 text-slate-400">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* الاسم والمسمى الوظيفي */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {profile.name}
                </h1>
                {/* شارة التوثيق الذكية المربوطة بالـ AI تفك الـ Spam بكرة أمام اللجنة */}
                {!fProfile.isSpam && (
                  <span className="text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                    🛡️ موثّق بالـ AI
                  </span>
                )}
              </div>
              <p className="text-secondary font-bold text-base mt-1.5 flex items-center gap-1.5">
                <FiCpu className="text-slate-500" size={15} />{" "}
                {fProfile.title || "مستقل تقني نخبة"}
              </p>
            </div>

            {/* كبسولة البيانات المالية والتقييم الـ Floating Pill */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 bg-slate-950/60 backdrop-blur-md p-4 rounded-xl border border-white/[0.05] mt-4 md:mt-0 min-w-[180px]">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                  تكلفة التعاقد
                </span>
                <div
                  className="text-xl font-black text-white flex items-baseline gap-1"
                  dir="ltr"
                >
                  <span className="text-secondary text-sm font-bold">$</span>
                  {fProfile.hourlyRate || "--"}
                  <span className="text-xs text-slate-500 font-normal">
                    /hr
                  </span>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-white/5 md:w-full md:h-[1px]" />

              <div className="text-right md:text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 md:text-left">
                  التصنيف الرقمي
                </span>
                <div
                  className="flex items-center gap-1 text-sm font-black text-yellow-400"
                  dir="ltr"
                >
                  <FiStar size={14} className="fill-yellow-400" />
                  <span>
                    {averageRating > 0 ? averageRating.toFixed(1) : "NEW"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* النبذة التعريفية */}
          <div className="space-y-3 mb-8">
            <h2 className="text-sm font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <FiUser className="text-secondary" /> النبذة المهنية وكراسة
              الخبرات
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap bg-slate-950/20 p-4 rounded-xl border border-white/[0.02] font-light">
              {fProfile.bio || "لم يقم المستقل بصياغة النبذة الفنية بعد."}
            </p>
          </div>

          {/* المهارات الفنية والأدوات */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <FiAward className="text-secondary" /> الحزمة البرمجية والأدوات
              المدعومة
            </h2>
            <div className="flex flex-wrap gap-2">
              {fProfile.skills?.length > 0 ? (
                fProfile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-slate-950 text-slate-200 text-xs font-medium px-4 py-2 rounded-xl border border-white/[0.05] transition-all hover:border-secondary/40 hover:bg-slate-900 cursor-default"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-xs">
                  لا توجد حزم مهارية مسجلة في الوقت الحالي.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* قائمة التقييمات السفلية */}
      <ReviewsList
        reviews={reviews}
        currentUserId={currentUser?._id}
        onDelete={onDeleteReview}
        onUpdate={onUpdateReview}
      />
    </div>
  );
}
