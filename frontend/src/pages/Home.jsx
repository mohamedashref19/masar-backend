import { useSelector } from "react-redux";
// src/pages/Home.jsx
export default function Home() {
  const { token, user } = useSelector((state) => state.auth);
  console.log("اليوزر في الصفحة الرئيسية:", token);
  return (
    <div className="flex items-center justify-center h-screen bg-background text-primary">
      <h1 className="text-4xl font-bold text-secondary">
        صفحة الرئيسية (Home)
      </h1>
    </div>
  );
}
