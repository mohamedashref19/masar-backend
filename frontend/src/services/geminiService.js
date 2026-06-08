// services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. استخدم متغيرات البيئة (تأكد من وجود VITE_GEMINI_API_KEY في ملف .env)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeProject = async (projectData) => {
  // 2. استخدام الموديل الرسمي والمستقر
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `
    أنت مهندس برمجيات خبير. قم بتحليل تفاصيل المشروع التالي:
    العنوان: ${projectData.title}
    الوصف: ${projectData.description}
    
    استخرج 3 خصائص فقط باللغة الإنجليزية:
    1. complexity: (Low, Medium, or High)
    2. required_skills: (Array of strings)
    3. experience_required: (Junior, Mid-level, or Senior)

    أجب بتنسيق JSON فقط. لا تكتب أي مقدمات أو نصوص إضافية.
    مثال: {"complexity": "Medium", "required_skills": ["React", "Node.js"], "experience_required": "Mid-level"}
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 3. تنظيف الـ Markdown (إزالة ```json و ```)
    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Analysis Failed:", error);
  }
};
