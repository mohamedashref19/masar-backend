import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const GuestRoute = () => {
  // 1. هنسحب التوكن واليوزر من الريدكس
  const { token, user, isInitializing } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }
  // 2. لو المستخدم مسجل دخوله (معاه توكن)
  if (token && user) {
    // نوديه فين؟
    // لو كان رايح لصفحة معينة ورجعوه للوجين، نرجعه لمكانه، لو مفيش نوديه للرئيسية
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  // 3. لو مش مسجل دخوله، نخليه يكمل عادي لصفحة الـ Login أو Register
  return <Outlet />;
};

export default GuestRoute;
