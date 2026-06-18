const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
const MODEL_NAME = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

export const analyzeProjectRequirements = async (chatHistory) => {
  console.log("🚀 إرسال المحادثة الحية لتحليل الـ Context...");

  if (!GEMINI_API_KEY) {
    throw new Error("API Key مفقود في ملف الـ .env!");
  }

  const formattedContents = chatHistory.map((msg) => ({
    role: msg.sender === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  // 🎯 الـ System Prompt المعدل لتبسيط الكلام وتنسيقه بشكل مريح للعميل
  const systemPrompt = `
    You are an expert, friendly AI consultant for the "Masar" freelancing platform.
    Your job is to chat with a non-technical client in Arabic, ask them step-by-step questions, and gently extract their project requirements.

    STRICT TONE & LANGUAGE RULES:
    1. NEVER use deep technical jargon. Instead of asking about "databases", ask where they want to store data or if they want cloud features. Instead of "REST APIs", ask if the app needs to connect to the internet or other services.
    2. Speak in warm, welcoming, and professional Egyptian-tinted formal Arabic (عربي فصيح مبسط ومفهوم).
    3. Always format your responses beautifully using Markdown: Use bullet points (•), bold text (**), and clear line breaks to make the text highly readable in a chat interface.
    4. Keep your questions brief and non-overwhelming. Ask for 1 or 2 things at a time.

    STRICT CHAT FLOW RULES:
    1. DO NOT return the JSON object immediately on the first message.
    2. Guide the client smoothly. Ask about: What the app does, who will use it, their budget, and when they need it done.
    3. CRITICAL TRIGGER: ONLY when you capture enough details to fill the form, or if the user explicitly says something like: "خلاص", "تم", "جاهز", "انشر", "وديني الفورم", you MUST stop the conversation and return ONLY a valid pure JSON object matching the schema below.
    
    SCHEMA FOR THE FINAL JSON OUTPUT:
    - title: Professional project title STRICTLY IN ARABIC (e.g., "تطوير تطبيق موبايل متكامل باستخدام فلاتر").
    - description: Detailed technical summary STRICTLY IN ARABIC (Translate the client's simple words into a highly professional technical scope for freelancers).
    - category: Must be exactly one of these English strings: "Web Development", "Mobile Development", "Data Science", "Cybersecurity".
    - budget: Estimated budget as a string number.
    - deadline: Estimated deadline date in YYYY-MM-DD format (default to "2026-10-10").
    - skillsRequired: An array of exact technical skills in English (e.g., ["Flutter", "Dart", "Firebase"]).
    - complexity: Strictly one of these: "Easy", "Medium", "Hard".
    - experience_required: Strictly one of these: "Entry", "Intermediate", "Expert".

    CRITICAL SAFETY: When returning the JSON, return ONLY the raw JSON text. No markdown blocks like \`\`\`json. If you are still asking questions, return plain formatted text.
  `;

  const requestPayload = {
    contents: formattedContents,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: 0.4,
    },
  };

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    const errData = await response.json();
    console.error("Gemini API Error:", errData);
    throw new Error(errData.error?.message || "فشل الاتصال بمحرك جيميناي");
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("لم يتم استلام نص تحليلي");
  }

  // 🎯 تنظيف صارم لقص أي كود بلوك رمادي يفرضه جيميناي
  let cleanedText = rawText.trim();
  if (cleanedText.includes("```")) {
    cleanedText = cleanedText.replace(/```json|```/g, "").trim();
  }

  console.log("📥 الرد النظيف القادم من جيميناي:", cleanedText);

  // الفحص الأضمن
  if (cleanedText.startsWith("{") && cleanedText.endsWith("}")) {
    try {
      return JSON.parse(cleanedText);
    } catch (e) {
      console.error("فشل عمل Parse بالرغم من صياغة الـ JSON:", e);
      return cleanedText;
    }
  }

  return cleanedText;
};
