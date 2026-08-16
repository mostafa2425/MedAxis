import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { Operation } from '@/types';
import { groupOperationsByDate, parseOperationDateTime } from '../calendarUtils';
import CalendarEvent from '../CalendarEvent/CalendarEvent';
import './AgendaView.scss';

interface AgendaViewProps {
  operations: Operation[];
  onCreate: () => void;
}

export default function AgendaView({ operations, onCreate }: AgendaViewProps) {
  const { t, i18n } = useTranslation();
  const grouped = groupOperationsByDate(operations);
  const locale = i18n.language.startsWith('ar') ? 'ar' : 'en';

  if (operations.length === 0) {
    return (
      <div className="agendaEmpty">
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
    <div className="agendaView">
      {[...grouped.entries()].map(([dateKey, items]) => (
        <section key={dateKey} className="agendaGroup">
          <h3 className="agendaDate">
            {dayjs(dateKey).locale(locale).format('dddd, D MMMM YYYY')}
          </h3>
          <div className="agendaItems">
            {items
              .slice()
              .sort((a, b) => parseOperationDateTime(a).valueOf() - parseOperationDateTime(b).valueOf())
              .map((operation) => (
                <div key={operation.id} className="agendaRow">
                  <CalendarEvent operation={operation} compact />
                  <div className="agendaMeta">
                    <span>{operation.patient?.fullName ?? '—'}</span>
                    <span>{operation.hospital?.name ?? '—'}</span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
