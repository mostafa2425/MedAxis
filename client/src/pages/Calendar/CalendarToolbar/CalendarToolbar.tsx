import { Button, Segmented } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/app.store';
import type { CalendarView } from '../calendarUtils';
import './CalendarToolbar.scss';

interface CalendarToolbarProps {
  view: CalendarView;
  periodLabel: string;
  hasFilters: boolean;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onOpenFilters?: () => void;
  showMobileFilters?: boolean;
}

export default function CalendarToolbar({
  view,
  periodLabel,
  hasFilters,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onOpenFilters,
  showMobileFilters = false,
}: CalendarToolbarProps) {
  const { t } = useTranslation();
  const direction = useAppStore((s) => s.direction);
  const PrevIcon = direction === 'rtl' ? RightOutlined : LeftOutlined;
  const NextIcon = direction === 'rtl' ? LeftOutlined : RightOutlined;

  return (
    <div className="calendarToolbar">
      <div className="calendarToolbarNav">
        <Button
          icon={<PrevIcon />}
          onClick={onPrevious}
          aria-label={t('calendar.previous')}
        />
        <Button onClick={onToday}>{t('calendar.today')}</Button>
        <Button
          icon={<NextIcon />}
          onClick={onNext}
          aria-label={t('calendar.next')}
        />
        <h2 className="calendarToolbarPeriod">{periodLabel}</h2>
      </div>

      <div className="calendarToolbarViews">
        <Segmented
          value={view}
          onChange={(value) => onViewChange(value as CalendarView)}
          options={[
            { label: t('calendar.month'), value: 'month' },
            { label: t('calendar.week'), value: 'week' },
            { label: t('calendar.day'), value: 'day' },
            { label: t('calendar.agenda'), value: 'agenda' },
          ]}
        />
        {showMobileFilters ? (
          <Button
            icon={<FilterOutlined />}
            onClick={onOpenFilters}
            type={hasFilters ? 'primary' : 'default'}
          >
            {t('calendar.filters')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
