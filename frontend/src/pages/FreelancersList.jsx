import { useState } from "react";
import { useFreelancers } from "../features/freelancers/hooks/useFreelancers";
import FreelancerCard from "../features/freelancers/components/FreelancerCard";
import { Button } from "../components";
import {
  FiSearch,
  FiSliders,
  FiDollarSign,
  FiAward,
  FiBookOpen,
} from "react-icons/fi";

export default function FreelancersList() {
  // 🎯 الفلاتر مطابقة تماماً لمسميات الـ API Features في الباك إند
  const [filters, setFilters] = useState({
    skills: "",
    title: "",
    experienceLevel: "",
    hourlyRate: "",
  });

  const [queryString, setQueryString] = useState("");

  const { data, isLoading, isError } = useFreelancers(queryString);
  const freelancers = data?.data?.freelancers || data?.freelancers || [];

  // ⚙️ دالة بناء الـ Query String وإرسالها للسيرفر ديناميكياً
  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (filters.skills) params.append("skills", filters.skills);
    if (filters.title) params.append("title", filters.title);
    if (filters.experienceLevel)
      params.append("experienceLevel", filters.experienceLevel);
    if (filters.hourlyRate) params.append("hourlyRate", filters.hourlyRate);

    setQueryString(params.toString());
  };

  const handleClearFilters = () => {
    setFilters({ skills: "", title: "", experienceLevel: "", hourlyRate: "" });
    setQueryString("");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#080B10] text-slate-100 py-12 px-4 mt-16 max-w-7xl mx-auto text-right selection:bg-secondary/30"
    >
      {/* الهيدر الفخم */}
      <div className="mb-12 border-b border-white/[0.05] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">
            منظومة فرز النخبة التقنية
          </span>
          <h1 className="text-3xl font-black text-white mt-1">
            المستقلون المتاحون
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            ابحث وافحص السير الذاتية لأفضل الكوادر المفحوصة بالذكاء الاصطناعي.
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-xl">
          نتائج البحث:{" "}
          <span className="text-secondary font-bold">
            {freelancers.length} مستقل
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* 🌟 شريط الفلاتر الجانبي (Premium Bento Sidebar) */}
        <aside className="bg-[#0D121A] border border-white/[0.05] p-6 rounded-2xl shadow-xl space-y-5 sticky top-24">
          <div className="flex items-center gap-2 border-b border-white/[0.05] pb-3 text-white font-bold text-sm">
            <FiSliders className="text-secondary" />
            <span>تصفية الكوادر</span>
          </div>

          {/* 1. التخصص الوظيفي */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FiAward /> التخصص المهني
            </label>
            <input
              type="text"
              placeholder="مثال: Frontend"
              className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary p-3 rounded-xl text-xs text-white focus:outline-none transition-colors text-right"
              value={filters.title}
              onChange={(e) =>
                setFilters({ ...filters, title: e.target.value })
              }
            />
          </div>

          {/* 2. البحث بالمهارات */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FiBookOpen /> المهارة المطلوبة
            </label>
            <input
              type="text"
              placeholder="مثال: React, Node.js"
              className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary p-3 rounded-xl text-xs text-white focus:outline-none transition-colors text-right"
              value={filters.skills}
              onChange={(e) =>
                setFilters({ ...filters, skills: e.target.value })
              }
            />
          </div>

          {/* 3. مستوى الخبرة */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FiSliders /> مستوى الخبرة
            </label>
            <select
              value={filters.experienceLevel}
              onChange={(e) =>
                setFilters({ ...filters, experienceLevel: e.target.value })
              }
              className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary p-3 rounded-xl text-xs text-white cursor-pointer focus:outline-none"
            >
              <option value="">كل المستويات</option>
              <option value="beginner">مبتدئ (Beginner)</option>
              <option value="intermediate">متوسط (Intermediate)</option>
              <option value="expert">خبير (Expert)</option>
            </select>
          </div>

          {/* 4. تكلفة الساعة التقديرية */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FiDollarSign /> أقصى سعر للساعة ($)
            </label>
            <input
              type="number"
              placeholder="مثال: 50"
              className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary p-3 rounded-xl text-xs text-slate-200 focus:outline-none transition-colors text-left"
              dir="ltr"
              value={filters.hourlyRate}
              onChange={(e) =>
                setFilters({ ...filters, hourlyRate: e.target.value })
              }
            />
          </div>

          {/* أزرار التحكم */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="accent"
              className="w-full py-2.5 font-bold text-xs rounded-xl text-slate-950 shadow-md shadow-secondary/5"
              onClick={handleApplyFilters}
            >
              تطبيق الفلترة الذكية
            </Button>
            <button
              className="w-full bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] text-slate-400 hover:text-white transition-colors py-2.5 rounded-xl text-xs font-medium"
              onClick={handleClearFilters}
            >
              إعادة تعيين 🔄
            </button>
          </div>
        </aside>

        {/* شبكة عرض المستقلين */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center min-h-[40vh] gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-secondary"></div>
              <span className="text-xs text-slate-500">
                جاري سحب بروفايلات النخبة التقنية...
              </span>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-400 bg-[#0D121A] rounded-2xl border border-white/[0.05] text-sm">
              ⚠️ عطل مؤقت في مزامنة الداتا مع خادم مسار الرئيسي.
            </div>
          ) : freelancers.length === 0 ? (
            <div className="text-center py-24 bg-gradient-to-b from-white/[0.01] to-transparent rounded-2xl border border-dashed border-white/10 text-slate-400 text-sm">
              🔍 لم نجد أي مستقل يطابق معايير البحث الحالية حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {freelancers.map(
                (freelancer) =>
                  !freelancer.freelancerProfile.isSpam && (
                    <FreelancerCard
                      key={freelancer._id}
                      freelancer={freelancer}
                    />
                  ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
