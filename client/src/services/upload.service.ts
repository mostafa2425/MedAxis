import api from './api';
import type { ApiResponse } from '@/types';

interface UploadResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export const uploadService = {
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<ApiResponse<UploadResult>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
