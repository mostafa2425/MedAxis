import api from './api';

export interface AssistantOperation {
  id: string;
  name: string;
  operationDate: string;
  operationTime: string;
  operationRoom?: string | null;
  status: string;
  patient?: { id: string; fullName: string } | null;
  hospital?: { id: string; name: string } | null;
}

export interface AssistantFollowUp {
  id: string;
  title: string;
  scheduledAt: string;
  status: string;
  operation: { id: string; name: string; patient: { id: string; fullName: string } };
}

export interface AssistantBrief {
  type: 'daily' | 'weekly';
  range: { from: string; to: string };
  summary: { operations: number; followUps: number; overdueFollowUps: number; paymentDue: number; attention: number };
  operations: AssistantOperation[];
  followUps: AssistantFollowUp[];
  attention: {
    missingInformation: Array<{ id: string; title: string; operationName: string; patientName: string; hospitalName: string }>;
    overdueFollowUps: Array<{ id: string; title: string; scheduledAt: string; operation: { id: string; patient: { fullName: string } } }>;
    paymentDue: Array<{ operationId: string; remainingAmount: string | number; operation: { name: string; patient: { fullName: string } } }>;
  };
}

const getLocalDayRange = (daysFromToday: number, daysLength: number) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + daysFromToday);
  const end = new Date(start);
  end.setDate(end.getDate() + daysLength);
  return { start: start.toISOString(), end: end.toISOString() };
};

export const assistantService = {
  async getDailyBrief() {
    const range = getLocalDayRange(1, 1);
    const response = await api.get<{ data: AssistantBrief }>('/assistant/brief', { params: { type: 'daily', start: range.start, end: range.end } });
    return response.data.data;
  },
  async getWeeklyBrief() {
    const range = getLocalDayRange(1, 7);
    const response = await api.get<{ data: AssistantBrief }>('/assistant/brief', { params: { type: 'weekly', start: range.start, end: range.end } });
    return response.data.data;
  },
};
