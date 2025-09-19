import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import FileUploadZone from "@/components/organisms/FileUploadZone";
import ApperIcon from "@/components/atoms/ApperIcon";
import React from "react";
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-blue-50/30">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-gray-900"
            >
              Upload Files with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Confidence
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed"
            >
              Drag and drop your files or browse to select them. 
              Track upload progress in real-time with reliable, secure file transfer.
            </motion.p>
          </div>

          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FileUploadZone />
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-12"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <ApperIcon name="Upload" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Drag & Drop</h3>
                <p className="text-sm text-secondary leading-relaxed">
                  Simply drag files from your computer and drop them to start uploading instantly.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto">
                  <ApperIcon name="BarChart3" size={24} className="text-success" />
                </div>
                <h3 className="font-semibold text-gray-900">Real-time Progress</h3>
                <p className="text-sm text-secondary leading-relaxed">
                  Monitor upload progress with smooth progress bars and instant status updates.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto">
                  <ApperIcon name="Shield" size={24} className="text-accent" />
                </div>
                <h3 className="font-semibold text-gray-900">Secure Transfer</h3>
                <p className="text-sm text-secondary leading-relaxed">
                  All uploads are encrypted and processed securely with automatic error recovery.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default HomePage;