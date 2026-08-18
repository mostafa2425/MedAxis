import { Tag } from 'antd';
import type { ReactNode } from 'react';

const colors: Record<string, string> = { scheduled: 'blue', checked_in: 'cyan', in_progress: 'purple', completed: 'green', cancelled: 'red', no_show: 'orange', active: 'green', inactive: 'default' };
interface Props { status?: string | null; label?: ReactNode; color?: string; }
export default function StatusTag({ status, label, color }: Props) { const key = String(status ?? '').toLowerCase().replace(/\s+/g, '_'); return <Tag color={color ?? colors[key]}>{label ?? status ?? '—'}</Tag>; }
