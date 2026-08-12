import api from './api';
import type {
  ApiResponse,
  Operation,
  DashboardStats,
  SpecialtyDistribution,
  MonthlyTrend,
} from '@/types';

export const dashboardService = {
  getStats() {
    return api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  },

  getRecentOperations() {
    return api.get<ApiResponse<Operation[]>>('/dashboard/recent-operations');
  },

  getSpecialtyDistribution() {
    return api.get<ApiResponse<SpecialtyDistribution[]>>(
      '/dashboard/specialty-distribution',
    );
  },

  getMonthlyTrends() {
    return api.get<ApiResponse<MonthlyTrend[]>>('/dashboard/monthly-trends');
  },

  getRevenue() {
    return api.get<ApiResponse<{ total: number; paid: number; pending: number }>>(
      '/dashboard/revenue',
    );
  },
};
