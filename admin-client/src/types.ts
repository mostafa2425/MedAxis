export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
}

export interface AdminOverview {
  users: number;
  doctors: number;
  patients: number;
  operations: number;
  hospitals: number;
  activeUsers: number;
  activeDoctors: number;
  activeHospitals: number;
  revenue: {
    totalCost: string | number;
    totalPaid: string | number;
    totalRemaining: string | number;
  };
}
