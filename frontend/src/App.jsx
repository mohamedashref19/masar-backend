import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// استيراد الصفحات
import {
  Home,
  Login,
  Register,
  ProjectsList,
  ClientDashboard,
  FreelancerDashboard,
  NotFound,
  VerifyOTP,
} from "./pages";
// استيراد Redux
import { Provider } from "react-redux";
import { store } from "./store/index";
// استيراد React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// استيراد الحراس
import ProtectedRoute from "./features/auth/components/guards/ProtectedRoute";
import GuestRoute from "./features/auth/components/guards/GuestRoute";

const queryClient = new QueryClient();
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-background text-slate-200 font-sans">
            {/* ملاحظة: لاحقاً هنضيف الـ Navbar هنا عشان يظهر في كل الصفحات */}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#0F172A",
                  color: "#F1F5F9",
                  border: "1px solid #22C55E",
                },
              }}
            />
            <Routes>
              {/* ========================================== */}
              {/* 1. الصفحات العامة (أي حد يقدر يشوفها) */}
              {/* ========================================== */}
              <Route path="/" element={<Home />} />
              <Route
                path="/unauthorized"
                element={<h1>عفواً، لا تملك صلاحية للوصول لهذه الصفحة</h1>}
              />
              <Route path="*" element={<NotFound />} />
              {/* ========================================== */}
              {/* 2. مسارات الزوار فقط (Guest Routes) */}
              {/* ========================================== */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
              </Route>

              {/* ========================================== */}
              {/* 3. المسارات المحمية العادية (أي مستخدم مسجل) */}
              {/* ========================================== */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<h1>صفحة الملف الشخصي</h1>} />
                <Route path="/settings" element={<h1>الإعدادات</h1>} />
                <Route path="/projects" element={<ProjectsList />} />
              </Route>

              {/* ========================================== */}
              {/* 4. مسارات مخصصة بالصلاحيات (Role-Based) */}
              {/* ========================================== */}

              {/* للعملاء فقط */}
              <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/post-job" element={<h1>إضافة مشروع جديد</h1>} />
              </Route>

              {/* للمستقلين فقط */}
              <Route element={<ProtectedRoute allowedRoles={["freelancer"]} />}>
                <Route
                  path="/freelancer-dashboard"
                  element={<FreelancerDashboard />}
                />
                <Route path="/my-proposals" element={<h1>عروضي</h1>} />
              </Route>
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
