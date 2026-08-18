import type { ReactNode } from 'react';
import { Empty } from 'antd';
interface Props { description?: ReactNode; image?: ReactNode; action?: ReactNode; className?: string; }
export default function EmptyState({ description = 'No data available', image, action, className = '' }: Props) { return <div className={`ds-empty-state ${className}`}><Empty image={image} description={description}>{action}</Empty></div>; }
