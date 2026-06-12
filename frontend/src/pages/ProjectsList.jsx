import { useState, useMemo } from "react";
import { useProjectsListLogic } from "../features/projects/hooks/useProjectsListLogic";
import ProjectCard from "../features/projects/components/ProjectCard";
import {
  FiSearch,
  FiSliders,
  FiDollarSign,
  FiLayers,
  FiFolder,
} from "react-icons/fi";

export default function ProjectsList() {
  const { projects, isLoading, isError, errorMessage } = useProjectsListLogic();

  // 🎯 States الخاصة بالفلاتر المتعددة (شغالة فرونت إند 100%)
  const [searchTerm, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedComplexity, setSelectedComplexity] = useState("all");
  const [maxBudget, setMaxBudget] = useState(10000);

  // استخراج قائمة المشاريع الخام بأمان
  const rawProjects = projects?.projects || [];

  // 🧠 لوجيك الفلترة المتعددة الذكي باستخدام useMemo لثبات الأداء ومنع الـ Lag
  const filteredProjects = useMemo(() => {
    return rawProjects.filter((project) => {
      const matchesSearch =
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || project.category === selectedCategory;

      const matchesComplexity =
        selectedComplexity === "all" ||
        project.complexity === selectedComplexity;

      const matchesBudget = Number(project.budget || 0) <= maxBudget;

      return (
        matchesSearch && matchesCategory && matchesComplexity && matchesBudget
      );
    });
  }, [
    rawProjects,
    searchTerm,
    selectedCategory,
    selectedComplexity,
    maxBudget,
  ]);

  // استخراج الأقسام المتاحة ديناميكياً لتغذية الفلتر تلقائياً
  const categories = useMemo(() => {
    const list = rawProjects.map((p) => p.category).filter(Boolean);
    return ["all", ...new Set(list)];
  }, [rawProjects]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
        <span className="text-xs text-slate-500 font-medium">
          جاري مزامنة قنوات المشاريع التقنية...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#080B10] text-red-400 text-sm">
        <p>⚠️ خطأ في المزامنة: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#080B10] text-slate-100 py-12 px-4 mt-16 max-w-7xl mx-auto text-right"
    >
      {/* هيدر الشاشة الفخم */}
      <div className="mb-12 border-b border-white/[0.05] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">
            منظومة العروض المفتوحة
          </span>
          <h1 className="text-3xl font-black text-white mt-1">
            تصفح المشاريع المتاحة
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            اكتشف أحدث مشاريع الشركات واقنص فرصتك التالية بالـ AI.
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-xl">
          إجمالي المشاريع المتاحة تصفيةً:{" "}
          <span className="text-secondary font-bold">
            {filteredProjects.length} مشروع
          </span>
        </div>
      </div>

      {/* الهيكل الأساسي: فلاتر جانبية + لستة المشاريع */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* 🌟 لوحة الفلاتر المتعددة الجانبية (Premium Control Sidebar) */}
        <aside className="bg-[#0D121A] border border-white/[0.05] p-6 rounded-2xl shadow-xl space-y-6 sticky top-24">
          <div className="flex items-center gap-2 border-b border-white/[0.05] pb-3 text-white font-bold text-sm">
            <FiSliders className="text-secondary" />
            <span>فلترة متقدمة (لوكال)</span>
          </div>

          {/* 1. حقل البحث النصي اللحظي */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FiSearch /> ابحث بالكلمة
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="اكتب عنواناً أو مهارة..."
                className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary p-3 pl-10 rounded-xl text-xs text-white focus:outline-none transition-colors"
              />
              <FiSearch
                className="absolute left-3 top-3.5 text-slate-600"
                size={16}
              />
            </div>
          </div>

          {/* 2. فلتر الأقسام الديناميكي */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FiFolder /> القسم
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary p-3 rounded-xl text-xs text-white cursor-pointer focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "كل الأقسام" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* 3. فلتر مستوى التعقيد فنيًا */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FiLayers /> تعقيد البنية
            </label>
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary p-3 rounded-xl text-xs text-white cursor-pointer focus:outline-none"
            >
              <option value="all">كل المستويات</option>
              <option value="Flexible">مرن / بسيط</option>
              <option value="Medium">متوسط التعقيد</option>
              <option value="High">متقدم جداً</option>
            </select>
          </div>

          {/* 4. فلتر النطاق السعري الحركي */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <FiDollarSign /> الميزانية القصوى
              </span>
              <span className="text-secondary font-bold" dir="ltr">
                ${maxBudget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-secondary bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div
              className="flex justify-between text-[10px] text-slate-600 font-bold"
              dir="ltr"
            >
              <span>$10k</span>
              <span>$100</span>
            </div>
          </div>

          {/* زر تصفير الفلاتر السريع */}
          <button
            onClick={() => {
              setSearchText("");
              setSelectedCategory("all");
              setSelectedComplexity("all");
              setMaxBudget(10000);
            }}
            className="w-full bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors py-2.5 rounded-xl text-xs font-medium"
          >
            تصفير الفلاتر الفوري 🔄
          </button>
        </aside>

        {/* لستة المشاريع المفلترة */}
        <div className="lg:col-span-3">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-24 bg-gradient-to-b from-white/[0.01] to-transparent rounded-2xl border border-dashed border-white/10">
              <span className="text-4xl">🔍</span>
              <p className="text-slate-400 text-sm mt-4">
                لم نجد أي مشاريع تطابق خيارات الفلترة الحالية.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
