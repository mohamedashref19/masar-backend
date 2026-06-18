/**
 * Button Component - Ultra-Premium Cyber SaaS Edition
 * A reusable, high-fidelity button with responsive micro-interactions and neon flows.
 */

const Button = ({ variant = "primary", className = "", ...props }) => {
  // 🌟 الستايل الأساسي: أضفنا حواف rounded-xl وانسيابية الحركة وسلسلة التوجيه
  const baseStyles =
    "relative inline-flex items-center justify-center font-['Outfit'] font-bold text-xs md:text-sm tracking-wide transition-all duration-300 rounded-xl px-5 py-3 overflow-hidden select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  const variantStyles = {
    // 💎 الـ Primary: ستايل زجاجي داكن وعميق مع خط توهج ناعم يحوم حوله
    primary:
      "bg-slate-950/40 text-slate-200 border border-white/[0.06] hover:border-white/[0.15] hover:text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.02)] backdrop-blur-md",

    // 🟢 الـ Secondary: تحول لـ نيون زمردي معتم غاية في الأناقة والاستقرار
    secondary:
      "bg-[#101b15] text-[#22c55e] border border-[#22c55e]/20 hover:border-[#22c55e]/50 hover:bg-[#22c55e]/10 shadow-[0_10px_30px_rgba(34,197,94,0.02)] hover:shadow-[0_10px_30px_rgba(34,197,94,0.1)]",

    // ⚡ الـ Accent: هذا هو زرار النشر والاعتماد النيوني الحاد لبراند مسار (#E4FF00)
    accent:
      "bg-[#E4FF00] text-slate-950 font-black shadow-[0_10px_25px_rgba(228,255,0,0.15)] hover:shadow-[0_10px_30px_rgba(228,255,0,0.35)] hover:bg-[#f2ff44] hover:scale-[1.01]",

    // 🎚️ الـ Outline: مظهر سيبراني زجاجي شفاف ومحايد للفصل بين الأكشنز
    outline:
      "bg-transparent border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] hover:border-white/[0.15]",
  };

  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      className={`${baseStyles} ${selectedVariant} ${className}`}
      {...props}
    >
      {/* 🔮 تأثير الـ Ambient Glow الخلفي الخفي المتاح في الـ Primary والـ Secondary لزيادة العمق البصري */}
      {(variant === "primary" || variant === "secondary") && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-white/[0.01] via-transparent to-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}

      {/* النصوص والأيقونات الداخلية الممررة */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {props.children}
      </span>
    </button>
  );
};

export default Button;
