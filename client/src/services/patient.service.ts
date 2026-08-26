import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Patient,
  CreatePatientPayload,
  UpdatePatientPayload,
  PaginatedQuery,
} from '@/types';

export const patientService = {
  getAll(params?: PaginatedQuery & { search?: string; gender?: string; surgicalProcedureId?: string }) {
    return api.get<PaginatedResponse<Patient>>('/patients', { params });
  },

  getById(id: string) {
    return api.get<ApiResponse<Patient>>(`/patients/${id}`);
  },

  create(data: CreatePatientPayload) {
    return api.post<ApiResponse<Patient>>('/patients', data);
  },

  update(id: string, data: UpdatePatientPayload) {
    return api.put<ApiResponse<Patient>>(`/patients/${id}`, data);
  },

  delete(id: string) {
    return api.delete<ApiResponse<null>>(`/patients/${id}`);
  },

  search(query: string, limit = 10) {
    return api.get<PaginatedResponse<Patient>>('/patients', {
      params: { search: query || undefined, limit },
    });
  },
};
