import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/store/authSlice"; // تأكد من المسار
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../features/notifications/hooks/useNotifications"; // هوك الإشعارات الذكي
import NotificationsDropdown from "../features/notifications/components/NotificationsDropdown"; // المكون الزجاجي المنسدل
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiPlusCircle,
  FiMessageSquare,
  FiBell, // أيقونة الجرس الفخمة
} from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false); // حالة فتح وإغلاق قائمة الإشعارات

  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useNotifications(); // جلب عداد الإشعارات غير المقروءة لايف

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isClient = user?.role?.toLowerCase() === "client";

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-background/80 backdrop-blur-md border-b border-white/5 font-['Outfit']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* 1. Logo - مسار */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary font-bold text-xl group-hover:rotate-12 transition-transform">
              M
            </div>
            <span className="text-2xl font-bold text-heading tracking-tight">
              مسار
            </span>
          </Link>

          {/* 2. Desktop Navigation (Dynamic Links) */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                {/* 🎯 جرس الإشعارات الذكي (Desktop) */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2 text-body hover:text-white transition-colors relative flex items-center justify-center"
                    title="الإشعارات"
                  >
                    <FiBell
                      size={22}
                      className={unreadCount > 0 ? "text-secondary" : ""}
                    />

                    {/* شارة الـ Badge الحمراء المنبثقة بحركة Bounce */}
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-950 animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* القائمة الزجاجية المنسدلة */}
                  <NotificationsDropdown
                    isOpen={isNotifOpen}
                    onClose={() => setIsNotifOpen(false)}
                  />
                </div>
                {isClient ? (
                  <>
                    <Link
                      to="/post-job"
                      className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-xl border border-secondary/20 hover:bg-secondary hover:text-white transition-all"
                    >
                      <FiPlusCircle /> انشر مشروعاً
                    </Link>
                    <Link
                      to="/client-dashboard"
                      className="text-body hover:text-secondary font-medium transition-colors"
                    >
                      مشاريعي
                    </Link>
                    <Link
                      to="/freelancers"
                      className="text-body hover:text-secondary font-medium transition-colors"
                    >
                      المستقلين
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/freelancer-dashboard"
                      className="text-body hover:text-secondary font-medium transition-colors"
                    >
                      عروضي
                    </Link>
                    <Link
                      to="/projects"
                      className="text-body hover:text-secondary font-medium transition-colors"
                    >
                      تصفح المشاريع
                    </Link>
                  </>
                )}

                <Link
                  to="/inbox"
                  className="text-body hover:text-secondary font-medium transition-colors flex items-center gap-2"
                >
                  <FiMessageSquare /> المحادثات
                </Link>

                {/* Profile Link & Logout */}
                <div className="flex items-center gap-4 border-l border-white/10 pr-4">
                  <Link
                    to={isClient ? "/client-settings" : "/freelancer-settings"}
                    className="flex flex-col text-left"
                  >
                    <span className="text-sm font-bold text-heading leading-none">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-secondary uppercase tracking-widest mt-1">
                      {user.role}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-body hover:text-red-400 transition-colors"
                    title="تسجيل الخروج"
                  >
                    <FiLogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-body hover:text-heading font-medium"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="bg-secondary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-secondary/20 hover:scale-105 transition-transform"
                >
                  انضم الآن
                </Link>
              </div>
            )}
          </div>

          {/* 3. Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* جرس الإشعارات السريع للموبايل يظهر بجانب الهامبرغر منيو */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 text-body relative flex items-center justify-center"
                >
                  <FiBell
                    size={24}
                    className={unreadCount > 0 ? "text-secondary" : ""}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-950">
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
              className="text-heading p-2"
            >
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/projects" className="block text-body py-2">
                تصفح المشاريع
              </Link>

              {user ? (
                <>
                  {isClient ? (
                    <>
                      <Link
                        to="/post-job"
                        className="block text-body py-2 flex items-center gap-2"
                      >
                        <FiPlusCircle /> انشر مشروعاً
                      </Link>
                      <Link
                        to="/client-dashboard"
                        className="block text-body py-2"
                      >
                        مشاريعي
                      </Link>
                      <Link to="/freelancers" className="block text-body py-2">
                        المستقلين
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/freelancer-dashboard"
                        className="block text-body py-2"
                      >
                        عروضي
                      </Link>
                    </>
                  )}

                  <Link
                    to="/inbox"
                    className="block text-body py-2 flex items-center gap-2"
                  >
                    <FiMessageSquare /> المحادثات والرسائل
                  </Link>

                  <div className="pt-4 border-t border-white/5">
                    <Link
                      to={
                        isClient ? "/client-settings" : "/freelancer-settings"
                      }
                      className="block text-sm text-secondary mb-3 uppercase tracking-widest font-bold"
                    >
                      {user.name} (تعديل الحساب)
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-400 font-bold py-2 w-full text-right"
                    >
                      <FiLogOut /> تسجيل الخروج
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                  <Link
                    to="/login"
                    className="text-center py-3 rounded-xl border border-white/10 text-body"
                  >
                    دخول
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-3 rounded-xl bg-secondary text-white font-bold"
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
