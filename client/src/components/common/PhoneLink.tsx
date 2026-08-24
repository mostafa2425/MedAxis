import { Button, Typography } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import './DesignSystem.scss';

export const normalizePhone = (value: string) => value.replace(/[^\d+]/g, '');
interface Props { value?: string | null; showIcon?: boolean; }
export default function PhoneLink({ value, showIcon = true }: Props) { if (!value) return <Typography.Text type="secondary">—</Typography.Text>; return <Button type="link" size="small" className="ds-phone-link" icon={showIcon ? <PhoneOutlined /> : undefined} href={`tel:${normalizePhone(value)}`}>{value}</Button>; }
