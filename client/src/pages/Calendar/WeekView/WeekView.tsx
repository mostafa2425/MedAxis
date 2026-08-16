import { useMemo } from 'react';
import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';
import type { Operation } from '@/types';
import { parseOperationDateTime } from '../calendarUtils';
import CalendarEvent from '../CalendarEvent/CalendarEvent';
import './WeekView.scss';

interface WeekViewProps {
  current: Dayjs;
  operations: Operation[];
  onCreate: () => void;
}

const START_HOUR = 7;
const END_HOUR = 21;

export default function WeekView({ current, operations, onCreate }: WeekViewProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const weekStart = current.locale(locale).startOf('week');

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, index) => weekStart.add(index, 'day')),
    [weekStart],
  );

  const hours = useMemo(
    () => Array.from({ length: END_HOUR - START_HOUR }, (_, index) => START_HOUR + index),
    [],
  );

  const byDayHour = useMemo(() => {
    const map = new Map<string, Operation[]>();
    for (const operation of operations) {
      const at = parseOperationDateTime(operation);
      const hour = at.hour();
      const bucket = hour < START_HOUR ? START_HOUR : hour >= END_HOUR ? END_HOUR - 1 : hour;
      const key = `${at.format('YYYY-MM-DD')}-${bucket}`;
      const existing = map.get(key);
      if (existing) existing.push(operation);
      else map.set(key, [operation]);
    }
    return map;
  }, [operations]);

  if (operations.length === 0) {
    return (
      <div className="weekEmpty">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('calendar.noOperations')}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            {t('calendar.createOperation')}
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="weekView">
      <div className="weekGrid">
        <div className="weekCorner" />
        {days.map((day) => (
          <div key={day.format('YYYY-MM-DD')} className="weekHead">
            <span>{day.locale(locale).format('ddd')}</span>
            <strong>{day.format('D')}</strong>
          </div>
        ))}

        {hours.map((hour) => (
          <div key={hour} className="weekHourRow">
            <div className="weekHourLabel">{`${String(hour).padStart(2, '0')}:00`}</div>
            {days.map((day) => {
              const key = `${day.format('YYYY-MM-DD')}-${hour}`;
              const items = byDayHour.get(key) ?? [];
              return (
                <div key={key} className="weekCell">
                  {items.map((operation) => (
                    <CalendarEvent key={operation.id} operation={operation} compact />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
