import { Card, Avatar, Tag, Button, Space, Dropdown, Modal } from 'antd';
import type { MenuProps } from 'antd';
import { PhoneOutlined, MailOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getInitials } from '@/utils/helpers';
import type { Nurse } from '@/types';
import './DoctorCard/DoctorCard.scss';

interface NurseCardProps {
  nurse: Nurse;
  onEdit: (nurse: Nurse) => void;
  onDelete: (id: string) => void;
}

export default function NurseCard({ nurse, onEdit, onDelete }: NurseCardProps) {
  const { t } = useTranslation();

  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      danger: true,
      icon: <DeleteOutlined />,
      label: t('common.delete'),
      onClick: () => {
        Modal.confirm({
          title: t('nurses.deleteConfirm'),
          okText: t('common.yes'),
          cancelText: t('common.no'),
          okButtonProps: { danger: true },
          onOk: () => onDelete(nurse.id),
        });
      },
    },
  ];

  return (
    <Card className="doctorCard" size="small">
      <div className="doctorCardTop">
        <Avatar className="doctorCardAvatar" size={48}>
          {getInitials(nurse.name)}
        </Avatar>
        <Tag className="doctorCardStatus" color={nurse.isActive ? 'success' : 'default'}>
          {nurse.isActive ? t('common.active') : t('common.inactive')}
        </Tag>
      </div>
      <h3 className="doctorCardName">{nurse.name}</h3>
      <p className="doctorCardSubtitle">{t('nurses.role')}</p>
      <div className="doctorCardContacts">
        {nurse.phone && (
          <span className="doctorCardMeta">
            <PhoneOutlined /> {nurse.phone}
          </span>
        )}
        {nurse.email && (
          <span className="doctorCardMeta">
            <MailOutlined /> {nurse.email}
          </span>
        )}
      </div>
      <div className="doctorCardActions">
        <Space size={4}>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(nurse)}>
            {t('common.edit')}
          </Button>
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button type="text" size="small" icon={<MoreOutlined />} aria-label={t('nav.more')} />
          </Dropdown>
        </Space>
      </div>
    </Card>
  );
}
