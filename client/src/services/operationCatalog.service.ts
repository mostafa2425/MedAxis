import api from './api';
import type { ApiResponse, OperationCatalogItem } from '@/types';

export const operationCatalogService = {
  getAll() {
    return api.get<ApiResponse<OperationCatalogItem[]>>('/operation-catalog');
  },

  getUsed() {
    return api.get<ApiResponse<OperationCatalogItem[]>>('/operation-catalog/used');
  },

  createCustom(name: string) {
    return api.post<ApiResponse<OperationCatalogItem>>('/operation-catalog', { name });
  },
};
