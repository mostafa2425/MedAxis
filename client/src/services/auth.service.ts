import api from './api';
import type { ApiResponse, LoginPayload, RegisterPayload, User, LoginResponse } from '@/types';

export const authService = {
  login(data: LoginPayload) {
    return api.post<ApiResponse<LoginResponse>>('/auth/login', data);
  },

  register(data: RegisterPayload) {
    return api.post<ApiResponse<LoginResponse>>('/auth/register', data);
  },

  getMe() {
    return api.get<ApiResponse<User>>('/auth/me');
  },
};
