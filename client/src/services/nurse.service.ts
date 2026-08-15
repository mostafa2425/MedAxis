import api from './api';
import type { ApiResponse, PaginatedResponse, Nurse, PaginatedQuery } from '@/types';

export interface CreateNursePayload {
  name: string;
  phone?: string;
  email?: string;
}

export const nurseService = {
  getAll(params?: PaginatedQuery & { search?: string }) {
    return api.get<PaginatedResponse<Nurse>>('/nurses', { params });
  },

  getActive() {
    return api.get<ApiResponse<Nurse[]>>('/nurses/active');
  },

  create(data: CreateNursePayload) {
    return api.post<ApiResponse<Nurse>>('/nurses', data);
  },

  update(id: string, data: Partial<CreateNursePayload>) {
    return api.put<ApiResponse<Nurse>>(`/nurses/${id}`, data);
  },

  delete(id: string) {
    return api.delete<ApiResponse<null>>(`/nurses/${id}`);
  },
};
