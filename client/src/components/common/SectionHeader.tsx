import type { ReactNode } from 'react';
import { Flex, Typography } from 'antd';
interface Props { title: ReactNode; description?: ReactNode; extra?: ReactNode; icon?: ReactNode; }
export default function SectionHeader({ title, description, extra, icon }: Props) { return <div className="ds-section-header"><div><Flex align="center" gap={8}>{icon}<Typography.Title level={4} className="ds-section-header__title">{title}</Typography.Title></Flex>{description && <Typography.Text type="secondary">{description}</Typography.Text>}</div>{extra}</div>; }
