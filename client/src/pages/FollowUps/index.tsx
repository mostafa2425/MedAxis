import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, DatePicker, Empty, Flex, Segmented, Skeleton, Tag, Tooltip, Typography, message } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, ReloadOutlined, RightOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { operationService, type GlobalFollowUp } from '@/services/operation.service';
import type { FollowUpStatus } from '@/types';
import './FollowUps.scss';

const STATUS_OPTIONS: Array<{ value: FollowUpStatus | 'ALL'; en: string; ar: string }> = [
  { value: 'ALL', en: 'All', ar: 'الكل' },
  { value: 'UPCOMING', en: 'Upcoming', ar: 'القادمة' },
  { value: 'OVERDUE', en: 'Overdue', ar: 'المتأخرة' },
  { value: 'COMPLETED', en: 'Completed', ar: 'المكتملة' },
];

function statusMeta(status: FollowUpStatus, isAr: boolean) {
  const labels: Record<FollowUpStatus, { en: string; ar: string; color: string }> = {
    UPCOMING: { en: 'Upcoming', ar: 'قادم', color: 'blue' },
    OVERDUE: { en: 'Overdue', ar: 'متأخر', color: 'red' },
    COMPLETED: { en: 'Completed', ar: 'مكتمل', color: 'green' },
    CANCELLED: { en: 'Cancelled', ar: 'ملغي', color: 'default' },
  };
  const item = labels[status];
  return { label: isAr ? item.ar : item.en, color: item.color };
}

export default function FollowUpsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [status, setStatus] = useState<FollowUpStatus | 'ALL'>('ALL');
  const [date, setDate] = useState<Dayjs | null>(null);

  const params = useMemo(() => ({
    ...(status !== 'ALL' ? { status } : {}),
    ...(date ? { from: date.startOf('day').toISOString(), to: date.endOf('day').toISOString() } : {}),
  }), [date, status]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['global-follow-ups', params],
    queryFn: async () => (await operationService.getGlobalFollowUps(params)).data.data ?? [],
  });

  const items = data ?? [];
  const counts = useMemo(() => ({
    upcoming: items.filter((item) => item.status === 'UPCOMING').length,
    overdue: items.filter((item) => item.status === 'OVERDUE').length,
    completed: items.filter((item) => item.status === 'COMPLETED').length,
  }), [items]);

  const completeMutation = useMutation({
    mutationFn: (item: GlobalFollowUp) => operationService.updateFollowUp(item.operation.id, item.id, { status: 'COMPLETED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-follow-ups'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-follow-ups-events'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-follow-ups'] });
      queryClient.invalidateQueries({ queryKey: ['operation-follow-ups'] });
      messageApi.success(isAr ? 'تم إكمال المتابعة' : 'Follow-up completed');
    },
  });

  const goToday = () => setDate(dayjs());
  const clearDate = () => setDate(null);

  const renderStat = (value: number, label: string, icon: React.ReactNode, className: string) => (
    <Card className={`follow-up-stat ${className}`} bordered={false} size="small">
      <span className="follow-up-stat-icon">{icon}</span>
      <span className="follow-up-stat-content">
        <Typography.Text className="follow-up-stat-value">{value}</Typography.Text>
        <Typography.Text className="follow-up-stat-label">{label}</Typography.Text>
      </span>
    </Card>
  );

  return (
    <div className="follow-ups-page page">
      {contextHolder}
      <div className="page-header">
        <div>
          <Typography.Title level={2}>{isAr ? 'المتابعات' : 'Follow-ups'}</Typography.Title>
          <Typography.Text type="secondary">{isAr ? 'كل مواعيد متابعة الحالات في مكان واحد' : 'Manage every patient follow-up from one place'}</Typography.Text>
        </div>
        <Button icon={<ReloadOutlined />} loading={isFetching} onClick={() => refetch()}>{isAr ? 'تحديث' : 'Refresh'}</Button>
      </div>

      <div className="follow-up-stats">
        {renderStat(counts.upcoming, isAr ? 'القادمة' : 'Upcoming', <ClockCircleOutlined />, 'is-upcoming')}
        {renderStat(counts.overdue, isAr ? 'المتأخرة' : 'Overdue', <ExclamationCircleOutlined />, 'is-overdue')}
        {renderStat(counts.completed, isAr ? 'المكتملة' : 'Completed', <CheckCircleOutlined />, 'is-completed')}
      </div>

      <Card className="follow-up-filters" bordered={false}>
        <Flex gap={12} wrap align="center" justify="space-between">
          <Segmented value={status} onChange={(value) => setStatus(value as FollowUpStatus | 'ALL')} options={STATUS_OPTIONS.map((option) => ({ value: option.value, label: isAr ? option.ar : option.en }))} />
          <Flex gap={8} wrap align="center">
            <Button type="default" icon={<CalendarOutlined />} onClick={goToday}>{isAr ? 'اليوم' : 'Today'}</Button>
            <DatePicker allowClear value={date} onChange={setDate} placeholder={isAr ? 'كل التواريخ' : 'All dates'} />
            {date ? <Button type="text" onClick={clearDate}>{isAr ? 'مسح التاريخ' : 'Clear date'}</Button> : null}
          </Flex>
        </Flex>
      </Card>

      <Card className="follow-up-list" bordered={false}>
        {isLoading ? <Skeleton active paragraph={{ rows: 7 }} /> : items.length ? (
          <div className="follow-up-list-grid">
            {items.map((item) => {
              const meta = statusMeta(item.status, isAr);
              const hospitalName = isAr ? (item.operation.hospital.nameAr || item.operation.hospital.name) : item.operation.hospital.name;
              return (
                <article key={item.id} className={`follow-up-card follow-up-${item.status.toLowerCase()}`}>
                  <div className="follow-up-card-main">
                    <div className="follow-up-card-icon"><CalendarOutlined /></div>
                    <div className="follow-up-card-content">
                      <Flex justify="space-between" align="start" gap={8}>
                        <div className="follow-up-card-title-wrap">
                          <Typography.Text strong className="follow-up-card-title">{item.title}</Typography.Text>
                          <Typography.Text className="follow-up-card-patient">{item.operation.patient.fullName}</Typography.Text>
                        </div>
                        <Tag color={meta.color}>{meta.label}</Tag>
                      </Flex>
                      <div className="follow-up-card-meta">
                        <span><ClockCircleOutlined /> {dayjs(item.scheduledAt).format('ddd, DD MMM · hh:mm A')}</span>
                        <span>{hospitalName}</span>
                      </div>
                      {item.notes && <Typography.Text type="secondary" className="follow-up-card-notes" ellipsis={{ tooltip: item.notes }}>{item.notes}</Typography.Text>}
                    </div>
                  </div>
                  <div className="follow-up-card-actions">
                    <Button type="link" onClick={() => navigate(`/operations/${item.operation.id}`)}>{isAr ? 'فتح العملية' : 'Open operation'} <RightOutlined /></Button>
                    {item.operation.patient.mobile && <Tooltip title={item.operation.patient.mobile}><Button type="text" href={`tel:${item.operation.patient.mobile}`}>{isAr ? 'اتصال' : 'Call'}</Button></Tooltip>}
                    {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && (
                      <Button size="small" type="primary" icon={<CheckCircleOutlined />} loading={completeMutation.isPending} onClick={() => completeMutation.mutate(item)}>
                        {isAr ? 'إكمال' : 'Complete'}
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={isAr ? 'لا توجد متابعات' : 'No follow-ups found'} />}
      </Card>
    </div>
  );
}
