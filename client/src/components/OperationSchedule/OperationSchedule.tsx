import { formatOperationDate, formatTime } from '@/utils/helpers';
import './OperationSchedule.scss';

interface OperationScheduleProps {
  date?: string | Date | null;
  time?: string | null;
  stacked?: boolean;
}

export default function OperationSchedule({
  date,
  time,
  stacked = true,
}: OperationScheduleProps) {
  const timeLabel = time ? formatTime(time) : null;

  return (
    <span className={`operationSchedule ${stacked ? 'isStacked' : 'isInline'}`}>
      <span>{date ? formatOperationDate(date) : '—'}</span>
      {timeLabel ? <span className="operationScheduleTime">{timeLabel}</span> : null}
    </span>
  );
}
