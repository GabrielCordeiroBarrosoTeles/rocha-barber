import { cn } from "../../lib/utils";

export function Input({ className, label, error, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-zinc-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2.5 rounded-md border transition-all duration-200",
          "placeholder:text-zinc-400 text-zinc-800",
          "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
          error ? "border-red-500 bg-red-50" : "border-zinc-300 bg-white",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}