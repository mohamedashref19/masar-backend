import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowedRoles }) {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation(); // عشان نعرف هو كان بيحاول يفتح صفحة إيه

  // 1. التحقق الأول: هل هو مسجل دخول أصلاً؟
  if (!token) {
    // بنبعت الـ location في الـ state عشان بعد ما يعمل Login نرجعه لنفس الصفحة اللي كان عاوزها
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. التحقق الثاني (اختياري): هل معاه الصلاحية للصفحة دي؟
  // لو مررنا allowedRoles للصفحة، والـ Role بتاع اليوزر مش جواها، نطرده.
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />; // أو ممكن ترجعه للرئيسية
  }

  // 3. لو عدى من كل ده، افتحله الباب
  return <Outlet />;
}
