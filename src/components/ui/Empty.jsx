import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No files uploaded yet", 
  description = "Start by dropping files or clicking browse to upload your first file.",
  onAction,
  actionLabel = "Browse Files",
  icon = "Upload"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary" />
      </div>
      
      <div className="space-y-2 mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-secondary max-w-md leading-relaxed">{description}</p>
      </div>

      {onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}

      <div className="mt-8 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <ApperIcon name="Shield" size={12} />
          Secure Upload
        </span>
        <span className="flex items-center gap-1">
          <ApperIcon name="Zap" size={12} />
          Fast Transfer
        </span>
        <span className="flex items-center gap-1">
          <ApperIcon name="Check" size={12} />
          Reliable
        </span>
      </div>
    </motion.div>
  );
};

export default Empty;