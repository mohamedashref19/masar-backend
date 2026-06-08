import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isInitializing } = useSelector((state) => state.auth);
  const location = useLocation();

  // 🎯 السطر ده هو "الفرامل": لو لسه بنحمل بيانات اليوزر، ما تعملش Redirect أبداً
  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-secondary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
