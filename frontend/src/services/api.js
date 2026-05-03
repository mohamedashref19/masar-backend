// src/services/api.js
import axios from "axios";

const api = axios.create({
  // هيسحب الرابط من ملف الـ .env اللي عملناه
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // السطر ده في قمة الأهمية!
  // الباك إند بتاعكم بيستخدم Cookies عشان يحفظ الـ JWT Token،
  // لو السطر ده مش موجود، المتصفح هيرفض يحفظ الكوكي والمستخدم مش هيعرف يعمل Login.
  withCredentials: true,
});

export default api;
