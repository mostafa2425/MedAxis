import { Button, Calendar, ConfigProvider, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';
import type { ReactElement } from 'react';
import enUS from 'antd/locale/en_US';
import arEG from 'antd/locale/ar_EG';
import type { Operation } from '@/types';
import { groupOperationsByDate } from '../calendarUtils';
import CalendarEvent from '../CalendarEvent/CalendarEvent';
import './MonthView.scss';

interface MonthViewProps {
  current: Dayjs;
  operations: Operation[];
  onChange: (value: Dayjs) => void;
  onShowDay: (value: Dayjs) => void;
  onCreate: () => void;
}

const MAX_VISIBLE = 3;

export default function MonthView({
  current,
  operations,
  onChange,
  onShowDay,
  onCreate,
}: MonthViewProps) {
  const { t, i18n } = useTranslation();
  const grouped = groupOperationsByDate(operations);
  const locale = i18n.language.startsWith('ar') ? arEG : enUS;

  const cellRender = (
    date: Dayjs,
    info: { originNode: ReactElement; type: string },
  ) => {
    if (info.type !== 'date') return info.originNode;
    const key = date.format('YYYY-MM-DD');
    const items = grouped.get(key) ?? [];
    const visible = items.slice(0, MAX_VISIBLE);
    const extra = items.length - visible.length;

    return (
      <div className="monthCell">
        <div className="monthCellEvents">
          {visible.map((operation) => (
            <CalendarEvent key={operation.id} operation={operation} />
          ))}
          {extra > 0 ? (
            <button
              type="button"
              className="monthMore"
              onClick={(event) => {
                event.stopPropagation();
                onShowDay(date);
              }}
            >
              {t('calendar.moreCount', { count: extra })}
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="monthView">
      {operations.length === 0 ? (
        <div className="monthEmptyBanner">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t('calendar.noOperations')}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
              {t('calendar.createOperation')}
            </Button>
          </Empty>
        </div>
      ) : null}
      <ConfigProvider locale={locale}>
        <Calendar
          fullscreen
          value={current}
          headerRender={() => null}
          onSelect={(value) => onChange(value)}
          onPanelChange={(value) => onChange(value)}
          cellRender={cellRender}
        />
      </ConfigProvider>
    </div>
  );
}
