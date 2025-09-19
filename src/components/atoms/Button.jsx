import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-blue-700 text-white focus:ring-primary/20 shadow-sm hover:shadow-md",
    secondary: "bg-secondary hover:bg-slate-600 text-white focus:ring-secondary/20 shadow-sm hover:shadow-md",
    success: "bg-success hover:bg-green-600 text-white focus:ring-success/20 shadow-sm hover:shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/20",
    ghost: "text-secondary hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200",
    danger: "bg-error hover:bg-red-600 text-white focus:ring-error/20 shadow-sm hover:shadow-md"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "transform-none",
        !disabled && "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;