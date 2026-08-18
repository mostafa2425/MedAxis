import { MedicineBoxOutlined } from '@ant-design/icons';
import { Popover, Modal } from 'antd';
import { useState, type CSSProperties, type MouseEvent } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { Operation } from '@/types';
import { formatEventTime } from '../calendarUtils';
import OperationPopover from '../OperationPopover/OperationPopover';
import './CalendarEvent.scss';

interface CalendarEventProps {
  operation: Operation;
  compact?: boolean;
}

const OPERATION_COLOR = '#2563eb';
const OPERATION_BACKGROUND = 'rgba(37, 99, 235, 0.10)';
const CANCELLED_COLOR = '#b42318';
const CANCELLED_BACKGROUND = 'rgba(180, 35, 24, 0.10)';

export default function CalendarEvent({ operation, compact = false }: CalendarEventProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const isCancelled = operation.status === 'CANCELLED';

  const stop = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const chip = (
    <button
      type="button"
      className={`calendarEvent calendarEventOperation ${isCancelled ? 'is-cancelled' : ''} ${compact ? 'calendarEventCompact' : ''}`}
      style={{
        '--event-color': isCancelled ? CANCELLED_COLOR : OPERATION_COLOR,
        '--event-bg': isCancelled ? CANCELLED_BACKGROUND : OPERATION_BACKGROUND,
      } as CSSProperties}
      onClick={(event) => {
        stop(event);
        if (isMobile) setOpen(true);
      }}
      aria-label={operation.name}
    >
      <span className="calendarEventIcon" aria-hidden="true">
        <MedicineBoxOutlined />
      </span>
      <span className="calendarEventTime">{formatEventTime(operation)}</span>
      <span className="calendarEventName">{operation.name}</span>
    </button>
  );

  if (isMobile) {
    return (
      <>
        {chip}
        <Modal open={open} onCancel={() => setOpen(false)} footer={null} centered destroyOnHidden>
          <OperationPopover operation={operation} />
        </Modal>
      </>
    );
  }

  return (
    <Popover trigger="click" placement="topLeft" content={<OperationPopover operation={operation} />}>
      <span onClick={stop}>{chip}</span>
    </Popover>
  );
}
