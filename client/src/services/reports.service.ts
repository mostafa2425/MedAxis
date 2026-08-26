import api from './api';

export type ReportType = 'operations' | 'patients' | 'follow-ups' | 'financial' | 'hospitals' | 'procedures';

export type ReportFilters = {
  dateFrom?: string;
  dateTo?: string;
  hospitalId?: string;
  specialtyId?: string;
  status?: string;
  paymentStatus?: string;
};

export const reportsService = {
  get(type: ReportType, filters: ReportFilters = {}) {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    return api.get(`/reports/${type}`, { params });
  },
};
