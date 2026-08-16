import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ar';
import 'dayjs/locale/en';
import i18n from '@/i18n';
import { OperationStatus, PaymentStatus } from '@/types';

dayjs.extend(customParseFormat);

function currentLocale(): 'ar' | 'en' {
  return i18n.language?.startsWith('ar') ? 'ar' : 'en';
}

function parseClockTime(time: string) {
  const clock = String(time).slice(0, 5);
  return dayjs(clock, 'HH:mm', true);
}

export function formatCurrency(amount: number, currency = 'EGP'): string {
  const formatted = Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${currency}`;
}

export function resolveMediaUrl(url?: string | null, filePath?: string | null): string {
  const raw = url || filePath || '';
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  const apiBase = import.meta.env.VITE_API_URL || '';
  const origin = String(apiBase).replace(/\/api\/?$/, '');
  const normalized = raw.replace(/\\/g, '/');
  const path = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `${origin}${path}`;
}

export function isBeforeFileType(fileType: string): boolean {
  return fileType.startsWith('BEFORE_');
}

export function isAfterFileType(fileType: string): boolean {
  return fileType.startsWith('AFTER_');
}

export function resolvePaidAmount(total: number, paid: number, status: PaymentStatus): number {
  if (status === PaymentStatus.Paid) return Math.max(0, total);
  if (status === PaymentStatus.Unpaid) return 0;
  return Math.min(Math.max(0, paid), Math.max(0, total));
}

// ──────────────────────────────────────────────
// Format date
// ──────────────────────────────────────────────
export function formatDate(date: string | Date, format = 'DD/MM/YYYY'): string {
  if (!date) return '—';
  const parsed = dayjs(date);
  if (!parsed.isValid()) return '—';
  return parsed.locale(currentLocale()).format(format);
}

export function formatOperationDate(date: string | Date, format = 'DD/MM/YYYY'): string {
  if (!date) return '—';
  const raw = typeof date === 'string' ? String(date).slice(0, 10) : date;
  const parsed = dayjs(raw);
  if (!parsed.isValid()) return '—';
  return parsed.locale(currentLocale()).format(format);
}

export function formatTime(time: string, format?: string): string {
  if (!time) return '—';
  const parsed = parseClockTime(time);
  if (!parsed.isValid()) return '—';
  return parsed.locale(currentLocale()).format(format ?? 'h:mm A');
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

export function getSpecialtyLabel(
  specialty: { name: string; nameAr?: string | null },
  language: string,
): string {
  return language.startsWith('ar') && specialty.nameAr ? specialty.nameAr : specialty.name;
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
