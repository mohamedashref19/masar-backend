import api from "../../../services/api";

export const getMe = async () => {
  // الريكويست ده هيبعت الكوكيز أوتوماتيك بفضل withCredentials
  const response = await api.get("/users/me");
  console.log(response.data);
  return response.data;
};
// 1. دالة التسجيل
export const signupUser = async (userData) => {
  const response = await api.post("/users/signup", userData);
  return response.data;
};

// 2. دالة التحقق من الـ OTP (تأكد إن كلمة export موجودة)
export const verifyOTP = async (data) => {
  const response = await api.post("/users/verifyOTP", data);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);

  // 🛡️ حماية إضافية: لو الباك إند رجع 200 بس الداتا بتقول إن فيه خطأ
  if (response.data?.status === "fail" || response.data?.success === false) {
    // السطر ده هيوقف الريكويست ويحدفه فوراً للـ onError
    throw { response: { data: response.data } };
  }

  return response.data;
};

export const resendOTP = async (data) => {
  // data هنا هتبقى عبارة عن الأوبجيكت اللي فيه الإيميل { email }
  const response = await api.post("/users/resendOTP", data);
  return response.data;
};
