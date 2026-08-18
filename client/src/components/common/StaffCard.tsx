import { Avatar, Card, Flex, Tag, Typography } from 'antd';
import { getInitials } from '@/utils/helpers';
import PhoneLink from './PhoneLink';
import './DesignSystem.scss';
interface Props { name: string; role: string; subtitle?: string; phone?: string; }
export default function StaffCard({ name, role, subtitle, phone }: Props) { return <Card size="small" className="ds-staff-card"><Flex align="center" gap={12}><Avatar size={44} className="ds-staff-card__avatar">{getInitials(name)}</Avatar><Flex vertical gap={2} className="ds-staff-card__meta"><Typography.Text strong ellipsis>{name}</Typography.Text><Tag style={{ width: 'fit-content', margin: 0 }}>{role}</Tag>{subtitle && <Typography.Text type="secondary" ellipsis>{subtitle}</Typography.Text>}{phone && <PhoneLink value={phone} />}</Flex></Flex></Card>; }
