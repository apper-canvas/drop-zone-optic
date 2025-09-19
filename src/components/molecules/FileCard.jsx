import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProgressBar from "./ProgressBar";
import { cn } from "@/utils/cn";

const FileCard = ({ 
  file, 
  onRemove, 
  onRetry, 
  showProgress = false,
  className = ""
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-success";
      case "failed": return "text-error";
      case "uploading": return "text-primary";
      default: return "text-secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "CheckCircle";
      case "failed": return "XCircle";
      case "uploading": return "Loader2";
      default: return "File";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return "ImageIcon";
    if (fileType.includes("pdf")) return "FileText";
    if (fileType.includes("spreadsheet") || fileType.includes("csv")) return "FileSpreadsheet";
    if (fileType.includes("presentation")) return "Presentation";
    if (fileType.includes("document")) return "FileText";
    if (fileType.includes("video")) return "Video";
    if (fileType.includes("audio")) return "Music";
    return "File";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="p-4" hover={file.status === "completed"}>
        <div className="flex items-center space-x-4">
          {/* File Icon */}
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
            file.status === "completed" ? "bg-success/10" :
            file.status === "failed" ? "bg-error/10" :
            file.status === "uploading" ? "bg-primary/10" :
            "bg-gray-100"
          )}>
            <ApperIcon
              name={getFileIcon(file.type)}
              size={24}
              className={cn(
                file.status === "completed" ? "text-success" :
                file.status === "failed" ? "text-error" :
                file.status === "uploading" ? "text-primary" :
                "text-secondary"
              )}
            />
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-gray-900 truncate pr-2">
                {file.name}
              </h4>
              <div className="flex items-center gap-2 flex-shrink-0">
                <ApperIcon
                  name={getStatusIcon(file.status)}
                  size={16}
                  className={cn(
                    getStatusColor(file.status),
                    file.status === "uploading" && "animate-spin"
                  )}
                />
                {file.status !== "uploading" && onRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(file.Id)}
                    className="p-1 h-6 w-6 text-gray-400 hover:text-error"
                  >
                    <ApperIcon name="X" size={12} />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-secondary">
              <span>{formatFileSize(file.size)}</span>
              {showProgress && file.status === "uploading" && (
                <span>{file.progress}%</span>
              )}
            </div>

            {/* Progress Bar */}
            {showProgress && file.status === "uploading" && (
              <ProgressBar
                progress={file.progress}
                className="mt-2"
                size="sm"
              />
            )}

            {/* Error Message and Retry */}
            {file.status === "failed" && (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-error">{file.error}</p>
                {onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetry(file.Id)}
                    className="text-xs h-6 px-2"
                  >
                    <ApperIcon name="RefreshCw" size={10} className="mr-1" />
                    Retry
                  </Button>
                )}
              </div>
            )}

            {/* Success URL */}
            {file.status === "completed" && file.url && (
              <div className="mt-1">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-blue-700 flex items-center gap-1"
                >
                  <ApperIcon name="ExternalLink" size={10} />
                  View file
                </a>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FileCard;