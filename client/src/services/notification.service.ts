import api from './api';

export interface SmartNotification {
  id: string;
  kind: 'DAILY_BRIEF' | 'WEEKLY_BRIEF' | string;
  title: string;
  message: string;
  priority: 'normal' | 'important' | string;
  scheduled_for: string;
  read_at: string | null;
  created_at: string;
}

export const notificationService = {
  async list(limit = 20) {
    const response = await api.get<{ data: SmartNotification[] }>('/assistant/notifications', { params: { limit } });
    return response.data.data;
  },
  async markRead(id: string) {
    await api.patch(`/assistant/notifications/${id}/read`);
  },
};
