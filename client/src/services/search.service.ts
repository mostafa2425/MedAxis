import api from './api';
import type { ApiResponse, SearchFilters } from '@/types';

interface SearchResultPatient {
  id: string;
  fullName: string;
  mobile: string;
  gender: string;
}

interface SearchResultOperation {
  id: string;
  name: string;
  status: string;
  operationDate: string;
  operationTime?: string;
  patient?: {
    id: string;
    fullName: string;
  };
}

interface SearchResultDoctor {
  id: string;
  name: string;
  phone: string | null;
  specialties?: {
    id: string;
    name: string;
    nameAr?: string | null;
  }[];
}

interface SearchResultHospital {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
}

export interface SearchResult {
  patients: SearchResultPatient[];
  operations: SearchResultOperation[];
  doctors: SearchResultDoctor[];
  hospitals: SearchResultHospital[];
}

export const searchService = {
  globalSearch(params: SearchFilters) {
    return api.get<ApiResponse<SearchResult>>('/search', {
      params,
    });
  },
};
