import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import DropZone from "@/components/molecules/DropZone";
import FileCard from "@/components/molecules/FileCard";
import FileUploadStats from "@/components/molecules/FileUploadStats";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import uploadService from "@/services/api/uploadService";
import Empty from "@/components/ui/Empty";

const FileUploadZone = () => {
  const [files, setFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(new Set());

  const maxFiles = 10;
  const maxSizeMB = 50;
  const acceptedTypes = [
    "image/*",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ];

  const validateFile = (file) => {
    // Check file size
    if (!uploadService.isValidFileSize(file, maxSizeMB)) {
      toast.error(`File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }

    // Check file type if restrictions are set
    if (acceptedTypes.length > 0 && !uploadService.isValidFileType(file, acceptedTypes)) {
      toast.error(`File type not supported for "${file.name}".`);
      return false;
    }

    // Check for duplicates
    const isDuplicate = files.some(existingFile => 
      existingFile.name === file.name && existingFile.size === file.size
    );
    
    if (isDuplicate) {
      toast.warning(`File "${file.name}" is already in the queue.`);
      return false;
    }

    return true;
  };

  const handleFileDrop = useCallback(async (droppedFiles) => {
    // Check total file limit
    if (files.length + droppedFiles.length > maxFiles) {
      toast.error(`Cannot upload more than ${maxFiles} files. Current: ${files.length}, Adding: ${droppedFiles.length}`);
      return;
    }

    // Validate and filter files
    const validFiles = droppedFiles.filter(validateFile);
    
    if (validFiles.length === 0) {
      return;
    }

    // Create file objects and add to state
    const newFiles = [];
    for (const file of validFiles) {
      try {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type
        };
        
        const createdFile = await uploadService.createUploadFile(fileData);
        newFiles.push(createdFile);
      } catch (error) {
        toast.error(`Failed to prepare file "${file.name}" for upload.`);
      }
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      toast.success(`Added ${newFiles.length} file${newFiles.length > 1 ? "s" : ""} to upload queue.`);
      
      // Start uploading files automatically
      newFiles.forEach(file => startUpload(file.Id));
    }
  }, [files]);

  const startUpload = useCallback(async (fileId) => {
    if (uploadingFiles.has(fileId)) {
      return; // Already uploading
    }

    setUploadingFiles(prev => new Set([...prev, fileId]));

    try {
      await uploadService.simulateFileUpload(fileId, (progress, status) => {
        setFiles(prev => prev.map(file => 
          file.Id === fileId 
            ? { ...file, progress, status }
            : file
        ));
      });

      const updatedFile = await uploadService.getUploadFileById(fileId);
      if (updatedFile && updatedFile.status === "completed") {
        toast.success(`"${updatedFile.name}" uploaded successfully!`);
      }
    } catch (error) {
      toast.error(`Failed to upload file.`);
    } finally {
      setUploadingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
    }
  }, [uploadingFiles]);

  const handleRetryUpload = useCallback(async (fileId) => {
    try {
      setUploadingFiles(prev => new Set([...prev, fileId]));
      
      await uploadService.retryUpload(fileId, (progress, status) => {
        setFiles(prev => prev.map(file => 
          file.Id === fileId 
            ? { ...file, progress, status, error: null }
            : file
        ));
      });

      const updatedFile = await uploadService.getUploadFileById(fileId);
      if (updatedFile && updatedFile.status === "completed") {
        toast.success(`"${updatedFile.name}" uploaded successfully!`);
      }
    } catch (error) {
      toast.error("Retry failed. Please try again.");
    } finally {
      setUploadingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
    }
  }, []);

  const handleRemoveFile = useCallback(async (fileId) => {
    try {
      await uploadService.deleteUploadFile(fileId);
      setFiles(prev => prev.filter(file => file.Id !== fileId));
      setUploadingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
      toast.info("File removed from queue.");
    } catch (error) {
      toast.error("Failed to remove file.");
    }
  }, []);

  const handleClearAll = useCallback(() => {
    const nonUploadingFiles = files.filter(file => !uploadingFiles.has(file.Id));
    
    nonUploadingFiles.forEach(file => {
      uploadService.deleteUploadFile(file.Id);
    });
    
    setFiles(prev => prev.filter(file => uploadingFiles.has(file.Id)));
    
    if (nonUploadingFiles.length > 0) {
      toast.info(`Cleared ${nonUploadingFiles.length} file${nonUploadingFiles.length > 1 ? "s" : ""} from queue.`);
    }
  }, [files, uploadingFiles]);

  const canClearAll = files.length > 0 && files.some(file => !uploadingFiles.has(file.Id));

  return (
    <div className="space-y-6">
      {/* Upload Stats */}
      {files.length > 0 && (
        <FileUploadStats files={files} />
      )}

      {/* Drop Zone */}
      <DropZone
        onFileDrop={handleFileDrop}
        maxFiles={maxFiles}
        maxSizeMB={maxSizeMB}
        acceptedTypes={acceptedTypes}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Upload Queue ({files.length})
            </h3>
            {canClearAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-error hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={16} className="mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {files.map((file) => (
                <FileCard
                  key={file.Id}
                  file={file}
                  onRemove={!uploadingFiles.has(file.Id) ? handleRemoveFile : null}
                  onRetry={file.status === "failed" ? handleRetryUpload : null}
                  showProgress={true}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <Empty
          title="Ready to upload files"
          description="Drag and drop your files above or click browse to get started. All uploads are secure and processed quickly."
          icon="Upload"
        />
      )}
    </div>
  );
};

export default FileUploadZone;