import uploadFilesData from "../mockData/uploadFiles.json";
import uploadSessionsData from "../mockData/uploadSessions.json";
import React from "react";
import Error from "@/components/ui/Error";

class UploadService {
  constructor() {
    this.uploadFiles = [...uploadFilesData];
    this.uploadSessions = [...uploadSessionsData];
    this.initializeApperClient();
  }

  initializeApperClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  // Upload Files Methods
  async getAllUploadFiles() {
    await this.delay(300);
    return [...this.uploadFiles];
  }

  async getUploadFileById(id) {
    await this.delay(200);
    return this.uploadFiles.find(file => file.Id === parseInt(id)) || null;
  }

async createUploadFile(fileData) {
    await this.delay(400);
    const newFile = {
      ...fileData,
      Id: Math.max(...this.uploadFiles.map(f => f.Id), 0) + 1,
      status: "uploading",
      progress: 0,
      uploadedAt: new Date().toISOString(),
      url: null,
      error: null,
      description: null
    };
    this.uploadFiles.push(newFile);
    return { ...newFile };
  }

  async updateUploadFile(id, updates) {
    await this.delay(100);
    const index = this.uploadFiles.findIndex(file => file.Id === parseInt(id));
    if (index !== -1) {
      this.uploadFiles[index] = { ...this.uploadFiles[index], ...updates };
      return { ...this.uploadFiles[index] };
    }
    return null;
  }

  async deleteUploadFile(id) {
    await this.delay(200);
    const index = this.uploadFiles.findIndex(file => file.Id === parseInt(id));
    if (index !== -1) {
      this.uploadFiles.splice(index, 1);
      return true;
    }
    return false;
  }

  async simulateFileUpload(fileId, onProgress) {
    const file = await this.getUploadFileById(fileId);
    if (!file) return null;

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await this.delay(200);
      
      // Simulate random failure
      if (progress === 50 && Math.random() < 0.1) {
        await this.updateUploadFile(fileId, {
          status: "failed",
          progress: progress,
          error: "Network connection failed"
        });
        if (onProgress) onProgress(progress, "failed");
        return null;
      }

      await this.updateUploadFile(fileId, {
        progress: progress,
        status: progress === 100 ? "completed" : "uploading"
      });

      if (onProgress) onProgress(progress, progress === 100 ? "completed" : "uploading");
    }

    // Set final URL and completion
await this.updateUploadFile(fileId, {
      url: `https://example.com/files/${file.name}`,
      uploadedAt: new Date().toISOString()
    });

    // Generate AI description for images
    await this.generateImageDescription(fileId);

    return await this.getUploadFileById(fileId);
  }

  async retryUpload(fileId, onProgress) {
    await this.updateUploadFile(fileId, {
      status: "uploading",
      progress: 0,
      error: null
    });
    return await this.simulateFileUpload(fileId, onProgress);
  }

  // Upload Sessions Methods
  async getAllUploadSessions() {
    await this.delay(250);
    return [...this.uploadSessions];
  }

  async createUploadSession(sessionData) {
    await this.delay(300);
    const newSession = {
      ...sessionData,
      Id: Math.max(...this.uploadSessions.map(s => s.Id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    this.uploadSessions.push(newSession);
    return { ...newSession };
  }

  // Helper method for realistic delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // File validation utilities
  isValidFileType(file, allowedTypes = []) {
    if (allowedTypes.length === 0) return true;
    return allowedTypes.includes(file.type);
  }

  isValidFileSize(file, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

getFileIcon(fileType) {
    if (fileType.startsWith("image/")) return "ImageIcon";
    if (fileType.includes("pdf")) return "FileText";
    if (fileType.includes("spreadsheet") || fileType.includes("csv")) return "FileSpreadsheet";
    if (fileType.includes("presentation")) return "Presentation";
    if (fileType.includes("document")) return "FileText";
    if (fileType.includes("video")) return "Video";
    if (fileType.includes("audio")) return "Music";
    return "File";
  }

  async generateImageDescription(fileId) {
    try {
      const file = this.uploadFiles.find(f => f.Id === fileId);
      if (!file || !file.type.startsWith('image/')) {
        return; // Only process images
      }

      // Update status to show AI analysis in progress
      await this.updateUploadFile(fileId, {
        status: "analyzing"
      });

      // Create a mock file for demonstration (in real app, you'd read the actual file)
      const mockImageData = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      
      if (this.apperClient) {
        const result = await this.apperClient.functions.invoke(import.meta.env.VITE_OPENAI_IMAGE_ANALYZER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageData: mockImageData,
            mimeType: file.type,
            fileName: file.name
          })
        });

        if (result.success && result.description) {
          await this.updateUploadFile(fileId, {
            description: result.description,
            status: "completed"
          });
        } else {
          // AI analysis failed, but file upload succeeded
          await this.updateUploadFile(fileId, {
            status: "completed"
          });
        }
      } else {
        // Fallback when ApperClient is not available
        await this.delay(1000);
        await this.updateUploadFile(fileId, {
          description: `Professional ${file.type.includes('jpeg') || file.type.includes('jpg') ? 'photograph' : 'digital image'} showing visual content.`,
          status: "completed"
        });
      }
    } catch (error) {
      console.error(`AI description generation failed for file ${fileId}:`, error);
      // Don't fail the entire upload, just mark as completed without description
      await this.updateUploadFile(fileId, {
        status: "completed"
      });
    }
  }

}

export default new UploadService();