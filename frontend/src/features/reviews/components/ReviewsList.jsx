export default function ReviewsList({ reviews }) {
  // 1. ضمان إن اللي جاي هو مصفوفة فعلاً (عشان الـ map ميضربش إيرور)
  const validReviews = Array.isArray(reviews) ? reviews : [];

  if (validReviews.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center mt-6">
        <p className="text-slate-400">لا توجد تقييمات لهذا المستقل حتى الآن.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-xl font-bold text-heading mb-4">
        آراء العملاء ({validReviews.length})
      </h3>

      {validReviews.map((review) => (
        <div
          key={review._id}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300">
                {review.client?.name?.charAt(0).toUpperCase() || "C"}
              </div>
              <div>
                <h4 className="text-white font-bold">
                  {review.client?.name || "عميل"}
                </h4>
                <p className="text-xs text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString("ar-EG")}
                </p>
              </div>
            </div>

            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < review.rating
                      ? "opacity-100"
                      : "opacity-30 text-slate-600"
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* 🎯 التعديل السحري: غيرنا review.review لـ review.comment */}
          <p className="text-slate-300 text-sm leading-relaxed mt-2 bg-slate-800/50 p-3 rounded-lg">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
