import api from './api';
import { supabase } from '@/lib/supabase';
import type { ApiResponse, PaginatedResponse, Operation, CreateOperationPayload, UpdateOperationPayload, OperationFilters, OperationCost, OperationFile, OperationTimeline, OperationFollowUp, FollowUpStatus } from '@/types';

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

type UploadTicket = { path: string; token: string; signedUrl: string; expiresIn: number; fileName: string; mimeType: string; fileSize: number; fileType: string };
const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'clinical-files';

export interface GlobalFollowUp extends OperationFollowUp {
  operation: {
    id: string;
    name: string;
    operationDate: string;
    operationTime: string;
    patient: { id: string; fullName: string; mobile?: string | null };
    hospital: { id: string; name: string; nameAr?: string | null };
  };
}

export const operationService = {
  getAll(params?: OperationFilters) { return api.get<PaginatedResponse<Operation>>('/operations', { params }); },
  getById(id: string) { return api.get<ApiResponse<Operation>>(`/operations/${id}`); },
  create(data: CreateOperationPayload) { return api.post<ApiResponse<Operation>>('/operations', data); },
  update(id: string, data: UpdateOperationPayload) { return api.put<ApiResponse<Operation>>(`/operations/${id}`, data); },
  delete(id: string) { return api.delete<ApiResponse<null>>(`/operations/${id}`); },
  changeStatus(id: string, status: string) { return api.patch<ApiResponse<Operation>>(`/operations/${id}/status`, { status }); },
  updateCost(id: string, data: OperationCostBreakdownPayload) { return api.put<ApiResponse<OperationCost>>(`/operations/${id}/cost`, data); },
  getFollowUps(id: string) { return api.get<ApiResponse<OperationFollowUp[]>>(`/operations/${id}/follow-ups`); },
  getGlobalFollowUps(params?: { status?: FollowUpStatus; from?: string; to?: string }) {
    return api.get<ApiResponse<GlobalFollowUp[]>>('/operations/follow-ups', { params });
  },
  createFollowUp(id: string, data: { title: string; scheduledAt: string; notes?: string }) { return api.post<ApiResponse<OperationFollowUp>>(`/operations/${id}/follow-ups`, data); },
  updateFollowUp(id: string, followUpId: string, data: { title?: string; scheduledAt?: string; notes?: string | null; status?: FollowUpStatus }) { return api.patch<ApiResponse<OperationFollowUp>>(`/operations/${id}/follow-ups/${followUpId}`, data); },
  deleteFollowUp(id: string, followUpId: string) { return api.delete<ApiResponse<null>>(`/operations/${id}/follow-ups/${followUpId}`); },
  async uploadFiles(id: string, fileOrFormData: File | FormData, fileType?: string) {
    if (!supabase) throw new Error('Supabase client is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env.');

    let file: File;
    let resolvedFileType = fileType;

    if (fileOrFormData instanceof FormData) {
      const formFile = fileOrFormData.get('file');
      if (!(formFile instanceof File)) throw new Error('No file was provided for upload.');
      file = formFile;
      const formFileType = fileOrFormData.get('fileType');
      if (typeof formFileType === 'string' && formFileType) resolvedFileType = formFileType;
    } else {
      file = fileOrFormData;
    }

    if (!resolvedFileType) throw new Error('File type is required for upload.');

    const mimeType = file.type || 'application/octet-stream';
    const ticketResponse = await api.post<ApiResponse<UploadTicket>>(
      `/operations/${id}/files/upload-url`,
      {
        fileName: file.name,
        mimeType,
        fileSize: file.size,
        fileType: resolvedFileType,
      },
    );
    const ticket = ticketResponse.data.data;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .uploadToSignedUrl(ticket.path, ticket.token, file, {
        contentType: mimeType,
        cacheControl: '3600',
      });

    if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

    return api.post<ApiResponse<OperationFile>>(`/operations/${id}/files/complete`, {
      filePath: ticket.path,
      fileName: file.name,
      mimeType,
      fileSize: file.size,
      fileType: resolvedFileType,
    });
  },
  addExternalFile(id: string, data: { url: string; fileName: string; fileType: 'BEFORE_IMAGE' | 'AFTER_IMAGE' }) {
    return api.post<ApiResponse<OperationFile>>(`/operations/${id}/files/external`, data);
  },
  deleteFile(id: string, fileId: string) { return api.delete<ApiResponse<null>>(`/operations/${id}/files/${fileId}`); },
  getTimeline(id: string) { return api.get<ApiResponse<OperationTimeline[]>>(`/operations/${id}/timeline`); },
};
