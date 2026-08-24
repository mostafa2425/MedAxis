import type { ReactNode } from 'react';
import { Card } from 'antd';
interface Props { title?: ReactNode; extra?: ReactNode; children: ReactNode; className?: string; }
export default function InfoCard({ title, extra, children, className = '' }: Props) { return <Card title={title} extra={extra} className={`ds-info-card ${className}`} bordered>{children}</Card>; }
