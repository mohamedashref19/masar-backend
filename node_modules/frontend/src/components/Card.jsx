/**
 * Card Component
 * A reusable container for projects and freelancers
 * Props: children, className, hoverEffect
 */

const Card = ({ children, className = "", hoverEffect = false }) => {
  const baseStyles =
    "bg-[#0f172a] rounded-xl border border-slate-800 text-[#94a3b8] p-6";
  const hoverStyles = hoverEffect
    ? "hover:-translate-y-1 hover:border-[#22c55e] transition-all"
    : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
