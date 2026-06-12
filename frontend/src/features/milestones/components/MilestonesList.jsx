import { Button } from "../../../components";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useStripePayments } from "../../payments/hooks/useStripePayments";
import { FiCreditCard, FiUploadCloud, FiAward, FiLock } from "react-icons/fi";

export default function MilestonesList({
  milestones,
  projectId,
  userRole,
  isOwner,
  actions,
}) {
  const { submitWorkMutate, isSubmittingWork } = actions;

  const {
    fundMilestoneMutate,
    isFunding,
    releaseMilestoneMutate,
    isReleasing,
  } = useStripePayments(projectId);

  if (milestones.length === 0) {
    return (
      <div
        dir="rtl"
        className="text-center p-12 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl text-slate-500 text-xs md:text-sm font-light"
      >
        📬 لم يتم تقسيم بنود هذا المشروع إلى مراحل مادية تضمن حقوق الطرفين بعد.
      </div>
    );
  }

  const normalizedRole = userRole?.toLowerCase();

  return (
    <div dir="rtl" className="space-y-4 text-right">
      {milestones.map((milestone) => {
        const currentStatus =
          milestone.status?.toLowerCase() || "pending_funding";

        // 🎯 1. تحديث الألوان بلمسات متوهجة وأنثوية تليق بأنظمة الـ Ledgers الاحترافية
        const statusColors = {
          pending_funding: "bg-amber-500/5 text-amber-400 border-amber-500/10",
          funded: "bg-blue-500/5 text-blue-400 border-blue-500/10",
          submitted:
            "bg-purple-500/5 text-purple-400 border-purple-500/10 animate-pulse",
          approved: "bg-yellow-500/5 text-yellow-400 border-yellow-500/10",
          released: "bg-green-500/5 text-green-400 border-green-500/10",
        };

        const statusText = {
          pending_funding: "بانتظار الشحن المالي من العميل ⏳",
          funded: "نشطة - بانتظار تسليم العمل البرمجي 💻",
          submitted: "تم تسليم العمل - قيد المراجعة والفحص الفني 👀",
          approved: "تمت الموافقة - بانتظار أمر الصرف البنكي 💸",
          released: "مكتملة ومصروفة (تم تحويل الأموال للمحفظة) ✔️",
        };

        const milestoneDate = milestone.deadline || milestone.createdAt;
        const formattedMilestoneDeadline = format(
          new Date(milestoneDate),
          "dd MMMM yyyy",
          { locale: ar },
        );

        return (
          <div
            key={milestone._id}
            className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-white/[0.08] transition-all group relative overflow-hidden"
          >
            {/* خط إضاءة خلفي خفيف للكروت المعتمدة والمنتهية نجاحاً */}
            {currentStatus === "released" && (
              <div className="absolute top-0 right-0 bottom-0 w-1 bg-green-500/40" />
            )}

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="font-bold text-white text-sm md:text-base group-hover:text-secondary transition-colors truncate">
                  {milestone.title}
                </h4>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${statusColors[currentStatus] || statusColors.pending_funding}`}
                >
                  {statusText[currentStatus] || statusText.pending_funding}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-light max-w-2xl whitespace-pre-wrap">
                {milestone.description}
              </p>

              <p className="text-[11px] text-slate-500 font-medium">
                تاريخ الاستحقاق المستهدف:{" "}
                <span className="text-slate-300">
                  {formattedMilestoneDeadline}
                </span>
              </p>
            </div>

            {/* كتلة الأكشن المالية والعمليات (مؤمنة الرموز والاتجاهات بالملي) */}
            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto shrink-0 border-t border-white/[0.04] pt-4 md:pt-0 md:border-none">
              <span
                className="text-xl md:text-2xl font-black text-secondary flex items-baseline gap-0.5"
                dir="ltr"
              >
                <span className="text-xs font-bold text-secondary/70">$</span>
                {milestone.amount}
              </span>

              {/* 💳 أكشن العميل 1: شحن ميزانية المرحلة عبر Stripe Checkout */}
              {isOwner && currentStatus === "pending_funding" && (
                <Button
                  size="sm"
                  variant="accent"
                  className="w-full md:w-auto text-xs font-bold py-2 px-4 rounded-xl text-slate-950 flex items-center justify-center gap-1.5 shadow-md shadow-secondary/5"
                  onClick={() => fundMilestoneMutate(milestone._id)}
                  disabled={isFunding}
                >
                  {isFunding ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
                      <span>تأمين القناة ماليًا...</span>
                    </>
                  ) : (
                    <>
                      <FiCreditCard size={13} />
                      <span>شحن ميزانية المرحلة 💳</span>
                    </>
                  )}
                </Button>
              )}

              {/* 🚀 أكشن المستقل: تسليم الملفات وكراسة الأكواد */}
              {normalizedRole === "freelancer" &&
                currentStatus === "funded" && (
                  <Button
                    size="sm"
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 transition-all"
                    onClick={() =>
                      submitWorkMutate({
                        projectId,
                        milestoneId: milestone._id,
                      })
                    }
                    disabled={isSubmittingWork}
                  >
                    {isSubmittingWork ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        <span>جاري رفع مستندات الكود...</span>
                      </>
                    ) : (
                      <>
                        <FiUploadCloud size={13} />
                        <span>تسليم ملفات المرحلة 🚀</span>
                      </>
                    )}
                  </Button>
                )}

              {/* 💸 أكشن العميل 2: الإفراج المالي الآمن والدائم من محفظة الـ Escrow للمستقل */}
              {isOwner && currentStatus === "submitted" && (
                <Button
                  size="sm"
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-xs font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-green-500/10 transition-all"
                  onClick={() => releaseMilestoneMutate(milestone._id)}
                  disabled={isReleasing}
                >
                  {isReleasing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      <span>جاري فك التشفير المالي...</span>
                    </>
                  ) : (
                    <>
                      <FiAward size={13} />
                      <span>اعتماد العمل وصرف الأموال فوراً ✔️💸</span>
                    </>
                  )}
                </Button>
              )}

              {/* شارة القفل لحفظ الأمان المالي لو المرحلة مشحونة وجاهزة */}
              {currentStatus === "funded" && (
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-bold bg-white/[0.01] px-2 py-0.5 rounded border border-white/[0.03]">
                  <FiLock size={10} className="text-blue-400" /> مأمنة بحساب
                  وسيط
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
