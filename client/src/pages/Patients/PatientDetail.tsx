import { useParams } from 'react-router-dom';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <div className="page-header__title-group">
          <h1 className="page-header__title">{t('patients.patientDetails')}</h1>
          <span className="page-header__subtitle">ID: {id}</span>
        </div>
      </div>
      <div style={{ padding: 24 }}>{t('common.noData')}</div>
    </div>
  );
}
