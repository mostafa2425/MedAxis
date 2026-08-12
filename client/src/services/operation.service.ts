import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Operation,
  CreateOperationPayload,
  UpdateOperationPayload,
  OperationFilters,
  OperationCost,
  OperationFile,
  OperationTimeline,
} from '@/types';

export const operationService = {
  getAll(params?: OperationFilters) {
    return api.get<PaginatedResponse<Operation>>('/operations', { params });
  },

  getById(id: string) {
    return api.get<ApiResponse<Operation>>(`/operations/${id}`);
  },

  create(data: CreateOperationPayload) {
    return api.post<ApiResponse<Operation>>('/operations', data);
  },

  update(id: string, data: UpdateOperationPayload) {
    return api.put<ApiResponse<Operation>>(`/operations/${id}`, data);
  },

  delete(id: string) {
    return api.delete<ApiResponse<null>>(`/operations/${id}`);
  },

  changeStatus(id: string, status: string) {
    return api.patch<ApiResponse<Operation>>(`/operations/${id}/status`, { status });
  },

  updateCost(id: string, data: Partial<Pick<OperationCost, 'totalCost' | 'paidAmount' | 'paymentMethod' | 'paymentStatus' | 'paymentNotes'>>) {
    return api.put<ApiResponse<OperationCost>>(`/operations/${id}/cost`, data);
  },

  uploadFiles(id: string, formData: FormData) {
    return api.post<ApiResponse<OperationFile>>(`/operations/${id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteFile(id: string, fileId: string) {
    return api.delete<ApiResponse<null>>(`/operations/${id}/files/${fileId}`);
  },

  getTimeline(id: string) {
    return api.get<ApiResponse<OperationTimeline[]>>(`/operations/${id}/timeline`);
  },
};
