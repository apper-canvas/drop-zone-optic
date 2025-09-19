import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const FileUploadStats = ({ files = [], className = "" }) => {
  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === "completed").length;
  const failedFiles = files.filter(f => f.status === "failed").length;
  const uploadingFiles = files.filter(f => f.status === "uploading").length;

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const completedSize = files
    .filter(f => f.status === "completed")
    .reduce((acc, file) => acc + file.size, 0);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const stats = [
    {
      label: "Total Files",
      value: totalFiles,
      icon: "Files",
      color: "text-primary"
    },
    {
      label: "Completed",
      value: completedFiles,
      icon: "CheckCircle",
      color: "text-success"
    },
    {
      label: "Failed",
      value: failedFiles,
      icon: "XCircle",
      color: "text-error"
    },
    {
      label: "Uploading",
      value: uploadingFiles,
      icon: "Upload",
      color: "text-warning"
    }
  ];

  if (totalFiles === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center space-y-1"
            >
              <div className="flex items-center justify-center gap-1">
                <ApperIcon name={stat.icon} size={16} className={stat.color} />
                <span className="text-lg font-semibold text-gray-900">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {formatFileSize(totalSize)}
            </p>
            <p className="text-xs text-secondary">Total Size</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-success">
              {formatFileSize(completedSize)}
            </p>
            <p className="text-xs text-secondary">Uploaded</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FileUploadStats;