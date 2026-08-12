import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Doctor,
  CreateDoctorPayload,
  PaginatedQuery,
} from '@/types';

export const doctorService = {
  getAll(params?: PaginatedQuery & { search?: string; specialtyId?: string; isActive?: boolean }) {
    return api.get<PaginatedResponse<Doctor>>('/doctors', { params });
  },

  getById(id: string) {
    return api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
  },

  create(data: CreateDoctorPayload) {
    return api.post<ApiResponse<Doctor>>('/doctors', data);
  },

  update(id: string, data: Partial<CreateDoctorPayload>) {
    return api.put<ApiResponse<Doctor>>(`/doctors/${id}`, data);
  },

  delete(id: string) {
    return api.delete<ApiResponse<null>>(`/doctors/${id}`);
  },

  getActive() {
    return api.get<ApiResponse<Doctor[]>>('/doctors', {
      params: { isActive: true, limit: 100 },
    });
  },
};
