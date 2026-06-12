import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProjects } from "../features/projects/services/projectsApi";
import { getFreelancers } from "../features/freelancers/services/freelancersApi";
import { useQuery } from "@tanstack/react-query";

// 🎯 استيراد الـ Widget الذكي للشات بوت الخاص بالكلاينت
import SmartChatWidget from "../features/chatbot/components/SmartChatWidget";

const stats = [
  { label: "مشاريع نشطة وملبية", value: "+2.4K", gradient: "from-[#22C55E] to-[#10B981]", desc: "تم إطلاقها ومراقبتها كلياً بالـ AI" }, 
  { label: "مستقلون موثّقون فنيًا", value: "+8.7K", gradient: "from-[#00F5D4] to-[#00BBF9]", desc: "تجاوزوا فحص الـ CV ومكافحة السبام" },
  { label: "إجمالي الضمانات المالية", value: "$12.3M", gradient: "from-[#E4FF00] to-[#70E000]", desc: "مؤمنة عبر نظام الحساب الوسيط Escrow" },
];

const trustSignals = [
  {
    title: "مدفوعات آمنة وضمان وسيط",
    description: "نظام تعاقد مالي ذكي يحفظ حقوق الطرفين عبر الـ Split payments بكل شفافية.",
    icon: "💳"
  },
  {
    title: "مستشار فني على مدار الساعة",
    description: "دعم فني مدعوم بالذكاء الاصطناعي لحل النزاعات ومتابعة تسليم الـ Milestones.",
    icon: "⚡"
  },
  {
    title: "توثيق وفحص احترافي للملفات",
    description: "كل مستقل يمر عبر فلتر الـ AI لتوثيق المهارات الحقيقية واستبعاد الحسابات الوهمية.",
    icon: "🛡️"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, x: 10 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const Home = () => {
  const { user, isInitializing } = useSelector((state) => state.auth || {});
  const role = user?.role?.toLowerCase();
  const isClient = role === "client";
  const isFreelancer = role === "freelancer";

  const { data: projectsData, isLoading: isProjectsLoading, isError: isProjectsError } = useQuery({
    queryKey: ["projects", "latest-home"],
    queryFn: () => getAllProjects(""),
    staleTime: 60 * 1000,
    enabled: !isClient,
  });

  const allProjects = projectsData?.data?.projects || projectsData?.data || [];
  const latestProjects = allProjects.slice(0, 4);

  const { data: freelancersData, isLoading: isFreelancersLoading, isError: isFreelancersError } = useQuery({
    queryKey: ["freelancers", "latest-home"],
    queryFn: () => getFreelancers(""),
    staleTime: 60 * 1000,
    enabled: !isFreelancer,
  });

  const allFreelancers = freelancersData?.data?.freelancers || freelancersData?.data || [];
  const topFreelancers = allFreelancers.slice(0, 4);

  const heroTitle = isClient
    ? "استقطب صفوة المواهب التقنية بسرعة الذكاء الاصطناعي."
    : isFreelancer
      ? "اعثر على قفزتك المهنية الكبيرة القادمة."
      : "مرحباً بك في مسار — المنصة الذكية للمواهب الاحترافية.";

  const heroSubtitle = isClient
    ? "ابنِ فريق أحلامك البرمجي من مهندسين موثوقين ومفحوصين تلقائياً عبر عمق ذكاء مسار."
    : isFreelancer
      ? "اكتشف مشاريع برمجية عالية القيمة، مأمنة مالياً، وضاعف مسيرتك الحرة."
      : "منظومة رقمية متكاملة تدمج النخبة التقنية مع المشاريع الطموحة بضمان مالي تام.";

  const primaryCta = isClient
    ? { label: "غرفة التحليل الذكي للمشاريع 🤖", to: "/ai-assistant" }
    : isFreelancer
      ? { label: "استكشف المشاريع المتاحة 🚀", to: "/projects" }
      : { label: "ابدأ مسيرتك كمستقل", to: "/register?role=freelancer" };

  const secondaryCta = !user && {
    label: "وظّف نخبة تقنية",
    to: "/register?role=client",
  };

  const feedTitle = isClient ? "مستقلون مرشحون للتوظيف الفوري" : "أحدث الفرص التقنية النشطة";
  const feedItems = isClient ? topFreelancers : latestProjects;

  if (isInitializing) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-secondary/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <div className="text-sm font-medium text-slate-400 tracking-wide animate-pulse">جاري تحضير بيئة مسار الذكية...</div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#080B10] text-slate-100 font-sans text-right overflow-x-hidden relative selection:bg-secondary/30 selection:text-white">
      
      {/* 🌌 تأثيرات الإضاءة المحيطية العميقة الـ Cyber-Punk Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[140px] animate-pulse [animation-duration:8s]" />
        <div className="absolute top-1/3 left-[-100px] h-[450px] w-[450px] rounded-full bg-accent/5 blur-[120px] animate-pulse [animation-duration:10s]" />
      </div>

      <SmartChatWidget />

      {/* 🚀 Hero Section (Premium Cyber Panel) */}
      <motion.section 
        className="relative pt-32 pb-20 z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl p-8 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden group"
          >
            {/* إضاءة خطية خفيفة أعلى الكارت */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-secondary/10 border border-secondary/20 text-secondary uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
              منظومة الماتشينج الذكية المدعومة بالـ AI
            </span>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.15] tracking-tight max-w-4xl">
              {heroTitle}
            </h1>
            
            <p className="mt-6 max-w-3xl text-base md:text-lg text-slate-400 leading-relaxed font-light">
              {heroSubtitle}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to={primaryCta.to}
                className="inline-flex items-center justify-center rounded-xl bg-secondary px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_20px_40px_rgba(228,255,0,0.15)] transition-all hover:shadow-[0_20px_50px_rgba(228,255,0,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {primaryCta.label}
              </Link>
              {secondaryCta && (
                <Link
                  to={secondaryCta.to}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-white/[0.02] backdrop-blur-md px-8 py-4 text-sm font-semibold text-slate-200 transition-all hover:bg-white/[0.06] hover:border-slate-700"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 📊 Stats Section (Bento Box Layout) */}
      <motion.section
        className="relative pb-20 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="relative rounded-2xl border border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent p-6 flex flex-col justify-between group hover:border-slate-800 transition-colors"
              >
                <div>
                  <span className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} dir="ltr">
                    {stat.value}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-200">{stat.label}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{stat.desc}</p>
                </div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 text-lg">↗</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 🎯 Dynamic Feed Section (Premium Feed Layout) */}
      <motion.section
        className="relative pb-20 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-secondary font-bold">توصيات حية مخصصة للـ Profile</span>
              <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">{feedTitle}</h2>
              <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
                {isClient
                  ? "محترفو البرمجيات والذكاء الاصطناعي الأعلى تقييماً والمتاحين لبدء التنفيذ الفوري."
                  : "مشاريع تقنية مفرزة ومحللة لملائمة خبراتك الحالية تماماً ومنع هدر العروض."}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
            {isProjectsLoading || isFreelancersLoading ? (
              <div className="col-span-full border border-dashed border-white/10 rounded-2xl p-12 text-center text-slate-400 text-sm animate-pulse">
                🔄 جاري سحب وتحليل قنوات البيانات الفنية لمنصة مسار...
              </div>
            ) : isProjectsError || isFreelancersError ? (
              <div className="col-span-full border border-red-500/10 bg-red-500/[0.02] text-red-400 rounded-2xl p-8 text-center text-sm">
                ⚠️ عطل مؤقت في مزامنة توصيات الـ AI. يرجى إعادة المحاولة لاحقاً.
              </div>
            ) : (
              feedItems.map((item) => (
                <div
                  key={isClient ? item.name : item.title}
                  className="relative rounded-2xl border border-white/[0.04] bg-gradient-to-br from-white/[0.02] to-transparent p-6 hover:border-secondary/40 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between group"
                >
                  {isClient ? (
                    <>
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-bold text-white group-hover:text-secondary transition-colors">{item.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{item.role || "Senior Full Stack Engineer"}</p>
                          </div>
                          <span className="text-xs font-bold text-accent bg-accent/5 border border-accent/20 px-3 py-1 rounded-lg" dir="ltr">
                            {item.rate || "$45 / hr"}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/freelancers/${item._id}`}
                        className="mt-6 inline-flex items-center text-xs font-bold text-secondary gap-1 group/link self-start"
                      >
                        معاينة الملف الفني الموثق <span className="group-hover/link:-translate-x-1 transition-transform">←</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="text-lg font-bold text-white group-hover:text-secondary transition-colors max-w-[70%]">{item.title}</h4>
                          <span className="text-xs font-bold text-secondary bg-secondary/5 border border-secondary/20 px-3 py-1 rounded-lg" dir="ltr">
                            $ {item.budget}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/projects/${item._id}`}
                        className="mt-6 inline-flex items-center text-xs font-bold text-secondary gap-1 group/link self-start"
                      >
                        عرض كراسة الشروط والتفاصيل <span className="group-hover/link:-translate-x-1 transition-transform">←</span>
                      </Link>
                    </>
                  )}
                </div>
              ))
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* 🛡️ Trust & Escrow Signals (Premium Cards Layout) */}
      <motion.section
        className="relative pb-24 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="mb-12">
            <span className="text-xs uppercase tracking-widest text-secondary font-bold">الحماية القانونية والمالية</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">اعمل بضمان أمان مالي فائق</h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
              بيئة تشغيل رقمية محكومة بقوانين الدفع المالي المشروط (Escrow) لحفظ مستحقات التكويد والتسليم الفوري.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {trustSignals.map((signal) => (
              <motion.div
                key={signal.title}
                variants={itemVariants}
                className="relative rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 hover:bg-white/[0.03] transition-colors overflow-hidden group"
              >
                {/* خلفية متوهجة خفيفة جداً تظهر عند الـ Hover خلف الإيقونة */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-white/[0.08] text-xl shadow-inner">
                  {signal.icon}
                </div>
                
                <h3 className="text-base font-bold text-white">{signal.title}</h3>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed font-light">{signal.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default Home;