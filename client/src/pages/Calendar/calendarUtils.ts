import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import { OperationStatus, type Operation } from '@/types';
import { formatTime, getStatusColor } from '@/utils/helpers';
import { OPERATION_STATUSES } from '@/utils/constants';

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export interface CalendarFilters {
  status?: OperationStatus;
  hospitalId?: string;
  specialtyId?: string;
  doctorId?: string;
}

export function parseOperationDateTime(operation: Operation): Dayjs {
  const datePart = String(operation.operationDate ?? '').slice(0, 10);
  const timePart = String(operation.operationTime ?? '00:00').slice(0, 5);
  const parsed = dayjs(`${datePart} ${timePart}`, 'YYYY-MM-DD HH:mm', true);
  if (parsed.isValid()) return parsed;
  return dayjs(`${datePart} 00:00`, 'YYYY-MM-DD HH:mm');
}

export function getOperationDateKey(operation: Operation): string {
  return String(operation.operationDate ?? '').slice(0, 10);
}

export function getVisibleRange(view: CalendarView, current: Dayjs, locale = 'en'): { from: Dayjs; to: Dayjs } {
  const localized = current.locale(locale.startsWith('ar') ? 'ar' : 'en');
  if (view === 'week') {
    return { from: localized.startOf('week'), to: localized.endOf('week') };
  }
  if (view === 'day') {
    return { from: localized.startOf('day'), to: localized.endOf('day') };
  }
  const monthStart = localized.startOf('month');
  const monthEnd = localized.endOf('month');
  if (view === 'month') {
    return { from: monthStart.startOf('week'), to: monthEnd.endOf('week') };
  }
  return { from: monthStart, to: monthEnd };
}

export function toDateParam(value: Dayjs, bound: 'start' | 'end'): string {
  return bound === 'start'
    ? value.startOf('day').toISOString()
    : value.endOf('day').toISOString();
}

export function shiftPeriod(view: CalendarView, current: Dayjs, direction: -1 | 1): Dayjs {
  if (view === 'week') return current.add(direction, 'week');
  if (view === 'day') return current.add(direction, 'day');
  return current.add(direction, 'month');
}

export function formatPeriodLabel(view: CalendarView, current: Dayjs, locale: string): string {
  const localized = current.locale(locale.startsWith('ar') ? 'ar' : 'en');
  if (view === 'day') {
    return localized.format('dddd, D MMMM YYYY');
  }
  if (view === 'week') {
    const from = localized.startOf('week');
    const to = localized.endOf('week');
    if (from.month() === to.month() && from.year() === to.year()) {
      return `${from.format('D')} – ${to.format('D MMM YYYY')}`;
    }
    if (from.year() === to.year()) {
      return `${from.format('D MMM')} – ${to.format('D MMM YYYY')}`;
    }
    return `${from.format('D MMM YYYY')} – ${to.format('D MMM YYYY')}`;
  }
  return localized.format('MMMM YYYY');
}

export function groupOperationsByDate(operations: Operation[]): Map<string, Operation[]> {
  const grouped = new Map<string, Operation[]>();
  const sorted = [...operations].sort((a, b) => {
    const byDate = getOperationDateKey(a).localeCompare(getOperationDateKey(b));
    if (byDate !== 0) return byDate;
    return String(a.operationTime ?? '').localeCompare(String(b.operationTime ?? ''));
  });

  for (const operation of sorted) {
    const key = getOperationDateKey(operation);
    if (!key) continue;
    const existing = grouped.get(key);
    if (existing) existing.push(operation);
    else grouped.set(key, [operation]);
  }

  return grouped;
}

export function operationHasDoctor(operation: Operation, doctorId: string): boolean {
  if (operation.medicalTeam) {
    const ids = [
      operation.medicalTeam.primarySurgeonId,
      operation.medicalTeam.assistantSurgeonId,
      operation.medicalTeam.anesthesiologistId,
      operation.medicalTeam.assistantAnesthesiaId,
    ];
    if (ids.includes(doctorId)) return true;
  }
  return Boolean(operation.teamMembers?.some((member) => member.doctorId === doctorId));
}

export function applyCalendarFilters(
  operations: Operation[],
  filters: CalendarFilters,
): Operation[] {
  return operations.filter((operation) => {
    if (filters.status && operation.status !== filters.status) return false;
    if (filters.hospitalId && operation.hospitalId !== filters.hospitalId) return false;
    if (filters.specialtyId && operation.specialtyId !== filters.specialtyId) return false;
    if (filters.doctorId && !operationHasDoctor(operation, filters.doctorId)) return false;
    return true;
  });
}

export function getPrimarySurgeonName(operation: Operation): string | null {
  return (
    operation.medicalTeam?.primarySurgeon?.name ??
    operation.teamMembers?.find((member) => member.doctor)?.doctor?.name ??
    null
  );
}

export function getStatusBg(status: OperationStatus): string {
  return (
    OPERATION_STATUSES.find((item) => item.value === status)?.bg ??
    'rgba(148,163,184,0.1)'
  );
}

export function getStatusStyle(status: OperationStatus): { color: string; background: string } {
  return {
    color: getStatusColor(status),
    background: getStatusBg(status),
  };
}

export function getStatusLabelKey(status: OperationStatus): string {
  const keys: Record<OperationStatus, string> = {
    [OperationStatus.Scheduled]: 'operations.scheduled',
    [OperationStatus.CheckedIn]: 'operations.checkedIn',
    [OperationStatus.InProgress]: 'operations.inProgress',
    [OperationStatus.Completed]: 'operations.completed',
    [OperationStatus.Cancelled]: 'operations.cancelled',
    [OperationStatus.NoShow]: 'operations.noShow',
  };
  return keys[status] ?? 'operations.status';
}

export function isUpcomingStatus(status: OperationStatus): boolean {
  return (
    status === OperationStatus.Scheduled ||
    status === OperationStatus.CheckedIn ||
    status === OperationStatus.InProgress
  );
}

export function formatEventTime(operation: Operation): string {
  return formatTime(String(operation.operationTime ?? ''));
}

export function getUpcomingHorizon(locale = 'en'): { from: Dayjs; to: Dayjs } {
  const today = dayjs().locale(locale.startsWith('ar') ? 'ar' : 'en');
  const weekEnd = today.endOf('week');
  const sevenDays = today.add(6, 'day').endOf('day');
  return {
    from: today.startOf('day'),
    to: weekEnd.isAfter(sevenDays) ? weekEnd : sevenDays,
  };
}
