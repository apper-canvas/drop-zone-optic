import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  progress = 0, 
  className = "", 
  size = "md",
  showLabel = false,
  animated = true 
}) => {
  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-secondary">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      
      <div className={cn(
        "bg-gray-200 rounded-full overflow-hidden",
        sizeStyles[size]
      )}>
        <motion.div
          className="progress-gradient rounded-full h-full"
          initial={{ width: 0 }}
          animate={{ 
            width: `${Math.min(100, Math.max(0, progress))}%`
          }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: "easeOut" 
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;