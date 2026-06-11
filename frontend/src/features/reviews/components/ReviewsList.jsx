import { useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi"; // أيقونات ناعمة وراقية

export default function ReviewsList({
  reviews,
  currentUserId,
  onDelete,
  onUpdate,
}) {
  const validReviews = Array.isArray(reviews) ? reviews : [];

  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  if (validReviews.length === 0) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-8 text-center mt-6">
        <p className="text-slate-500 text-sm font-medium">
          لا توجد تقييمات لهذا المستقل حتى الآن.
        </p>
      </div>
    );
  }

  const handleStartEdit = (review) => {
    setEditingId(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleSaveUpdate = (reviewId) => {
    if (!editComment.trim()) return;
    onUpdate({
      reviewId,
      reviewData: { comment: editComment, rating: editRating },
    });
    setEditingId(null);
  };

  return (
    <div className="mt-12 space-y-6 font-['Outfit']">
      <h3 className="text-lg font-bold text-heading tracking-tight mb-2 pr-1">
        آراء العملاء ({validReviews.length})
      </h3>

      <div className="space-y-4">
        {validReviews.map((review) => {
          const isOwner =
            currentUserId === (review.client?._id || review.client);
          const isEditing = editingId === review._id;

          return (
            <div
              key={review._id}
              className="bg-slate-900/30 backdrop-blur-md border border-white/[0.03] rounded-2xl p-6 shadow-xl relative group transition-all duration-300 hover:border-white/[0.07]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/[0.05] rounded-xl flex items-center justify-center font-bold text-slate-300 text-sm tracking-wide">
                    {review.client?.name?.charAt(0).toUpperCase() || "C"}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      {review.client?.name || "عميل مسار"}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </div>

                {/* النجوم برؤية وتصميم أعمق */}
                {isEditing ? (
                  <div className="flex gap-1 text-sm text-secondary">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setEditRating(num)}
                        className="transition-transform duration-200 hover:scale-125"
                      >
                        {num <= editRating ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex text-xs text-secondary/90 tracking-tighter">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < review.rating
                            ? "opacity-100"
                            : "opacity-20 text-slate-600"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* محتوى ونص التقييم */}
              {isEditing ? (
                <div className="mt-3 space-y-3 animate-fade-in">
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full bg-slate-950 border border-white/[0.05] rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-secondary/40 resize-none leading-relaxed"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleSaveUpdate(review._id)}
                      className="bg-secondary text-primary px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5"
                    >
                      <FiCheck size={14} /> حفظ التعديل
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-white/[0.03] border border-white/[0.05] text-slate-400 px-4 py-2 rounded-xl text-xs hover:bg-white/[0.06] transition-colors flex items-center gap-1.5"
                    >
                      <FiX size={14} /> إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-slate-300 text-xs leading-relaxed bg-white/[0.01] border border-white/[0.02] p-4 rounded-xl font-normal">
                    {review.comment}
                  </p>

                  {/* الـ Action Panel الراقي (يظهر فقط انسيابياً عند الـ Hover في أعلى اليسار) */}
                  {isOwner && (
                    <div className="absolute left-4 top-5 flex items-center gap-1 bg-slate-950/80 border border-white/[0.05] rounded-xl p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 backdrop-blur-sm">
                      <button
                        onClick={() => handleStartEdit(review)}
                        className="p-1.5 text-slate-400 hover:text-secondary rounded-lg hover:bg-white/[0.02] transition-all"
                        title="تعديل التقييم"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <span className="w-[1px] h-3 bg-white/[0.08]"></span>
                      <button
                        onClick={() => {
                          if (confirm("هل أنت متأكد من حذف هذا التقييم؟")) {
                            onDelete(review._id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/[0.02] transition-all"
                        title="حذف التقييم"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
