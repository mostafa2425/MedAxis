import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

export default function NewPatientPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <div className="page-header__title-group">
          <h1 className="page-header__title">{t('patients.addPatient')}</h1>
        </div>
      </div>
      <div style={{ padding: 24 }}>{t('common.noData')}</div>
    </div>
  );
}
