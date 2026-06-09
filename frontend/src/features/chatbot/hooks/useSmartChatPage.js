import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { analyzeProjectRequirements } from "../../../services/chatbotApi";
import toast from "react-hot-toast";

export const useSmartChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMessageSent = useRef(false);
  const messagesEndRef = useRef(null);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  // 🎯 تخزين آخر رسالة فشل إرسالها لتمكين زر الـ Retry
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "مرحباً بك في غرفة التخطيط الذكي! 🚀 جاري تحليل فكرتك الأولى لتهيئة متطلبات المشروع...",
    },
  ]);

  const handleAIOutput = (aiResponse) => {
    if (
      typeof aiResponse === "object" &&
      aiResponse !== null &&
      aiResponse.title
    ) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `🎯 ممتاز! قمت بجمع واستخراج كامل Schema المشروع لـ (${aiResponse.title}) بنجاح. اضغط على الزر أدناه لمراجعة الفورم المجهزة ونشرها.`,
        },
      ]);
      setExtractedData(aiResponse);
      setIsDataReady(true);
    } else {
      setMessages((prev) => [...prev, { sender: "bot", text: aiResponse }]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userText = inputText;
    const userMsg = { sender: "user", text: userText };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInputText("");
    setIsTyping(true);
    setLastFailedMessage(null); // تصفير الفشل السابق

    try {
      const aiResponse = await analyzeProjectRequirements(updatedMessages);
      setIsTyping(false);
      handleAIOutput(aiResponse);
    } catch (error) {
      setIsTyping(false);
      setLastFailedMessage(userText); // 🎯 حفظ النص هنا لو ضرب
      toast.error("حدث خطأ في معالجة البيانات. يمكنك إعادة المحاولة.");
    }
  };

  // 🎯 دالة إعادة المحاولة السحرية
  const handleRetry = async () => {
    if (!lastFailedMessage || isTyping) return;

    const userText = lastFailedMessage;
    setIsTyping(true);
    setLastFailedMessage(null); // إخفاء الزرار مؤقتاً أثناء المحاولة الجديدة

    try {
      const aiResponse = await analyzeProjectRequirements([...messages]);
      setIsTyping(false);
      handleAIOutput(aiResponse);
    } catch (error) {
      setIsTyping(false);
      setLastFailedMessage(userText); // إعادة تمكين الزرار لو فشل تاني
      toast.error("فشلت المحاولة مجدداً، تحقق من اتصال الإنترنت.");
    }
  };

  const triggerFirstAIResponse = async (userText) => {
    const userMsg = { sender: "user", text: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const aiResponse = await analyzeProjectRequirements(updatedMessages);
      setIsTyping(false);
      handleAIOutput(aiResponse);
    } catch (error) {
      setIsTyping(false);
      setLastFailedMessage(userText); // 🎯 حفظ رسالة الهوم بيج لو أول دخلة ضربت نت
      toast.error("فشل الاتصال بمحرك Gemini");
    }
  };

  useEffect(() => {
    const firstMsgText = location.state?.firstMessage;
    if (firstMsgText && !initialMessageSent.current) {
      initialMessageSent.current = true;
      triggerFirstAIResponse(firstMsgText);
    }
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleProceedToPost = () => {
    navigate("/post-job", { state: { prefilledProjectData: extractedData } });
  };

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    isDataReady,
    lastFailedMessage, // 🎯 تمريره للـ UI
    handleRetry, // 🎯 تمريرها للـ UI
    messagesEndRef,
    handleSendMessage,
    handleProceedToPost,
  };
};
