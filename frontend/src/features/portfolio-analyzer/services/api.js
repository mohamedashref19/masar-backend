// src/features/ai/services/aiApi.js
import api from "../../../services/api";

export const analyzePortfolioAPI = async (portfolioData) => {
  const formData = new FormData();

  // 1. حقن النصوص والروابط بأمان
  if (portfolioData.portfolio_text) {
    formData.append("portfolio_text", portfolioData.portfolio_text);
  }
  if (portfolioData.github_url) {
    formData.append("github_url", portfolioData.github_url);
  }
  if (portfolioData.portfolio_url) {
    formData.append("portfolio_url", portfolioData.portfolio_url);
  }

  // 🚨 الـ Fix القاتل: بنشيك لو الفايل موجود وطوله أكبر من 0 فعلياً!
  // لو الـ file مبعوث undefined أو فاضي، مستحيل نعمله append جوه الـ FormData
  if (portfolioData.file && portfolioData.file.length > 0) {
    formData.append("file", portfolioData.file[0]);
  }

  // 2. إرسال الـ ريكويست للباك إند
  const response = await api.post("/ai/analyze-portfolio", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // إجبار المتصفح على صياغة Boundary نظيفة
    },
  });

  return response.data;
};
