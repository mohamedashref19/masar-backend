import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/store/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../features/notifications/hooks/useNotifications";
import NotificationsDropdown from "../features/notifications/components/NotificationsDropdown";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiPlusCircle,
  FiMessageSquare,
  FiBell,
} from "react-icons/fi";
import logo from "../../public/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  console.log("🚀 Navbar - User State:", user);
  const { unreadCount } = useNotifications();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // دالة التحكم في الإشعارات المأمنة ضد التضارب البرمي
  const toggleNotifications = (e) => {
    e.stopPropagation(); // 🎯 تريكة خطيرة: تمنع تداخل الأحداث وإغلاق الـ Dropdown فجائياً
    setIsNotifOpen((prev) => !prev);
  };

  const isClient = user?.role?.toLowerCase() === "client";

  return (
    <nav
      dir="rtl"
      className="fixed top-4 left-0 right-0 max-w-7xl mx-auto z-[100] px-4 font-['Outfit'] text-right overflow-hidden "
    >
      {/* 🌟 الهيكل الخارجي العائم (Floating Glass Panel) */}
      <div className="relative rounded-2xl border border-white/[0.05] bg-[#080B10]/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] px-6 transition-all duration-300 hover:border-white/[0.08]">
        {/* خط إضاءة علوي فخم */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        <div className="flex justify-between items-center h-16">
          {/* 1. اليمين: اللوجو العربي الـ Minimal المطور سيبرانياً */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
              {logo ? (
                <img src={logo} alt="مسار" className="w-30 h-20 rounded-lg" />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-secondary to-[#BDD400] flex items-center justify-center shadow-[0_0_15px_rgba(228,255,0,0.15)] group-hover:scale-105 transition-transform">
                    <span className="text-slate-950 font-black text-sm">م</span>
                  </div>
                  <span className="text-lg font-black text-white tracking-tight group-hover:text-secondary transition-colors">
                    مسار
                  </span>
                </>
              )}
            </div>
          </Link>

          {/* 2. المنتصف واليسار: روابط الديسكتوب والـ CTA */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <div className="flex items-center gap-5 border-l border-white/5 pl-5">
                  {isClient ? (
                    <>
                      <Link
                        to="/client-dashboard"
                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                      >
                        مشاريعي
                      </Link>
                      <Link
                        to="/freelancers"
                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                      >
                        المستقلين
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/freelancer-dashboard"
                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                      >
                        عروضي
                      </Link>
                      <Link
                        to="/projects"
                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                      >
                        تصفح المشاريع
                      </Link>
                    </>
                  )}

                  <Link
                    to="/inbox"
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <FiMessageSquare className="text-slate-500" /> المحادثات
                  </Link>
                </div>

                {isClient && (
                  <Link
                    to="/post-job"
                    className="flex items-center gap-1.5 bg-secondary text-slate-950 px-4 py-2 rounded-xl font-bold text-xs shadow-[0_10px_25px_rgba(228,255,0,0.1)] hover:shadow-[0_10px_25px_rgba(228,255,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <FiPlusCircle size={14} /> انشر مشروعاً
                  </Link>
                )}

                {/* 🎯 جرس الإشعارات المطور ومؤمن الأكشنز */}
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.03] transition-all relative flex items-center justify-center border ${
                      isNotifOpen
                        ? "border-white/[0.08] bg-white/[0.02]"
                        : "border-transparent"
                    }`}
                    title="الإشعارات"
                  >
                    <FiBell
                      size={16}
                      className={
                        unreadCount > 0 ? "text-secondary animate-pulse" : ""
                      }
                    />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#080B10]">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <NotificationsDropdown
                    isOpen={isNotifOpen}
                    onClose={() => setIsNotifOpen(false)}
                  />
                </div>

                {/* كارت البروفايل العائم (Profile Pill) */}
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-xl py-1.5 pr-3 pl-2 hover:border-white/[0.1] transition-colors">
                  <Link
                    to={isClient ? "/client-settings" : "/freelancer-settings"}
                    className="flex flex-col text-right"
                  >
                    <span className="text-xs font-bold text-slate-200 leading-none">
                      {user.name}
                    </span>
                    <span
                      className="text-[9px] text-secondary font-semibold uppercase tracking-wider mt-1"
                      dir="ltr"
                    >
                      {user.role}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="تسجيل الخروج"
                  >
                    <FiLogOut size={14} className="rotate-180" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-white font-bold text-xs transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white px-5 py-2 rounded-xl font-bold text-xs transition-all hover:scale-[1.02]"
                >
                  انضم الآن
                </Link>
              </div>
            )}
          </div>

          {/* 3. شاشة الموبايل: أزرار الجرس والقائمة السريعة */}
          <div className="md:hidden flex items-center gap-1">
            {user && (
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="p-2 text-slate-400 relative flex items-center justify-center"
                >
                  <FiBell
                    size={18}
                    className={unreadCount > 0 ? "text-secondary" : ""}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#080B10]">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationsDropdown
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                />
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/[0.03]"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. لوحة الموبايل المنسدلة كـ Bento Card معلق */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden mt-2 rounded-2xl border border-white/[0.05] bg-[#080B10]/95 backdrop-blur-2xl shadow-2xl overflow-hidden text-right z-50"
          >
            <div className="px-5 py-4 space-y-2.5">
              <Link
                to="/projects"
                className="block text-slate-400 py-1.5 text-sm font-medium hover:text-white"
              >
                تصفح المشاريع
              </Link>

              {user ? (
                <>
                  {isClient ? (
                    <>
                      <Link
                        to="/post-job"
                        className="block text-secondary py-1.5 text-sm font-bold flex items-center gap-1.5"
                      >
                        <FiPlusCircle /> انشر مشروعاً
                      </Link>
                      <Link
                        to="/client-dashboard"
                        className="block text-slate-400 py-1.5 text-sm font-medium hover:text-white"
                      >
                        مشاريعي
                      </Link>
                      <Link
                        to="/freelancers"
                        className="block text-slate-400 py-1.5 text-sm font-medium hover:text-white"
                      >
                        المستقلين
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/freelancer-dashboard"
                      className="block text-slate-400 py-1.5 text-sm font-medium hover:text-white"
                    >
                      عروضي
                    </Link>
                  )}

                  <Link
                    to="/inbox"
                    className="block text-slate-400 py-1.5 text-sm font-medium hover:text-white flex items-center gap-1.5"
                  >
                    <FiMessageSquare /> المحادثات والرسائل
                  </Link>

                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    <Link
                      to={
                        isClient ? "/client-settings" : "/freelancer-settings"
                      }
                      className="flex flex-col"
                    >
                      <span className="text-xs font-bold text-white">
                        {user.name}
                      </span>
                      <span
                        className="text-[9px] text-secondary uppercase font-bold tracking-wider mt-0.5"
                        dir="ltr"
                      >
                        {user.role}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-red-400/80 hover:text-red-400 font-bold text-xs bg-red-500/5 px-3 py-1.5 rounded-xl border border-red-500/10"
                    >
                      <FiLogOut className="rotate-180" /> خروج
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.05]">
                  <Link
                    to="/login"
                    className="text-center py-2 rounded-xl border border-white/5 text-slate-300 text-xs font-medium bg-white/[0.02]"
                  >
                    دخول
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-2 rounded-xl bg-secondary text-slate-950 font-bold text-xs shadow-md"
                  >
                    ابدأ الآن
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
