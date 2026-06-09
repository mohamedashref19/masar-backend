import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProjects } from "../features/projects/services/projectsApi";
import { getFreelancers } from "../features/freelancers/services/freelancersApi";
import { useQuery } from "@tanstack/react-query";

// 🎯 استيراد الـ Widget الذكي للشات بوت الخاص بالكلاينت
import SmartChatWidget from "../features/chatbot/components/SmartChatWidget";

const stats = [
  { label: "مشاريع نشطة", value: "2.4K+" },
  { label: "مستقلون موثّقون", value: "8.7K+" },
  { label: "إجمالي المدفوعات", value: "$12.3M" },
];

const trustSignals = [
  {
    title: "مدفوعات آمنة",
    description: "دفعات بضمان وسيط وبشفافية كاملة.",
  },
  {
    title: "دعم 24/7",
    description: "دعم مستمر للعملاء والمستقلين على مدار الساعة.",
  },
  {
    title: "ملفات موثّقة",
    description: "كل مستقل يتم التحقق منه بواسطة خبراء مسار.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Home = () => {
  const { user, isInitializing } = useSelector((state) => state.auth || {});
  const role = user?.role?.toLowerCase();
  const isClient = role === "client";
  const isFreelancer = role === "freelancer";

  // جلب المشاريع (مفعلة فقط لغير الكلاينتس)
  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useQuery({
    queryKey: ["projects", "latest-home"],
    queryFn: () => getAllProjects(""),
    staleTime: 60 * 1000,
    enabled: !isClient,
  });

  const allProjects = projectsData?.data?.projects || projectsData?.data || [];
  const latestProjects = allProjects.slice(0, 4);

  // جلب المستقلين (مفعلة فقط لغير الفريلانسرز)
  const {
    data: freelancersData,
    isLoading: isFreelancersLoading,
    isError: isFreelancersError,
  } = useQuery({
    queryKey: ["freelancers", "latest-home"],
    queryFn: () => getFreelancers(""),
    staleTime: 60 * 1000,
    enabled: !isFreelancer,
  });

  const allFreelancers =
    freelancersData?.data?.freelancers || freelancersData?.data || [];
  const topFreelancers = allFreelancers.slice(0, 4);

  const heroTitle = isClient
    ? "استقطب أفضل المواهب بسرعة."
    : isFreelancer
      ? "اعثر على فرصتك الكبيرة القادمة."
      : "مرحباً بك في مسار — منصة المواهب الاحترافية.";

  const heroSubtitle = isClient
    ? "كوّن فريق أحلامك من أفضل المستقلين الموثوقين عبر مساعد مسار الذكي."
    : isFreelancer
      ? "اكتشف مشاريع عالية القيمة وطوّر مسيرتك الحرة."
      : "انضم كمستقل أو وظّف مواهب نخبوية لتوسيع عملك.";

  const primaryCta = isClient
    ? { label: "غرفة التحليل الذكي 🤖", to: "/ai-assistant" }
    : isFreelancer
      ? { label: "تصفح المشاريع 🚀", to: "/projects" }
      : { label: "انضم كمستقل", to: "/register?role=freelancer" };

  const secondaryCta = !user && {
    label: "وظّف موهبة",
    to: "/register?role=client",
  };

  const feedTitle = isClient
    ? "أفضل المستقلين تقييماً"
    : isFreelancer
      ? "أحدث المشاريع"
      : "مشاريع متاحة الآن";

  const feedItems = isClient ? topFreelancers : latestProjects;

  if (isInitializing) {
    return (
      <main className="min-h-screen bg-background text-heading flex items-center justify-center font-[Outfit]">
        <div className="animate-pulse text-body">جارٍ تجهيز تجربة مسار...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-heading font-[Outfit]">
      {/* تأثيرات الإضاءة الخلفية للـ Dark/Glassmorphism Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-secondary/10 blur-[120px]" />
        <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-accent/10 blur-[140px]" />
      </div>

      {/* 🎯 حقن الـ Smart Chat Widget العائم (هو بداخل لوجيكس بيشيك لو كود اليوزر client هيظهر غير كدة هيختفي تلقائياً) */}
      <SmartChatWidget />

      {/* Hero Section */}
      <motion.section
        className="relative pt-28 pb-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={itemVariants}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 md:p-14 shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
          >
            <p className="uppercase tracking-[0.3em] text-xs text-secondary/80 mb-4">
              شبكة مواهب مسار الذكية
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-heading leading-tight">
              {heroTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-body">{heroSubtitle}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={primaryCta.to}
                className="inline-flex items-center justify-center rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:shadow-lg hover:shadow-secondary/30 hover:scale-[1.02]"
              >
                {primaryCta.label}
              </Link>
              {secondaryCta && (
                <Link
                  to={secondaryCta.to}
                  className="inline-flex items-center justify-center rounded-md border border-accent px-6 py-3 text-sm font-semibold text-accent transition-all hover:bg-accent/10"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="relative pb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={itemVariants}
            className="grid gap-6 md:grid-cols-3"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-8 text-center transition-all hover:-translate-y-1 hover:border-secondary/60"
              >
                <p className="text-3xl font-semibold text-heading">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-body">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Dynamic Feed Section (المستقلين للكلاينت / المشاريع للفريلانسر) */}
      <motion.section
        className="relative pb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-secondary/80">
              توصيات مخصصة بحسابك
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-heading">
              {feedTitle}
            </h2>
            <p className="mt-2 text-body max-w-2xl">
              {isClient
                ? "نخبة من المستقلين في تكنولوجيا المعلومات ومطوري البرمجيات المتاحين للتوظيف الفوري."
                : isFreelancer
                  ? "فرص جديدة مختارة بعناية لتناسب مهاراتك التقنية الحالية."
                  : "استكشف فرصاً مميزة ومحترفين موثوقين في مجالات تطوير الويب والتطبيقات."}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid gap-6 md:grid-cols-2"
          >
            {isProjectsLoading || isFreelancersLoading ? (
              <div className="col-span-full text-center text-body animate-pulse py-8">
                جاري جلب أحدث بيانات منصة مسار...
              </div>
            ) : isProjectsError || isFreelancersError ? (
              <div className="col-span-full text-center text-red-500 py-8">
                حدث خطأ أثناء تحميل التوصيات المخصصة. يرجى المحاولة لاحقاً.
              </div>
            ) : (
              feedItems.map((item) => (
                <div
                  key={isClient ? item.name : item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all hover:-translate-y-1 hover:border-secondary/60"
                >
                  {isClient ? (
                    <>
                      <p className="text-xl font-semibold text-heading">
                        {item.name}
                      </p>
                      <p className="mt-1 text-body text-sm text-slate-400">
                        {item.role || "Frontend Developer"}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-sm text-body">
                        <span className="text-accent font-semibold bg-accent/10 px-3 py-1 rounded-md border border-accent/20">
                          {item.rate || "$45 / hr"}
                        </span>
                      </div>
                      <Link
                        to={`/freelancers/${item._id}`}
                        className="mt-4 inline-flex text-sm font-semibold text-secondary hover:text-accent transition-colors"
                      >
                        عرض ملف المستقل التقني ←
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-semibold text-heading">
                        {item.title}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-body">
                        <span className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-0.5 rounded-md font-medium">
                          الميزانية: {item.budget} $
                        </span>
                      </div>
                      <Link
                        to={`/projects/${item._id}`}
                        className="mt-4 inline-flex text-sm font-semibold text-secondary hover:text-accent transition-colors"
                      >
                        عرض تفاصيل المشروع الكاملة ←
                      </Link>
                    </>
                  )}
                </div>
              ))
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Trust & Escrow Signals */}
      <motion.section
        className="relative pb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-secondary/80">
              الثقة والأمان المالي
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-heading">
              اعمل بثقة وأمان كامل على منصة مسار
            </h2>
            <p className="mt-2 text-body max-w-2xl">
              بيئة عمل تقنية آمنة تدعم الـ Escrow ونظام الـ Split payments لضمان
              الشفافية.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid gap-6 md:grid-cols-3"
          >
            {trustSignals.map((signal) => (
              <div
                key={signal.title}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all hover:-translate-y-1 hover:border-accent/60"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                  <span className="text-lg font-semibold">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-heading">
                  {signal.title}
                </h3>
                <p className="mt-2 text-sm text-body text-slate-400">
                  {signal.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
};

export default Home;
