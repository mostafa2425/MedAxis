import {
  Card,
  Avatar,
  Button,
  Dropdown,
  Modal,
  Tooltip,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  SafetyCertificateOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { getInitials } from '@/utils/helpers';
import type { Nurse } from '@/types';

import './NurseCard.scss';

interface NurseCardProps {
  nurse: Nurse;
  onEdit: (nurse: Nurse) => void;
  onDelete: (id: string) => void;
}

export default function NurseCard({
  nurse,
  onEdit,
  onDelete,
}: NurseCardProps) {
  const { t } = useTranslation();

  const handleDelete = () => {
    Modal.confirm({
      title: t('nurses.deleteConfirm'),
      okText: t('common.yes'),
      cancelText: t('common.no'),
      okButtonProps: {
        danger: true,
      },
      centered: true,
      onOk: () => onDelete(nurse.id),
    });
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      danger: true,
      icon: <DeleteOutlined />,
      label: t('common.delete'),
      onClick: handleDelete,
    },
  ];

  return (
    <Card
      className="nurseCard"
      bordered={false}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div className="nurseCardInner">
        {/* =====================================================
            Header
            ===================================================== */}
        <div className="nurseCardHeader">
          <div className="nurseCardIdentity">
            <div className="nurseCardAvatarWrapper">
              <Avatar
                size={52}
                className="nurseCardAvatar"
              >
                {getInitials(nurse.name)}
              </Avatar>

              <span
                className={`nurseCardOnlineIndicator ${
                  nurse.isActive
                    ? 'nurseCardOnlineIndicator--active'
                    : 'nurseCardOnlineIndicator--inactive'
                }`}
              />
            </div>

            <div className="nurseCardIdentityContent">
              <h3 className="nurseCardName">
                {nurse.name}
              </h3>

              <span className="nurseCardRole">
                <SafetyCertificateOutlined />
                {t('nurses.role')}
              </span>
            </div>
          </div>

          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="nurseCardMoreButton"
              icon={<MoreOutlined />}
              aria-label={t('nav.more')}
            />
          </Dropdown>
        </div>

        {/* =====================================================
            Status
            ===================================================== */}
        <div
          className={`nurseCardStatus ${
            nurse.isActive
              ? 'nurseCardStatus--active'
              : 'nurseCardStatus--inactive'
          }`}
        >
          <span className="nurseCardStatusDot" />

          <span>
            {nurse.isActive
              ? t('common.active')
              : t('common.inactive')}
          </span>
        </div>

        {/* =====================================================
            Contact information
            ===================================================== */}
        <div className="nurseCardContacts">
          {nurse.phone && (
            <div className="nurseCardContact">
              <span className="nurseCardContactIcon">
                <PhoneOutlined />
              </span>

              <div className="nurseCardContactContent">
                <span className="nurseCardContactLabel">
                  {t('patients.mobile', 'Phone')}
                </span>

                <Tooltip title={nurse.phone}>
                  <span className="nurseCardContactValue">
                    {nurse.phone}
                  </span>
                </Tooltip>
              </div>
            </div>
          )}

          {nurse.email && (
            <div className="nurseCardContact">
              <span className="nurseCardContactIcon">
                <MailOutlined />
              </span>

              <div className="nurseCardContactContent">
                <span className="nurseCardContactLabel">
                  {t('common.email', 'Email')}
                </span>

                <Tooltip title={nurse.email}>
                  <span className="nurseCardContactValue">
                    {nurse.email}
                  </span>
                </Tooltip>
              </div>
            </div>
          )}

          {!nurse.phone && !nurse.email && (
            <div className="nurseCardNoContact">
              {t(
                'common.noContactInformation',
                'No contact information available',
              )}
            </div>
          )}
        </div>

        {/* =====================================================
            Footer actions
            ===================================================== */}
        <div className="nurseCardFooter">
          <Button
            type="text"
            className="nurseCardEditButton"
            icon={<EditOutlined />}
            onClick={() => onEdit(nurse)}
          >
            {t('common.edit')}
          </Button>

          <span className="nurseCardFooterArrow">
            <RightOutlined />
          </span>
        </div>
      </div>
    </Card>
  );
}