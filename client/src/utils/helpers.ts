import dayjs from 'dayjs';
import { OperationStatus, PaymentStatus } from '@/types';

// ──────────────────────────────────────────────
// Format currency (SAR)
// ──────────────────────────────────────────────
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} SAR`;
}

// ──────────────────────────────────────────────
// Format date
// ──────────────────────────────────────────────
export function formatDate(date: string | Date, format = 'DD/MM/YYYY'): string {
  if (!date) return '—';
  return dayjs(date).format(format);
}

// ──────────────────────────────────────────────
// Format time
// ──────────────────────────────────────────────
export function formatTime(time: string, format = 'HH:mm'): string {
  if (!time) return '—';
  return dayjs(time, 'HH:mm').format(format);
}

// ──────────────────────────────────────────────
// Get operation status color
// ──────────────────────────────────────────────
export function getStatusColor(status: OperationStatus): string {
  const colors: Record<OperationStatus, string> = {
    [OperationStatus.Scheduled]: '#2563EB',
    [OperationStatus.CheckedIn]: '#14B8A6',
    [OperationStatus.InProgress]: '#7C3AED',
    [OperationStatus.Completed]: '#16A34A',
    [OperationStatus.Cancelled]: '#DC2626',
    [OperationStatus.NoShow]: '#F97316',
  };
  return colors[status] || '#94A3B8';
}

// ──────────────────────────────────────────────
// Get payment status color
// ──────────────────────────────────────────────
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    [PaymentStatus.Paid]: '#16A34A',
    [PaymentStatus.Unpaid]: '#DC2626',
    [PaymentStatus.Partial]: '#F59E0B',
  };
  return colors[status] || '#94A3B8';
}

// ──────────────────────────────────────────────
// Get initials from name
// ──────────────────────────────────────────────
export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ──────────────────────────────────────────────
// Calculate remaining amount
// ──────────────────────────────────────────────
export function calculateRemaining(total: number, paid: number): number {
  return Math.max(0, total - paid);
}

// ──────────────────────────────────────────────
// Get greeting based on time of day
// ──────────────────────────────────────────────
export function getGreeting(): string {
  const hour = dayjs().hour();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
