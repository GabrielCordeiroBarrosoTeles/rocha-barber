import { cn } from "../../lib/utils"

export function Button({ className, children, variant = "default", ...props }) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4"

  const variants = {
    default: "bg-zinc-900 text-white hover:bg-zinc-800",
    primary: "bg-amber-600 text-white hover:bg-amber-700 shadow-lg hover:shadow-xl",
    outline: "border border-zinc-300 hover:bg-zinc-100",
    white: "bg-white text-amber-600 hover:bg-zinc-100 shadow-lg hover:shadow-xl",
    gradient: "bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:from-amber-600 hover:to-amber-800 shadow-lg hover:shadow-xl"
  }

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}