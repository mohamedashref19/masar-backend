import { Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Register,
  ProjectsList,
  ClientDashboard,
  FreelancerDashboard,
  NotFound,
  VerifyOTP,
  PostJob,
  ProjectDetails,
} from "../pages";
import ProtectedRoute from "../features/auth/components/guards/ProtectedRoute";
import GuestRoute from "../features/auth/components/guards/GuestRoute";

const AppRouter = () => (
  <Routes>
    {/* الصفحات العامة */}
    <Route path="/" element={<Home />} />
    <Route path="/unauthorized" element={<h1>عفواً، لا تملك صلاحية</h1>} />
    <Route path="*" element={<NotFound />} />

    {/* مسارات الزوار */}
    <Route element={<GuestRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
    </Route>

    {/* المسارات المحمية */}
    <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<h1>صفحة الملف الشخصي</h1>} />
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
    </Route>

    {/* مسارات الأدوار */}
    <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
      <Route path="/client-dashboard" element={<ClientDashboard />} />
      <Route path="/post-job" element={<PostJob />} />
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["freelancer"]} />}>
      <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
    </Route>
  </Routes>
);

export default AppRouter;
