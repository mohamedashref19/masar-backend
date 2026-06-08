import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";
import AuthProvider from "./features/auth/components/AuthProvider";
import Navbar from "./components/Navbar";

function App() {
  // 🗑️ شيلنا useAuthInit() خالص من هنا

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="min-h-screen bg-background text-slate-200 font-sans">
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
    </AuthProvider>
  );
}

export default App;
