import api from './api';
import type { ApiResponse, LoginPayload, RegisterPayload, UpdateProfilePayload, User, LoginResponse, RegisterResponse } from '@/types';

export const authService = {
  login(data: LoginPayload) { return api.post<ApiResponse<LoginResponse>>('/auth/login', data); },
  register(data: RegisterPayload) { return api.post<ApiResponse<RegisterResponse>>('/auth/register', data); },
  verifyEmail(token: string) { return api.get<ApiResponse<{ verified: boolean }>>(`/auth/verify-email?token=${encodeURIComponent(token)}`); },
  resendVerification(email: string) { return api.post<ApiResponse<{ sent: boolean }>>('/auth/resend-verification', { email }); },
  getMe() { return api.get<ApiResponse<User>>('/auth/me'); },
  updateMe(data: UpdateProfilePayload) { return api.put<ApiResponse<User>>('/auth/me', data); },
  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ApiResponse<User>>('/auth/me/avatar', formData);
  },
};
