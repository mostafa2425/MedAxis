import { PlusOutlined, ScissorOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './QuickActionFab.scss';

export default function QuickActionFab() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Tooltip title={t('operations.addOperation')} placement="left">
      <button
        type="button"
        className="medaxis-quick-fab"
        onClick={() => navigate('/operations/new')}
        aria-label={t('operations.addOperation')}
      >
        <PlusOutlined className="medaxis-quick-fab-plus" />
        <span className="medaxis-quick-fab-icon"><ScissorOutlined /></span>
      </button>
    </Tooltip>
  );
}
