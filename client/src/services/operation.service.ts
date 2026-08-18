import api from './api';
import type { ApiResponse, PaginatedResponse, Operation, CreateOperationPayload, UpdateOperationPayload, OperationFilters, OperationCost, OperationFile, OperationTimeline } from '@/types';

export interface OperationCostBreakdownPayload {
  totalCost: number;
  paidAmount?: number;
  hospitalCost?: number;
  nursingCost?: number;
  assistantDoctorsCost?: number;
  equipmentCost?: number;
  otherCost?: number;
  paymentMethod?: OperationCost['paymentMethod'];
  paymentStatus?: OperationCost['paymentStatus'];
  paymentNotes?: string;
}

type UploadTicket = {
  path: string;
  token: string;
  signedUrl: string;
  expiresIn: number;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileType: string;
};

export const operationService = {
  getAll(params?: OperationFilters) { return api.get<PaginatedResponse<Operation>>('/operations', { params }); },
  getById(id: string) { return api.get<ApiResponse<Operation>>(`/operations/${id}`); },
  create(data: CreateOperationPayload) { return api.post<ApiResponse<Operation>>('/operations', data); },
  update(id: string, data: UpdateOperationPayload) { return api.put<ApiResponse<Operation>>(`/operations/${id}`, data); },
  delete(id: string) { return api.delete<ApiResponse<null>>(`/operations/${id}`); },
  changeStatus(id: string, status: string) { return api.patch<ApiResponse<Operation>>(`/operations/${id}/status`, { status }); },
  updateCost(id: string, data: OperationCostBreakdownPayload) { return api.put<ApiResponse<OperationCost>>(`/operations/${id}/cost`, data); },
  async uploadFiles(id: string, file: File, fileType: string) {
    const ticketResponse = await api.post<ApiResponse<UploadTicket>>(`/operations/${id}/files/upload-url`, {
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileSize: file.size,
      fileType,
    });
    const ticket = ticketResponse.data.data;
    const uploadResponse = await fetch(ticket.signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!uploadResponse.ok) throw new Error(`Storage upload failed (${uploadResponse.status})`);

    return api.post<ApiResponse<OperationFile>>(`/operations/${id}/files/complete`, {
      filePath: ticket.path,
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileSize: file.size,
      fileType,
    });
  },
  deleteFile(id: string, fileId: string) { return api.delete<ApiResponse<null>>(`/operations/${id}/files/${fileId}`); },
  getTimeline(id: string) { return api.get<ApiResponse<OperationTimeline[]>>(`/operations/${id}/timeline`); },
};
