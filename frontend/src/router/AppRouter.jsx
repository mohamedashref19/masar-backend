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
  FreelancersList,
  FreelancerProfile,
  FreelancerSettings,
  ClientSettings,
  EditProject,
  Inbox,
  PaymentSuccessRedirect,
  SmartChatPage,
} from "../pages";
import ChangePassword from "../features/settings/components/ChangePassword";
import ProtectedRoute from "../features/auth/components/guards/ProtectedRoute";
import GuestRoute from "../features/auth/components/guards/GuestRoute";
import ForgotPassword from "../features/auth/components/ForgotPassword";

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
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Route>

    {/* المسارات المحمية */}
    <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<h1>صفحة الملف الشخصي</h1>} />
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/inbox" element={<Inbox />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/freelancers" element={<FreelancersList />} />
      <Route path="/freelancers/:id" element={<FreelancerProfile />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Route>

    {/* مسارات الأدوار */}
    <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
      <Route path="/client-dashboard" element={<ClientDashboard />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/client-settings" element={<ClientSettings />} />
      <Route path="/projects/edit/:id" element={<EditProject />} />{" "}
      <Route path="/payment-success" element={<PaymentSuccessRedirect />} />
      <Route path="/ai-assistant" element={<SmartChatPage />} />
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["freelancer"]} />}>
      <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
      <Route path="/freelancer-settings" element={<FreelancerSettings />} />
    </Route>
  </Routes>
);

export default AppRouter;
