import uploadFilesData from "../mockData/uploadFiles.json";
import uploadSessionsData from "../mockData/uploadSessions.json";

class UploadService {
  constructor() {
    this.uploadFiles = [...uploadFilesData];
    this.uploadSessions = [...uploadSessionsData];
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
      error: null
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
}

export default new UploadService();