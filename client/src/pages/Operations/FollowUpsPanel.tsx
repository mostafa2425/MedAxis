import { useMemo, useState } from 'react';
import { Button, Card, DatePicker, Empty, Flex, Form, Input, List, Modal, Space, Tag, Typography, message } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { operationService } from '@/services/operation.service';
import type { FollowUpStatus, OperationFollowUp } from '@/types';
import './FollowUpsPanel.scss';

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

export default function FollowUpsPanel({ operationId, initialFollowUps = [] }: { operationId: string; initialFollowUps?: OperationFollowUp[] }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<{ title: string; scheduledAt: Dayjs; notes?: string }>();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isFetching, refetch } = useQuery({ queryKey: ['operation-follow-ups', operationId], queryFn: () => operationService.getFollowUps(operationId), initialData: initialFollowUps.length ? { data: { data: initialFollowUps, success: true } } as any : undefined });
  const items = data?.data?.data ?? initialFollowUps;

  const stats = useMemo(() => ({
    upcoming: items.filter((x) => x.status === 'UPCOMING').length,
    overdue: items.filter((x) => x.status === 'OVERDUE').length,
    completed: items.filter((x) => x.status === 'COMPLETED').length,
  }), [items]);

  const createMutation = useMutation({
    mutationFn: (values: { title: string; scheduledAt: Dayjs; notes?: string }) => operationService.createFollowUp(operationId, { title: values.title, scheduledAt: values.scheduledAt.toISOString(), notes: values.notes }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['operation-follow-ups', operationId] }); queryClient.invalidateQueries({ queryKey: ['operation-detail', operationId] }); setOpen(false); form.resetFields(); messageApi.success(isAr ? 'تم إضافة المتابعة' : 'Follow-up added'); },
    onError: () => messageApi.error(isAr ? 'تعذر إضافة المتابعة' : 'Unable to add follow-up'),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: FollowUpStatus }) => operationService.updateFollowUp(operationId, id, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['operation-follow-ups', operationId] }); queryClient.invalidateQueries({ queryKey: ['operation-detail', operationId] }); messageApi.success(isAr ? 'تم تحديث المتابعة' : 'Follow-up updated'); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => operationService.deleteFollowUp(operationId, id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['operation-follow-ups', operationId] }); queryClient.invalidateQueries({ queryKey: ['operation-detail', operationId] }); messageApi.success(isAr ? 'تم حذف المتابعة' : 'Follow-up deleted'); },
  });

  return <div className="follow-ups-panel">{contextHolder}
    <Flex className="follow-up-summary" gap={8} wrap>
      <div className="follow-up-stat"><span>{stats.upcoming}</span><Typography.Text type="secondary">{isAr ? 'قادم' : 'Upcoming'}</Typography.Text></div>
      <div className={`follow-up-stat ${stats.overdue ? 'is-alert' : ''}`}><span>{stats.overdue}</span><Typography.Text type="secondary">{isAr ? 'متأخر' : 'Overdue'}</Typography.Text></div>
      <div className="follow-up-stat"><span>{stats.completed}</span><Typography.Text type="secondary">{isAr ? 'مكتمل' : 'Completed'}</Typography.Text></div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>{isAr ? 'إضافة متابعة' : 'Add follow-up'}</Button>
      <Button icon={<ReloadOutlined />} loading={isFetching} onClick={() => refetch()} />
    </Flex>

    <Card className="follow-up-list-card" bordered={false}>
      {items.length ? <List dataSource={items} renderItem={(item) => {
        const meta = statusMeta(item.status, isAr);
        return <List.Item className={`follow-up-item follow-up-${item.status.toLowerCase()}`} actions={item.status === 'COMPLETED' || item.status === 'CANCELLED' ? [<Button key="delete" type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMutation.mutate(item.id)} />] : [<Button key="complete" type="text" icon={<CheckCircleOutlined />} onClick={() => updateMutation.mutate({ id: item.id, status: 'COMPLETED' })}>{isAr ? 'إكمال' : 'Complete'}</Button>, <Button key="delete" type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMutation.mutate(item.id)} />]}>
          <List.Item.Meta avatar={<div className="follow-up-icon"><CalendarOutlined /></div>} title={<Flex align="center" gap={8} wrap><Typography.Text strong>{item.title}</Typography.Text><Tag color={meta.color}>{meta.label}</Tag></Flex>} description={<Flex vertical gap={4}><Typography.Text type="secondary"><ClockCircleOutlined /> {dayjs(item.scheduledAt).format('DD MMM YYYY · hh:mm A')}</Typography.Text>{item.notes && <Typography.Text type="secondary" ellipsis>{item.notes}</Typography.Text>}</Flex>} />
        </List.Item>;
      }} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={isAr ? 'لا توجد متابعات مجدولة' : 'No follow-ups scheduled yet'} />}
    </Card>

    <Modal title={isAr ? 'إضافة متابعة' : 'Add follow-up'} open={open} onCancel={() => setOpen(false)} okText={isAr ? 'إضافة' : 'Add'} cancelText={isAr ? 'إلغاء' : 'Cancel'} confirmLoading={createMutation.isPending} onOk={() => form.submit()} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={(values) => createMutation.mutate(values)} initialValues={{ scheduledAt: dayjs().add(7, 'day').hour(10).minute(0) }}>
        <Form.Item name="title" label={isAr ? 'عنوان المتابعة' : 'Follow-up title'} rules={[{ required: true, message: isAr ? 'أدخل عنوان المتابعة' : 'Enter a follow-up title' }]}><Input placeholder={isAr ? 'مثال: مراجعة الجرح' : 'e.g. Wound check'} /></Form.Item>
        <Form.Item name="scheduledAt" label={isAr ? 'الموعد' : 'Scheduled for'} rules={[{ required: true, message: isAr ? 'اختر الموعد' : 'Choose a date and time' }]}><DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="notes" label={isAr ? 'ملاحظات' : 'Notes'}><Input.TextArea rows={3} placeholder={isAr ? 'ملاحظات اختيارية' : 'Optional notes'} /></Form.Item>
      </Form>
    </Modal>
  </div>;
}
