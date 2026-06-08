import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css"; // أو ملف الاستايل بتاعك

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 🎯 يمنع الريكويستات التلقائية لما تسيب الصفحة وترجع لها
      refetchOnWindowFocus: false,
      // 🎯 يمنع الريكويستات لما النت يقطع ويرجع
      refetchOnReconnect: false,
      // 🎯 يخلي الداتا تعتبر "جديدة" لمدة دقيقة، فما يبعتش ريكويست لو اتنقلت ورجعت بسرعة
      staleTime: 60 * 1000,
      // 🎯 عدد مرات محاولة إعادة الريكويست لو فشل (خليها 1 بدل 3 عشان ما نستهلكش ليميت)
      retry: 1,
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
