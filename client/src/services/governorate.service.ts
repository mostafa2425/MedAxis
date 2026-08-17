import api from './api';
import type { ApiResponse } from '@/types';

export interface Governorate {
  id: string;
  nameEn: string;
  nameAr: string;
  code: string;
  isActive: boolean;
}

export const governorateService = {
  getAll() {
    return api.get<ApiResponse<Governorate[]>>('/governorates');
  },
};
