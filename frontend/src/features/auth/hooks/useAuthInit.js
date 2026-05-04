import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "../services/authApi";
import { setCredentials, logout, setInitialized } from "../store/authSlice";

export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getMe();
        dispatch(setCredentials({ user: data.user, token: "is_logged_in" }));
      } catch (err) {
        dispatch(setInitialized()); // تأكد إنك ضفت الأكشن ده في الـ Slice
      }
    };
    checkAuth();
  }, [dispatch]);
};
