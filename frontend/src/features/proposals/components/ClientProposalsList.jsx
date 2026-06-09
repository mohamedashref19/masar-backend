import { useProjectProposals } from "../hooks/useProjectProposals";
import { useProposalActions } from "../hooks/useProposalActions";
import { Button } from "../../../components";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createConversation } from "../../chat/services/chatApi";
import toast from "react-hot-toast";

export default function ClientProposalsList({ projectId, projectStatus }) {
  const { data, isLoading, isError } = useProjectProposals(projectId);
  const { acceptMutation, rejectMutation } = useProposalActions(projectId);
  const navigate = useNavigate();

  // ميوتيشن فتح الشات
  const { mutate: handleStartChat, isPending: isStartingChat } = useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      toast.success("تم فتح غرفة المحادثة 💬");
      navigate("/inbox");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء محاولة بدء المحادثة.");
    },
  });

  const proposals =
    data?.data?.proposals || data?.proposals || data?.data || [];
  if (isLoading) {
    return (
      <div className="py-8 text-center text-slate-400">
        جاري تحميل العروض...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-red-500">
        حدث خطأ أثناء جلب العروض.
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center mt-8">
        <p className="text-slate-400">لم يتقدم أحد لهذا المشروع حتى الآن.</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-heading mb-6 border-b border-slate-800 pb-4">
        العروض المقدمة ({proposals.length})
      </h2>

      <div className="space-y-6">
        {proposals.map((proposal) => (
          <div
            key={proposal._id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md transition-all hover:border-slate-700"
          >
            {/* معلومات المستقل */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300">
                  {proposal.freelancer?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Link
                    to={`/freelancers/${proposal.freelancer?._id}`}
                    className="text-lg font-bold text-white hover:text-secondary transition-colors"
                  >
                    {proposal.freelancer?.name}
                  </Link>
                  <p className="text-sm text-slate-400">
                    {proposal.freelancer?.freelancerProfile?.title || "مستقل"}
                  </p>
                </div>
              </div>

              {/* تفاصيل العرض (السعر والمدة) */}
              <div className="text-left">
                <div className="text-xl font-bold text-secondary">
                  {proposal.price} $
                </div>
                <div className="text-sm text-slate-400">
                  المدة: {proposal.duration} أيام
                </div>
              </div>
            </div>

            {/* تفاصيل الـ Cover Letter */}
            <div className="bg-slate-800/50 p-4 rounded-lg mb-6">
              <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                {proposal.coverLetter}
              </p>
            </div>

            {/* الأزرار (تظهر فقط لو المشروع لسه Open والعرض Pending) */}
            {projectStatus === "open" && proposal.status === "pending" && (
              <div className="flex gap-3 border-t border-slate-800 pt-4">
                {/* زرار المراسلة والمناقشة قبل الاتفاق */}
                <Button
                  type="button"
                  onClick={() =>
                    handleStartChat({
                      projectId,
                      freelancerId: proposal.freelancer?._id,
                    })
                  }
                  disabled={
                    isStartingChat ||
                    acceptMutation.isPending ||
                    rejectMutation.isPending
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-secondary border border-secondary/10 flex-1 transition-all"
                >
                  مراسلة ومناقشة العرض 💬
                </Button>

                {/* زرار قبول العرض الفعلي اللي بيحرك الـ State Machine للباك إند */}
                <Button
                  variant="accent"
                  className="flex-1"
                  onClick={() => acceptMutation.mutate(proposal._id)}
                  disabled={
                    isStartingChat ||
                    acceptMutation.isPending ||
                    rejectMutation.isPending
                  }
                >
                  {acceptMutation.isPending &&
                  acceptMutation.variables === proposal._id
                    ? "جاري القبول وبدء المشروع..."
                    : "قبول العرض وبدء التنفيذ"}
                </Button>

                {/* زرار الرفض */}
                <Button
                  className="bg-slate-800 hover:bg-red-500/20 text-white hover:text-red-400 border border-transparent hover:border-red-500/30 px-6 transition-all"
                  onClick={() => rejectMutation.mutate(proposal._id)}
                  disabled={
                    isStartingChat ||
                    acceptMutation.isPending ||
                    rejectMutation.isPending
                  }
                >
                  رفض
                </Button>
              </div>
            )}

            {/* لو العرض ده مقبول أو مرفوض */}
            {proposal.status === "accepted" && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-center rounded-lg font-bold">
                تم قبول هذا العرض
              </div>
            )}
            {proposal.status === "rejected" && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-center rounded-lg font-bold">
                تم رفض هذا العرض
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
