import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function GuestRoute() {
  // بنقرأ التوكن من الـ Redux عشان نعرف هو مسجل ولا لأ
  const token = useSelector((state) => state.auth.token);

  // لو معاه توكن (يعني مسجل دخول)، اطردة للرئيسية.
  // لو مش معاه، خليه يعدي (Outlet بترندر الصفحة اللي جوه الراوت)
  return token ? <Navigate to="/" replace /> : <Outlet />;
}
