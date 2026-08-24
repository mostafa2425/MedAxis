import type { ReactNode } from 'react';
import { Button, Flex, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './DesignSystem.scss';

interface Props { title: ReactNode; meta?: ReactNode; actions?: ReactNode; onBack?: () => void; backLabel?: string; }
export default function PageHeader({ title, meta, actions, onBack, backLabel }: Props) {
  return <header className="ds-page-header">
    <div className="ds-page-header__main">
      {onBack && <Button className="backBtn" icon={<ArrowLeftOutlined />} onClick={onBack} aria-label={backLabel ?? 'Back'} />}
      <div className="ds-page-header__info">
        <Typography.Title level={3} className="ds-page-header__title" ellipsis={{ tooltip: typeof title === 'string' ? title : undefined }}>{title}</Typography.Title>
        {meta && <div className="ds-page-header__meta">{meta}</div>}
      </div>
    </div>
    {actions && <Flex className="ds-page-header__actions">{actions}</Flex>}
  </header>;
}
