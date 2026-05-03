/**
 * Button Component
 * A reusable, customizable button with multiple variants
 * Variants: primary, secondary, accent, outline
 */

const Button = ({ variant = "primary", className = "", ...props }) => {
  const baseStyles = "rounded-md font-medium transition-all px-4 py-2";

  const variantStyles = {
    primary:
      "bg-[#0f172a] text-white border border-[#0f172a] hover:border-[#22c55e] hover:shadow-lg hover:shadow-[#22c55e]/20",
    secondary:
      "bg-[#22c55e] text-white hover:bg-[#16a34a] hover:shadow-lg hover:shadow-[#22c55e]/30",
    accent:
      "bg-[#a3e635] text-[#0b0f19] font-bold hover:bg-[#84cc16] hover:shadow-lg hover:shadow-[#a3e635]/40",
    outline:
      "bg-transparent border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10 hover:shadow-lg hover:shadow-[#22c55e]/20",
  };

  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      className={`${baseStyles} ${selectedVariant} ${className}`}
      {...props}
    />
  );
};

export default Button;
