import { useMemo } from 'react';
import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';
import type { Operation } from '@/types';
import type { GlobalFollowUp } from '@/services/operation.service';
import { parseOperationDateTime } from '../calendarUtils';
import CalendarEvent from '../CalendarEvent/CalendarEvent';
import FollowUpEvent from '../FollowUpEvent/FollowUpEvent';
import './DayView.scss';

interface DayViewProps { current: Dayjs; operations: Operation[]; followUps: GlobalFollowUp[]; onCreate: () => void; }
const START_HOUR = 7;
const END_HOUR = 21;

export default function DayView({ current, operations, followUps, onCreate }: DayViewProps) {
  const { t } = useTranslation();
  const dateKey = current.format('YYYY-MM-DD');
  const hours = useMemo(() => Array.from({ length: END_HOUR - START_HOUR }, (_, index) => START_HOUR + index), []);
  const byHour = useMemo(() => {
    const map = new Map<number, Operation[]>();
    for (const operation of operations) {
      const at = parseOperationDateTime(operation);
      if (at.format('YYYY-MM-DD') !== dateKey) continue;
      const hour = at.hour();
      const bucket = hour < START_HOUR ? START_HOUR : hour >= END_HOUR ? END_HOUR - 1 : hour;
      const existing = map.get(bucket);
      if (existing) existing.push(operation); else map.set(bucket, [operation]);
    }
    return map;
  }, [operations, dateKey]);
  const followUpsByHour = useMemo(() => {
    const map = new Map<number, GlobalFollowUp[]>();
    for (const followUp of followUps) {
      const at = new Date(followUp.scheduledAt);
      if (at.toISOString().slice(0, 10) !== dateKey) continue;
      const hour = at.getHours();
      const bucket = hour < START_HOUR ? START_HOUR : hour >= END_HOUR ? END_HOUR - 1 : hour;
      const existing = map.get(bucket);
      if (existing) existing.push(followUp); else map.set(bucket, [followUp]);
    }
    return map;
  }, [followUps, dateKey]);

  if (operations.length === 0 && followUps.length === 0) return <div className="dayEmpty"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('calendar.noOperations')}><Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>{t('calendar.createOperation')}</Button></Empty></div>;

  return <div className="dayView">{hours.map((hour) => {
    const items = byHour.get(hour) ?? [];
    const dayFollowUps = followUpsByHour.get(hour) ?? [];
    return <div key={hour} className="dayRow">
      <div className="dayHour">{`${String(hour).padStart(2, '0')}:00`}</div>
      <div className="daySlot">
        {items.map((operation) => <div key={operation.id} className="dayEvent"><CalendarEvent operation={operation} compact /><div className="dayMeta"><span>{operation.patient?.fullName ?? '—'}</span><span>{operation.hospital?.name ?? '—'}</span>{operation.operationRoom ? <span>{operation.operationRoom}</span> : null}</div></div>)}
        {dayFollowUps.map((followUp) => <div key={followUp.id} className="day-event-follow-up"><FollowUpEvent followUp={followUp} /></div>)}
      </div>
    </div>;
  })}</div>;
}
