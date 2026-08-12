import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Specialty,
  CreateSpecialtyPayload,
  PaginatedQuery,
} from '@/types';

export const specialtyService = {
  getAll(params?: PaginatedQuery & { search?: string }) {
    return api.get<PaginatedResponse<Specialty>>('/specialties', { params });
  },

  getById(id: string) {
    return api.get<ApiResponse<Specialty>>(`/specialties/${id}`);
  },

  create(data: CreateSpecialtyPayload) {
    return api.post<ApiResponse<Specialty>>('/specialties', data);
  },

  update(id: string, data: Partial<CreateSpecialtyPayload>) {
    return api.put<ApiResponse<Specialty>>(`/specialties/${id}`, data);
  },

  delete(id: string) {
    return api.delete<ApiResponse<null>>(`/specialties/${id}`);
  },
};
