import { useState } from "react";
import { useFreelancers } from "../features/freelancers/hooks/useFreelancers";
import FreelancerCard from "../features/freelancers/components/FreelancerCard";
import { Button, Input } from "../components";

export default function FreelancersList() {
  // حالة لحفظ مدخلات الفلتر
  const [filters, setFilters] = useState({
    skill: "",
    maxRate: "",
  });

  // حالة لحفظ الـ Query String النهائي اللي هيتبعت للـ API
  const [queryString, setQueryString] = useState("");

  const { data, isLoading, isError } = useFreelancers(queryString);
  const freelancers = data?.data?.freelancers || []; // افترضت إن الباك إند بيرجعها كده

  // دالة تطبيق الفلاتر
  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (filters.skill) {
      params.append("freelancerProfile.skills", filters.skill); // بناءً على الباك إند
    }
    if (filters.maxRate) {
      params.append("freelancerProfile.hourlyRate[lte]", filters.maxRate);
    }

    setQueryString(params.toString());
  };

  // دالة مسح الفلاتر
  const handleClearFilters = () => {
    setFilters({ skill: "", maxRate: "" });
    setQueryString("");
  };

  return (
    <div className="container mx-auto py-12 px-4 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-heading">المستقلون المتاحون</h1>
        <p className="text-slate-400 mt-2">
          ابحث عن أفضل المواهب لتنفيذ مشروعك القادم.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* شريط الفلاتر (Sidebar) */}
        <div className="w-full lg:w-1/4">
          <div className="bg-primary p-6 rounded-xl border border-slate-800 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">
              فلاتر البحث
            </h2>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-300">
                  المهارة (Skill)
                </label>
                <input
                  type="text"
                  placeholder="مثال: React"
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-secondary"
                  value={filters.skill}
                  onChange={(e) =>
                    setFilters({ ...filters, skill: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-300">
                  أقصى سعر للساعة ($)
                </label>
                <input
                  type="number"
                  placeholder="مثال: 20"
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-secondary"
                  value={filters.maxRate}
                  onChange={(e) =>
                    setFilters({ ...filters, maxRate: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="accent"
                  className="flex-1 py-2"
                  onClick={handleApplyFilters}
                >
                  تطبيق
                </Button>
                <Button
                  className="bg-slate-800 text-white flex-1 py-2"
                  onClick={handleClearFilters}
                >
                  مسح
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* شبكة المستقلين (Grid) */}
        <div className="w-full lg:w-3/4">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[40vh]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-secondary"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500 bg-primary rounded-xl border border-slate-800">
              حدث خطأ أثناء جلب البيانات.
            </div>
          ) : freelancers.length === 0 ? (
            <div className="text-center py-20 bg-primary rounded-xl border border-slate-800 text-slate-400">
              لا يوجد مستقلين يتطابقون مع بحثك حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {freelancers.map((freelancer) => (
                <FreelancerCard key={freelancer._id} freelancer={freelancer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
