import { cn } from "../../lib/utils";

export function Select({ className, label, options, error, ...props }) {
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
      <div className="relative">
        <select
          className={cn(
            "w-full px-4 py-2.5 rounded-md border appearance-none transition-all duration-200",
            "text-zinc-800 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
            error ? "border-red-500 bg-red-50" : "border-zinc-300",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-700">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}