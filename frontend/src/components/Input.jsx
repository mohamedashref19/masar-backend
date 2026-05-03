/**
 * Input Component
 * A reusable form input with label and error support
 * Props: label, error, id, and standard input attributes
 */

const Input = ({ label, error, id, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#f1f5f9]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          bg-[#1e293b] text-white border border-[#0f172a] rounded-md
          focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] focus:outline-none
          transition-all px-3 py-2
          placeholder-[#64748b]
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
