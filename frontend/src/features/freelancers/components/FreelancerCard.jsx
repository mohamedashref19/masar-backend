import { Link } from "react-router-dom";

export default function FreelancerCard({ freelancer }) {
  // بنسحب بيانات البروفايل الخاص بيه (بناءً على تصميم الموديل بتاع زميلك)
  const profile = freelancer.freelancerProfile || {};
  const rating = profile.rating || 0;

  return (
    <div className="bg-primary p-6 rounded-xl border border-slate-800 shadow-lg hover:border-secondary transition-colors duration-300 flex flex-col h-full">
      {/* الهيدر: الصورة والاسم */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-700">
          {freelancer.profileImage ? (
            <img
              src={freelancer.profileImage}
              alt={freelancer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400">
              {freelancer.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-heading line-clamp-1">
            {freelancer.name}
          </h3>
          <p className="text-sm text-secondary font-medium">
            {profile.title || "مستقل"}
          </p>
        </div>
      </div>

      {/* التقييم وسعر الساعة */}
      <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800 mb-4">
        <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
          <span>⭐</span>
          <span>{rating > 0 ? rating.toFixed(1) : "جديد"}</span>
        </div>
        <div className="text-sm text-slate-300 font-medium">
          {profile.hourlyRate ? `${profile.hourlyRate}$ / ساعة` : "غير محدد"}
        </div>
      </div>

      {/* المهارات (عرض أول 3 مهارات فقط) */}
      <div className="flex flex-wrap gap-2 mb-6 mt-auto">
        {profile.skills?.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}
        {profile.skills?.length > 3 && (
          <span className="text-slate-500 text-xs px-1 py-1">
            +{profile.skills.length - 3}
          </span>
        )}
      </div>

      {/* زر عرض البروفايل */}
      <Link
        to={`/freelancers/${freelancer._id}`}
        className="block text-center w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-bold"
      >
        عرض الملف الشخصي
      </Link>
    </div>
  );
}
