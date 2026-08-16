import { Popover, Modal } from 'antd';
import { useState, type CSSProperties, type MouseEvent } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { Operation } from '@/types';
import { formatEventTime, getStatusStyle } from '../calendarUtils';
import OperationPopover from '../OperationPopover/OperationPopover';
import './CalendarEvent.scss';

interface CalendarEventProps {
  operation: Operation;
  compact?: boolean;
}

export default function CalendarEvent({ operation, compact = false }: CalendarEventProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const statusStyle = getStatusStyle(operation.status);

  const stop = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const chip = (
    <button
      type="button"
      className={`calendarEvent ${compact ? 'calendarEventCompact' : ''}`}
      style={{
        '--event-color': statusStyle.color,
        '--event-bg': statusStyle.background,
      } as CSSProperties}
      onClick={(event) => {
        stop(event);
        if (isMobile) setOpen(true);
      }}
    >
      <span className="calendarEventTime">{formatEventTime(operation)}</span>
      <span className="calendarEventName">{operation.name}</span>
    </button>
  );

  if (isMobile) {
    return (
      <>
        {chip}
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          centered
          destroyOnHidden
        >
          <OperationPopover operation={operation} />
        </Modal>
      </>
    );
  }

  return (
    <Popover
      trigger="click"
      placement="topLeft"
      content={<OperationPopover operation={operation} />}
    >
      <span onClick={stop}>{chip}</span>
    </Popover>
  );
}
