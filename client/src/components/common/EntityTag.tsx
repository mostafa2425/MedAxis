import { Tag } from 'antd';
import type { TagProps } from 'antd';

const COLOR_MAP: Record<string, TagProps['color']> = {
  SCHEDULED: 'blue',
  IN_PROGRESS: 'processing',
  COMPLETED: 'success',
  CANCELLED: 'error',
  PAID: 'success',
  UNPAID: 'error',
  PARTIAL: 'warning',
  BEFORE: 'cyan',
  DURING: 'purple',
  AFTER: 'green',
  ACTIVE: 'success',
  INACTIVE: 'default',
};

interface Props { value: string; label?: string; color?: TagProps['color']; }

export function EntityTag({ value, label, color }: Props) {
  return <Tag color={color ?? COLOR_MAP[value] ?? 'default'}>{label ?? value.replaceAll('_', ' ')}</Tag>;
}
