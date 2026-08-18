import { Card, Empty, Tag } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { Operation } from '@/types';
import { getStatusColor } from '@/utils/helpers';
import { useAppStore } from '@/stores/app.store';
import {
  getOperationDateKey,
  getStatusBg,
  getStatusLabelKey,
  parseOperationDateTime,
} from '../calendarUtils';
import './UpcomingOperations.scss';

interface UpcomingOperationsProps {
  operations: Operation[];
  loading?: boolean;
}

function sectionKey(operation: Operation, t: (key: string) => string): string {
  const dateKey = getOperationDateKey(operation);
  const today = dayjs().format('YYYY-MM-DD');
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
  if (dateKey === today) return t('calendar.today');
  if (dateKey === tomorrow) return t('calendar.tomorrow');
  return t('calendar.upcoming');
}

export default function UpcomingOperations({ operations, loading = false }: UpcomingOperationsProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const language = useAppStore((s) => s.language);
  const isAr = i18n.language.startsWith('ar');

  const grouped = operations.reduce<Record<string, Operation[]>>((acc, operation) => {
    const key = sectionKey(operation, t);
    acc[key] = acc[key] ? [...acc[key], operation] : [operation];
    return acc;
  }, {});

  return (
    <Card className="upcomingOperations" title={t('calendar.upcoming')} loading={loading}>
      {operations.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('calendar.noUpcoming')} />
      ) : (
        <div className="upcomingList">
          {Object.entries(grouped).map(([title, items]) => (
            <section key={title} className="upcomingGroup">
              <h3 className="upcomingGroupTitle">{title}</h3>
              {items.map((operation) => {
                const dateTime = parseOperationDateTime(operation);
                const hospitalName = language === 'ar' && operation.hospital?.nameAr ? operation.hospital.nameAr : operation.hospital?.name;
                return (
                  <button key={operation.id} type="button" className="upcomingItem" onClick={() => navigate(`/operations/${operation.id}`)}>
                    <span className="upcomingDateBlock" aria-label={`${dateTime.format('DD MMM')} ${dateTime.format('hh:mm A')}`}>
                      <span className="upcomingDateIcon"><MedicineBoxOutlined /></span>
                      <span className="upcomingDateDay">{dateTime.format('DD')}</span>
                      <span className="upcomingDateMonth">{dateTime.format('MMM')}</span>
                      <span className="upcomingDateTime">{dateTime.format(isAr ? 'hh:mm' : 'hh:mm A')}</span>
                    </span>
                    <span className="upcomingBody">
                      <span className="upcomingName">{operation.name}</span>
                      <span className="upcomingMeta">{operation.patient?.fullName ?? '—'}</span>
                      <span className="upcomingMeta">{hospitalName ?? '—'}</span>
                    </span>
                    <Tag bordered={false} className="upcomingStatusTag" style={{ color: getStatusColor(operation.status), background: getStatusBg(operation.status), marginInlineEnd: 0 }}>
                      {t(getStatusLabelKey(operation.status))}
                    </Tag>
                  </button>
                );
              })}
            </section>
          ))}
        </div>
      )}
    </Card>
  );
}
