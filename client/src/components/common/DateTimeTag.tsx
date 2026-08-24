import { Tag } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
interface Props { date: ReactNode; time?: ReactNode; color?: string; }
export default function DateTimeTag({ date, time, color = 'blue' }: Props) { return <Tag color={color} icon={<CalendarOutlined />}>{date}{time ? ` · ${time}` : ''}</Tag>; }
