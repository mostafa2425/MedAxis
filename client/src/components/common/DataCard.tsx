import type { ReactNode } from 'react';
interface Props { label: ReactNode; value: ReactNode; icon?: ReactNode; highlight?: boolean; className?: string; }
export default function DataCard({ label, value, icon, highlight, className = '' }: Props) { return <div className={`ds-data-card ${highlight ? 'ds-data-card--highlight' : ''} ${className}`}><span className="ds-data-card__label">{icon}{label}</span><span className="ds-data-card__value">{value}</span></div>; }
