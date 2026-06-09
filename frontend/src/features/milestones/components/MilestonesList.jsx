import { Button } from "../../../components";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useStripePayments } from "../../payments/hooks/useStripePayments";

export default function MilestonesList({
  milestones,
  projectId,
  userRole,
  isOwner,
  actions,
}) {
  // 🎯 الاستخراج المباشر للنظافة والسرعة
  const { submitWorkMutate, isSubmittingWork } = actions;

  const {
    fundMilestoneMutate,
    isFunding,
    releaseMilestoneMutate,
    isReleasing,
  } = useStripePayments(projectId);

  if (milestones.length === 0) {
    return (
      <div className="text-center p-6 bg-slate-900/20 border border-slate-800/60 rounded-xl text-slate-500 text-sm">
        لم يتم تقسيم المشروع إلى مراحل مادية بعد.
      </div>
    );
  }

  const normalizedRole = userRole?.toLowerCase();

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => {
        console.log("Milestone Status:", milestone.status); // 🔍 لوج للتأكد من الحالة
        const currentStatus =
          milestone.status?.toLowerCase() || "pending_funding";

        const statusColors = {
          pending_funding: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
          submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          approved: "bg-green-500/10 text-green-400 border-green-500/20",
          completed: "bg-green-500/10 text-green-400 border-green-500/20",
        };

        const statusText = {
          pending_funding: "في انتظار بدء المرحلة والتسليم",
          pending: "المرحلة نشطة - في انتظار تسليم الشغل",
          submitted: "قيد المراجعة الفنية من العميل",
          approved: "مكتملة (تم تحويل الأموال للمستقل)",
          completed: "مكتملة (تم تحويل الأموال للمستقل)",
        };

        const milestoneDate =
          milestone.deadline || milestone.createdAt || new Date();
        const formattedMilestoneDeadline = format(
          new Date(milestoneDate),
          "dd MMMM yyyy",
          { locale: ar },
        );

        return (
          <div
            key={milestone._id}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700/60 transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-white text-md">
                  {milestone.title}
                </h4>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusColors[currentStatus] || statusColors.pending_funding}`}
                >
                  {statusText[currentStatus] || statusText.pending_funding}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                {milestone.description}
              </p>

              <p className="text-[11px] text-slate-500">
                تاريخ التسليم المستهدف:{" "}
                <span className="text-slate-300 font-medium">
                  {formattedMilestoneDeadline}
                </span>
              </p>
            </div>

            <div className="flex flex-col md:items-end gap-3 w-full md:w-auto shrink-0">
              <span className="text-xl font-extrabold text-secondary">
                {milestone.amount} $
              </span>

              {/* 💳 أكشن العميل 1: شحن ميزانية المرحلة */}
              {isOwner && currentStatus === "pending_funding" && (
                <Button
                  size="sm"
                  variant="accent"
                  onClick={() => fundMilestoneMutate(milestone._id)}
                  disabled={isFunding}
                >
                  {isFunding
                    ? "جاري فتح الـ Checkout..."
                    : "شحن ميزانية المرحلة 💳"}
                </Button>
              )}

              {/* 🚀 أكشن المستقل: تنظيف الـ "actions." لتفادي الـ Runtime Error */}
              {normalizedRole === "freelancer" &&
                currentStatus === "pending" && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() =>
                      submitWorkMutate({
                        projectId,
                        milestoneId: milestone._id,
                      })
                    }
                    disabled={isSubmittingWork}
                  >
                    {isSubmittingWork
                      ? "جاري إرسال الملفات..."
                      : "تسليم ملفات المرحلة 🚀"}
                  </Button>
                )}

              {/* 💸 أكشن العميل 2: الإفراج المالي الحقيقي عبر Stripe */}
              {isOwner && currentStatus === "submitted" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold"
                  onClick={() => releaseMilestoneMutate(milestone._id)}
                  disabled={isReleasing}
                >
                  {isReleasing
                    ? "جاري تحويل الأموال بنجاح..."
                    : "اعتماد العمل وصرف الأموال فوراً ✔️💸"}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
