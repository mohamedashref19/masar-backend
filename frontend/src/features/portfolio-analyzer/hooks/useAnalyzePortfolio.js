import { useMutation } from "@tanstack/react-query";
import { analyzePortfolioAPI } from "../services/api";
import toast from "react-hot-toast";

export const useAnalyzePortfolio = () => {
  return useMutation({
    mutationFn: analyzePortfolioAPI,
    onSuccess: (res) => {
      toast.success(
        "تم تحليل معرض أعمالك بنجاح بواسطة ذكاء مسار الاصطناعي! 🤖✨",
      );
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء تحليل الملف");
    },
  });
};
