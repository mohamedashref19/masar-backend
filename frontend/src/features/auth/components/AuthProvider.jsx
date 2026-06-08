import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, setInitialized, logout } from "../store/authSlice";
import api from "../../../services/api";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  // 🎯 عملنا State داخلية هنا هي "المتحكمة" في ظهور التطبيق
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/users/me");

        const user =
          response.data?.data?.user ||
          response.data?.data?.data ||
          response.data?.data?.doc ||
          response.data?.user;

        if (user) {
          dispatch(
            setCredentials({ user, token: response.data?.token || null }),
          );
        } else {
          dispatch(setInitialized());
        }
      } catch (error) {
        dispatch(logout());
        dispatch(setInitialized());
      } finally {
        // 🎯 السطر ده أهم سطر: بعد ما الريكويست ينجح أو يفشل، افتح الباب للتطبيق
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  // 🧱 حيطة سد: طول ما الـ API لسه بيرد، هنعرض شاشة تحميل، والراوتر مش هيشتغل فمحدش هيطردك!
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // أول ما الـ isLoading تبقى false، التطبيق هيفتح واليوزر هيكون جاهز في الريدكس
  return children;
};

export default AuthProvider;
