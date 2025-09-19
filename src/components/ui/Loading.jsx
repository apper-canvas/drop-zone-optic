import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading...", type = "default" }) => {
  if (type === "files") {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-2 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "upload-zone") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gray-50"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-12 h-12 mb-4"
        >
          <ApperIcon name="Loader2" size={48} className="text-primary" />
        </motion.div>
        <p className="text-secondary text-lg font-medium">{message}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 space-y-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <ApperIcon name="Loader2" size={32} className="text-primary" />
      </motion.div>
      <p className="text-secondary text-sm font-medium">{message}</p>
    </motion.div>
  );
};

export default Loading;