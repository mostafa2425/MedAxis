import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Empty, Skeleton, Tag, Typography } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { operationService } from '@/services/operation.service';
import type { Dayjs } from 'dayjs';
import './CalendarFollowUps.scss';

interface CalendarFollowUpsProps { from: Dayjs; to: Dayjs; }

export default function CalendarFollowUps({ from, to }: CalendarFollowUpsProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language.startsWith('ar');
  const { data, isLoading } = useQuery({
    queryKey: ['calendar-follow-ups', from.toISOString(), to.toISOString()],
    queryFn: async () => (await operationService.getGlobalFollowUps({ from: from.startOf('day').toISOString(), to: to.endOf('day').toISOString() })).data.data ?? [],
  });

  const items = useMemo(() => (data ?? []).filter((item) => item.status !== 'CANCELLED').sort((a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf()).slice(0, 6), [data]);

  return (
    <Card className="calendar-follow-ups" bordered={false} title={<span className="calendar-follow-ups-title"><CalendarOutlined /> {isAr ? 'المتابعات القادمة' : 'Upcoming follow-ups'}</span>}>
      {isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : items.length ? (
        <div className="calendar-follow-ups-list">
          {items.map((item) => {
            const overdue = item.status === 'OVERDUE';
            return (
              <button key={item.id} type="button" className={`calendar-follow-up-item ${overdue ? 'is-overdue' : ''}`} onClick={() => navigate(`/operations/${item.operation.id}`)}>
                <span className="calendar-follow-up-date"><strong>{dayjs(item.scheduledAt).format('DD')}</strong><small>{dayjs(item.scheduledAt).format('MMM')}</small></span>
                <span className="calendar-follow-up-content">
                  <Typography.Text strong ellipsis>{item.title}</Typography.Text>
                  <Typography.Text type="secondary" ellipsis>{item.operation.patient.fullName}</Typography.Text>
                  <span className="calendar-follow-up-time"><ClockCircleOutlined /> {dayjs(item.scheduledAt).format('hh:mm A')}</span>
                </span>
                <Tag color={overdue ? 'red' : 'blue'}>{overdue ? (isAr ? 'متأخر' : 'Overdue') : (isAr ? 'قادم' : 'Upcoming')}</Tag>
                <RightOutlined className="calendar-follow-up-arrow" />
              </button>
            );
          })}
        </div>
      ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={isAr ? 'لا توجد متابعات في هذه الفترة' : 'No follow-ups in this period'} />}
    </Card>
  );
}
