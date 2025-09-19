import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Upload" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Drop Zone</h1>
              <p className="text-xs text-secondary">Professional File Uploader</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4 text-sm text-secondary">
              <div className="flex items-center gap-1">
                <ApperIcon name="Shield" size={16} className="text-success" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Zap" size={16} className="text-warning" />
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Check" size={16} className="text-primary" />
                <span>Reliable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;