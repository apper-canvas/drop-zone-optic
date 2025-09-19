import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}
    >
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
        <ApperIcon name="AlertCircle" size={32} className="text-error" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Upload Error</h3>
        <p className="text-secondary text-sm max-w-md">{message}</p>
      </div>

      {onRetry && (
        <Button 
          onClick={onRetry}
          className="flex items-center gap-2 mt-4"
          variant="outline"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;