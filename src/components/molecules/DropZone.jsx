import { useState, useRef } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const DropZone = ({ onFileDrop, maxFiles = 10, maxSizeMB = 10, acceptedTypes = [] }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileDrop(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileDrop(files);
    }
    // Reset input value so same file can be selected again
    e.target.value = "";
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatAcceptedTypes = () => {
    if (acceptedTypes.length === 0) return "All file types";
    return acceptedTypes.map(type => {
      const ext = type.split("/")[1];
      return ext ? `.${ext}` : type;
    }).join(", ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
        isDragOver
          ? "border-primary bg-primary/5 drop-zone-active"
          : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      <motion.div
        animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        <div className={cn(
          "mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300",
          isDragOver ? "bg-primary text-white" : "bg-primary/10 text-primary"
        )}>
          <ApperIcon 
            name={isDragOver ? "Download" : "Upload"} 
            size={40} 
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {isDragOver ? "Drop files here" : "Upload your files"}
          </h3>
          <p className="text-secondary max-w-md mx-auto leading-relaxed">
            {isDragOver 
              ? "Release to start uploading your files"
              : "Drag and drop files here, or click browse to select files from your computer"
            }
          </p>
        </div>

        {!isDragOver && (
          <div className="space-y-4">
            <Button
              onClick={openFileDialog}
              size="lg"
              className="flex items-center gap-2"
            >
              <ApperIcon name="FolderOpen" size={20} />
              Browse Files
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>Maximum {maxFiles} files • Up to {maxSizeMB}MB each</p>
              <p>Supports: {formatAcceptedTypes()}</p>
            </div>
          </div>
        )}
      </motion.div>

      {isDragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-primary/10 rounded-2xl flex items-center justify-center"
        >
          <div className="text-primary font-semibold text-lg flex items-center gap-2">
            <ApperIcon name="Download" size={24} />
            Drop to upload
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DropZone;