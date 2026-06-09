import { useParams } from "react-router-dom";
import { useFreelancerProfile } from "../features/freelancers/hooks/useFreelancerProfile";
import ReviewsList from "../features/reviews/components/ReviewsList";

export default function FreelancerProfile() {
  const { id } = useParams();
  const { profile, reviews, isLoading, isError } = useFreelancerProfile(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="text-center py-20 text-red-500 mt-16">
        حدث خطأ أثناء تحميل الملف الشخصي، أو أن المستخدم غير موجود.
      </div>
    );
  }

  const fProfile = profile.freelancerProfile || {};
  const averageRating = fProfile.rating || 0;

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-5xl">
      <div className="bg-primary border border-slate-800 rounded-xl overflow-hidden shadow-xl mb-8">
        <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-primary bg-slate-800 overflow-hidden flex-shrink-0">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-heading">
                {profile.name}
              </h1>
              <p className="text-secondary text-lg mt-1">
                {fProfile.title || "مستقل"}
              </p>
            </div>

            <div className="flex flex-col md:items-end gap-2 bg-slate-900 p-4 rounded-xl border border-slate-800 mt-4 md:mt-0">
              <div className="text-2xl font-bold text-white">
                {fProfile.hourlyRate ? `${fProfile.hourlyRate} $` : "-- $"}{" "}
                <span className="text-sm text-slate-400 font-normal">
                  / ساعة
                </span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400 font-bold">
                <span>
                  ⭐ {averageRating > 0 ? averageRating.toFixed(1) : "جديد"}
                </span>
              </div>

              {/* 🎯 تم حذف زر المراسلة العشوائي لحماية الـ Business Logic والـ Constraints للباك إند */}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">
              النبذة التعريفية
            </h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {fProfile.bio || "لم يقم المستقل بإضافة نبذة تعريفية بعد."}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">المهارات</h2>
            <div className="flex flex-wrap gap-2">
              {fProfile.skills?.length > 0 ? (
                fProfile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg border border-slate-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-slate-500">لا توجد مهارات مضافة.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReviewsList reviews={reviews} />
    </div>
  );
}
