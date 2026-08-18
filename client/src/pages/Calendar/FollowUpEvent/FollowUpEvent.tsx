import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { GlobalFollowUp } from '@/services/operation.service';
import './FollowUpEvent.scss';

interface FollowUpEventProps {
  followUp: GlobalFollowUp;
  compact?: boolean;
}

export default function FollowUpEvent({ followUp, compact = false }: FollowUpEventProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language.startsWith('ar');
  const overdue = followUp.status === 'OVERDUE';
  const completed = followUp.status === 'COMPLETED';
  const label = `${followUp.title} · ${followUp.operation.patient.fullName}`;

  return (
    <Tooltip title={label}>
      <button
        type="button"
        className={`calendar-follow-up-event ${overdue ? 'is-overdue' : ''} ${completed ? 'is-completed' : ''} ${compact ? 'is-compact' : ''}`}
        onClick={() => navigate(`/operations/${followUp.operation.id}`)}
      >
        <span className="calendar-follow-up-event-icon">
          {completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        </span>
        <span className="calendar-follow-up-event-content">
          <strong>{followUp.title}</strong>
          {!compact ? <small>{followUp.operation.patient.fullName}</small> : null}
          <small>{dayjs(followUp.scheduledAt).format(isAr ? 'hh:mm A' : 'hh:mm A')}</small>
        </span>
      </button>
    </Tooltip>
  );
}
