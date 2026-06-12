import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiStar,
  FiMessageSquare,
} from "react-icons/fi";
import Swal from "sweetalert2"; // 🎯 دمج التنبيهات الفخمة المتناسقة مع الـ Actions

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
  const [hoverRating, setHoverRating] = useState(0); // تتبع حركية الـ Hover للنجوم أثناء التعديل

  if (validReviews.length === 0) {
    return (
      <div
        dir="rtl"
        className="bg-[#0D121A]/40 backdrop-blur-md border border-white/[0.05] rounded-2xl p-8 text-center mt-6"
      >
        <p className="text-slate-500 text-xs md:text-sm font-light">
          📬 لا توجد سجلات تقييم أو آراء لهذا المستقل حتى الآن.
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

  const handleDeleteClick = async (reviewId) => {
    const result = await Swal.fire({
      title: "حذف التقييم؟",
      text: "هل أنت متأكد من رغبتك في مسح هذا الرأي نهائياً من سجل المستقل؟",
      icon: "className",
      iconHtml: `<span class="text-red-400 text-3xl">🗑️</span>`,
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#111827",
      confirmButtonText: "نعم، قم بالحذف",
      cancelButtonText: "تراجع",
      background: "#0D121A",
      color: "#f3f4f6",
      customClass: {
        popup: "border border-white/[0.08] rounded-2xl font-sans text-xs",
      },
    });

    if (result.isConfirmed) {
      onDelete(reviewId);
      Swal.fire({
        title: "تم الحذف",
        text: "تم إزالة التقييم بنجاح.",
        icon: "success",
        background: "#0D121A",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="mt-12 space-y-5 text-right font-['Outfit'] relative"
    >
      <h3 className="text-base font-black text-white tracking-tight mb-2 pr-1 flex items-center gap-2">
        <FiMessageSquare className="text-secondary" /> آراء وكراسات العملاء
        النخبة ({validReviews.length})
      </h3>

      <div className="space-y-4">
        {validReviews.map((review) => {
          const senderId = review.client?._id || review.client;
          const isOwner = String(currentUserId) === String(senderId);
          const isEditing = editingId === review._id;

          return (
            <div
              key={review._id}
              className="bg-[#0D121A]/60 backdrop-blur-md border border-white/[0.05] rounded-2xl p-5 md:p-6 shadow-xl relative group transition-all duration-300 hover:border-white/[0.08]"
            >
              <div className="flex justify-between items-start mb-4 gap-4">
                {/* بيانات العميل كاتب المراجعة */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 bg-slate-950 border border-white/[0.08] rounded-xl flex items-center justify-center font-black text-slate-300 text-xs shadow-inner shrink-0">
                    {review.client?.name?.charAt(0).toUpperCase() || "C"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-bold text-xs md:text-sm truncate">
                      {review.client?.name || "عميل مأمن (مسار)"}
                    </h4>
                    <p
                      className="text-[10px] text-slate-500 mt-0.5 font-mono"
                      dir="ltr"
                    >
                      {new Date(review.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* 🌟 نظام النجوم المصقول لليفل الـ Premium Look */}
                {isEditing ? (
                  <div
                    className="flex gap-1 bg-slate-950/60 px-2 py-1 rounded-lg border border-white/[0.03]"
                    dir="ltr"
                  >
                    {[1, 2, 3, 4, 5].map((num) => {
                      const isFilled = num <= (hoverRating || editRating);
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setEditRating(num)}
                          onMouseEnter={() => setHoverRating(num)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform duration-150 hover:scale-125 outline-none text-sm"
                        >
                          <FiStar
                            className={
                              isFilled
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-600"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="flex gap-0.5 text-xs text-yellow-400"
                    dir="ltr"
                  >
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-700"
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* محتوى ونص التقييم */}
              {isEditing ? (
                <div className="mt-3 space-y-3 animate-in fade-in duration-200">
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none resize-none leading-relaxed text-right"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleSaveUpdate(review._id)}
                      className="bg-secondary text-slate-950 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md shadow-secondary/5"
                    >
                      <FiCheck size={14} /> حفظ التعديل
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-white/[0.02] border border-white/[0.06] text-slate-300 px-4 py-2 rounded-xl text-xs hover:bg-white/[0.05] transition-colors flex items-center gap-1.5"
                    >
                      <FiX size={14} /> إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed bg-slate-950/30 border border-white/[0.02] p-4 rounded-xl font-light whitespace-pre-wrap">
                    {review.comment ||
                      "تم إيداع تقييم أداء ممتاز للمستقل بنجاح بضمان مسار المالية."}
                  </p>

                  {/* الـ Action Panel المعزول لليسار بالتوافق الكامل مع الـ RTL */}
                  {isOwner && (
                    <div className="absolute left-4 top-5 flex items-center gap-1 bg-slate-950/90 border border-white/[0.05] rounded-xl p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 backdrop-blur-sm">
                      <button
                        onClick={() => handleStartEdit(review)}
                        className="p-1.5 text-slate-400 hover:text-secondary rounded-lg hover:bg-white/[0.02] transition-all"
                        title="تعديل التقييم"
                      >
                        <FiEdit2 size={12} />
                      </button>
                      <span className="w-[1px] h-3 bg-white/[0.08]"></span>
                      <button
                        onClick={() => handleDeleteClick(review._id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/[0.02] transition-all"
                        title="حذف التقييم"
                      >
                        <FiTrash2 size={12} />
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
