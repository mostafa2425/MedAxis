import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Hospital,
  CreateHospitalPayload,
  PaginatedQuery,
} from '@/types';

export const hospitalService = {
  getAll(params?: PaginatedQuery & { search?: string; isActive?: boolean }) {
    return api.get<PaginatedResponse<Hospital>>('/hospitals', { params });
  },

  getById(id: string) {
    return api.get<ApiResponse<Hospital>>(`/hospitals/${id}`);
  },

  create(data: CreateHospitalPayload) {
    return api.post<ApiResponse<Hospital>>('/hospitals', data);
  },

  update(id: string, data: Partial<CreateHospitalPayload>) {
    return api.put<ApiResponse<Hospital>>(`/hospitals/${id}`, data);
  },

  delete(id: string) {
    return api.delete<ApiResponse<null>>(`/hospitals/${id}`);
  },

  getActive() {
    return api.get<ApiResponse<Hospital[]>>('/hospitals', {
      params: { isActive: true, limit: 100 },
    });
  },
};
