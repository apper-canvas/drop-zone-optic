import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className,
  children,
  variant = "default",
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl shadow-sm border border-gray-100";
  
  const variants = {
    default: "p-6",
    compact: "p-4",
    large: "p-8",
    none: ""
  };

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        hover && "file-card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;