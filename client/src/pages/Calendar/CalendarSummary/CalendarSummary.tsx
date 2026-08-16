import { Card, Skeleton } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './CalendarSummary.scss';

interface CalendarSummaryProps {
  todayCount: number;
  tomorrowCount: number;
  weekCount: number;
  nextOperationLabel: string;
  loading?: boolean;
}

interface SummaryItem {
  key: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  className: string;
  isNext?: boolean;
}

export default function CalendarSummary({
  todayCount,
  tomorrowCount,
  weekCount,
  nextOperationLabel,
  loading = false,
}: CalendarSummaryProps) {
  const { t } = useTranslation();

  const items: SummaryItem[] = [
    {
      key: 'today',
      label: t('calendar.todayOperations'),
      value: String(todayCount),
      icon: <CalendarOutlined />,
      className: 'isToday',
    },
    {
      key: 'tomorrow',
      label: t('calendar.tomorrowOperations'),
      value: String(tomorrowCount),
      icon: <ClockCircleOutlined />,
      className: 'isTomorrow',
    },
    {
      key: 'week',
      label: t('calendar.thisWeek'),
      value: String(weekCount),
      icon: <FieldTimeOutlined />,
      className: 'isWeek',
    },
    {
      key: 'next',
      label: t('calendar.nextOperation'),
      value: nextOperationLabel,
      icon: <RightOutlined />,
      className: 'isNext',
      isNext: true,
    },
  ];

  return (
    <div className="calendarSummary">
      {items.map((item) => (
        <Card
          key={item.key}
          bordered={false}
          className={`calendarSummaryCard ${item.className}`}
        >
          {loading ? (
            <div className="calendarSummaryLoading">
              <Skeleton.Avatar active size={42} shape="square" />

              <div className="calendarSummaryLoadingContent">
                <Skeleton.Input active size="small" />
                <Skeleton.Input active size="large" />
              </div>
            </div>
          ) : (
            <div className="calendarSummaryContent">
              <div className="calendarSummaryIcon">{item.icon}</div>

              <div className="calendarSummaryInfo">
                <span className="calendarSummaryLabel">
                  {item.label}
                </span>

                <span
                  className={`calendarSummaryValue ${
                    item.isNext ? 'calendarSummaryValueNext' : ''
                  }`}
                  title={item.value}
                >
                  {item.value}
                </span>
              </div>

              {item.isNext && (
                <div className="calendarSummaryArrow">
                  <RightOutlined />
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}