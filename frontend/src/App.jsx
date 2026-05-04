import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";
import { useAuthInit } from "./features/auth/hooks/useAuthInit";

function App() {
  // تفعيل منطق التحقق من التوكن عند البداية
  useAuthInit();

  return (
    <Router>
      <div className="min-h-screen bg-background text-slate-200 font-sans">
        {/* مكان الـ Navbar المستقبلي */}

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

        <AppRouter />
      </div>
    </Router>
  );
}

export default App;
