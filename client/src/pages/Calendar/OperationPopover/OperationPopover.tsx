import { Button, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getSpecialtyLabel,
  getStatusColor,
} from '@/utils/helpers';
import OperationSchedule from '@/components/OperationSchedule/OperationSchedule';
import { useAppStore } from '@/stores/app.store';
import type { Operation } from '@/types';
import {
  getPrimarySurgeonName,
  getStatusBg,
  getStatusLabelKey,
} from '../calendarUtils';
import './OperationPopover.scss';

interface OperationPopoverProps {
  operation: Operation;
}

export default function OperationPopover({ operation }: OperationPopoverProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const language = useAppStore((s) => s.language);
  const surgeon = getPrimarySurgeonName(operation);
  const hospitalName =
    language === 'ar' && operation.hospital?.nameAr
      ? operation.hospital.nameAr
      : operation.hospital?.name;
  const specialty = operation.specialty
    ? getSpecialtyLabel(operation.specialty, language)
    : null;

  return (
    <div className="calendarPopover">
      <div className="calendarPopoverRow">
        <span className="calendarPopoverLabel">{t('calendar.operation')}</span>
        <span className="calendarPopoverValue">{operation.name}</span>
      </div>

      <div className="calendarPopoverRow">
        <span className="calendarPopoverLabel">{t('calendar.time')}</span>
        <span className="calendarPopoverValue">
          <OperationSchedule date={operation.operationDate} time={operation.operationTime} stacked={false} />
        </span>
      </div>

      <div className="calendarPopoverRow">
        <span className="calendarPopoverLabel">{t('calendar.patient')}</span>
        <span className="calendarPopoverValue">
          {operation.patient?.fullName ?? '—'}
        </span>
      </div>

      <div className="calendarPopoverRow">
        <span className="calendarPopoverLabel">{t('calendar.hospital')}</span>
        <span className="calendarPopoverValue">{hospitalName ?? '—'}</span>
      </div>

      {operation.operationRoom ? (
        <div className="calendarPopoverRow">
          <span className="calendarPopoverLabel">{t('calendar.room')}</span>
          <span className="calendarPopoverValue">{operation.operationRoom}</span>
        </div>
      ) : null}

      {specialty ? (
        <div className="calendarPopoverRow">
          <span className="calendarPopoverLabel">{t('calendar.specialty')}</span>
          <span className="calendarPopoverValue">{specialty}</span>
        </div>
      ) : null}

      {surgeon ? (
        <div className="calendarPopoverRow">
          <span className="calendarPopoverLabel">{t('calendar.medicalTeam')}</span>
          <span className="calendarPopoverValue">{surgeon}</span>
        </div>
      ) : null}

      <div className="calendarPopoverRow">
        <span className="calendarPopoverLabel">{t('calendar.status')}</span>
        <Tag
          bordered={false}
          style={{
            color: getStatusColor(operation.status),
            background: getStatusBg(operation.status),
            marginInlineEnd: 0,
          }}
        >
          {t(getStatusLabelKey(operation.status))}
        </Tag>
      </div>

      {operation.duration ? (
        <div className="calendarPopoverRow">
          <span className="calendarPopoverLabel">{t('calendar.duration')}</span>
          <span className="calendarPopoverValue">
            {operation.duration} {t('common.minutes')}
          </span>
        </div>
      ) : null}

      <Space className="calendarPopoverActions" size={8}>
        <Button
          size="small"
          onClick={() => navigate(`/operations/${operation.id}`)}
        >
          {t('calendar.viewOperation')}
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => navigate(`/operations/${operation.id}/edit`)}
        >
          {t('calendar.editOperation')}
        </Button>
      </Space>
    </div>
  );
}
