import { Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function PatientsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <div className="page-header__title-group">
          <h1 className="page-header__title">{t('patients.title')}</h1>
        </div>
      </div>
      <div className="empty-state">
        <UserOutlined className="empty-state__icon" />
        <Title level={4} className="empty-state__title">{t('patients.noPatients')}</Title>
        <Paragraph className="empty-state__description">{t('common.noData')}</Paragraph>
      </div>
    </div>
  );
}