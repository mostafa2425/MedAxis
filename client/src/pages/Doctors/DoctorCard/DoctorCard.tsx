import { Card, Avatar, Tag, Button, Space, Dropdown, Modal } from 'antd';
import type { MenuProps } from 'antd';
import { PhoneOutlined, MailOutlined, EditOutlined, DeleteOutlined, MoreOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getInitials, getSpecialtyLabel } from '@/utils/helpers';
import { useAuthStore } from '@/stores/auth.store';
import type { Doctor } from '@/types';
import './DoctorCard.scss';

interface DoctorCardProps { doctor: Doctor; onEdit: (doctor: Doctor) => void; onDelete: (id: string) => void; }

export default function DoctorCard({ doctor, onEdit, onDelete }: DoctorCardProps) {
  const { t, i18n } = useTranslation();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isOwnProfile = Boolean(currentUserId && doctor.userId === currentUserId);
  const specialties = doctor.specialties ?? [];
  const primarySpecialty = specialties[0];
  const menuItems: MenuProps['items'] = isOwnProfile ? [] : [{ key: 'delete', danger: true, icon: <DeleteOutlined />, label: t('common.delete'), onClick: () => Modal.confirm({ title: t('doctors.deleteConfirm'), okText: t('common.yes'), cancelText: t('common.no'), okButtonProps: { danger: true }, onOk: () => onDelete(doctor.id) }) }];

  return (
    <Card className="doctorCard" size="small">
      <div className="doctorCardTop">
        <Avatar className="doctorCardAvatar" size={48} src={doctor.avatarUrl || undefined}>{!doctor.avatarUrl ? getInitials(doctor.name) : null}</Avatar>
        <Tag className="doctorCardStatus" color={doctor.isActive ? 'success' : 'default'}>{doctor.isActive ? t('common.active') : t('common.inactive')}</Tag>
      </div>
      <h3 className="doctorCardName">{doctor.name}</h3>
      {primarySpecialty && <p className="doctorCardSubtitle">{getSpecialtyLabel(primarySpecialty, i18n.language)}</p>}
      {isOwnProfile && <Tag color="blue" icon={<LockOutlined />}>{i18n.language.startsWith('ar') ? 'ملفك الشخصي' : 'Your profile'}</Tag>}
      <div className="doctorCardContacts">{doctor.phone && <span className="doctorCardMeta"><PhoneOutlined /> {doctor.phone}</span>}{doctor.email && <span className="doctorCardMeta"><MailOutlined /> {doctor.email}</span>}</div>
      {(specialties.length > 0 || (doctor.subspecialties ?? []).length > 0) && <div className="doctorCardTags">{specialties.map((specialty) => <Tag key={specialty.id} className="doctorCardTag">{getSpecialtyLabel(specialty, i18n.language)}</Tag>)}{(doctor.subspecialties ?? []).map((area) => <Tag key={area.id} className="doctorCardTag" color="blue">{getSpecialtyLabel(area, i18n.language)}</Tag>)}</div>}
      <div className="doctorCardActions">
        <Space size={4}>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(doctor)}>{t('common.edit')}</Button>
          {!isOwnProfile && <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight"><Button type="text" size="small" icon={<MoreOutlined />} aria-label={t('nav.more')} /></Dropdown>}
        </Space>
      </div>
    </Card>
  );
}
