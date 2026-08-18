import { useMemo, useState, type ReactNode } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Flex,
  Form,
  Input,
  List,
  Modal,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { operationService } from '@/services/operation.service';
import type { ApiResponse, FollowUpStatus, OperationFollowUp } from '@/types';
import './FollowUpsPanel.scss';

type FollowUpsResponse = ApiResponse<OperationFollowUp[]>;

type FollowUpFormValues = {
  title: string;
  scheduledAt: Dayjs;
  notes?: string;
};

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

export default function FollowUpsPanel({
  operationId,
  initialFollowUps = [],
}: {
  operationId: string;
  initialFollowUps?: OperationFollowUp[];
}) {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<FollowUpFormValues>();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const initialData: FollowUpsResponse = {
    success: true,
    data: initialFollowUps,
  };

  const { data, isFetching, refetch } = useQuery<FollowUpsResponse>({
    queryKey: ['operation-follow-ups', operationId],
    queryFn: async () => (await operationService.getFollowUps(operationId)).data,
    initialData,
  });

  const items = data?.data ?? initialFollowUps;

  const stats = useMemo(
    () => ({
      upcoming: items.filter((followUp: OperationFollowUp) => followUp.status === 'UPCOMING').length,
      overdue: items.filter((followUp: OperationFollowUp) => followUp.status === 'OVERDUE').length,
      completed: items.filter((followUp: OperationFollowUp) => followUp.status === 'COMPLETED').length,
    }),
    [items],
  );

  const createMutation = useMutation({
    mutationFn: (values: FollowUpFormValues) =>
      operationService.createFollowUp(operationId, {
        title: values.title,
        scheduledAt: values.scheduledAt.toISOString(),
        notes: values.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-follow-ups', operationId] });
      queryClient.invalidateQueries({ queryKey: ['operation-detail', operationId] });
      setOpen(false);
      form.resetFields();
      messageApi.success(isAr ? 'تم إضافة المتابعة' : 'Follow-up added');
    },
    onError: () =>
      messageApi.error(isAr ? 'تعذر إضافة المتابعة' : 'Unable to add follow-up'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: FollowUpStatus }) =>
      operationService.updateFollowUp(operationId, id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-follow-ups', operationId] });
      queryClient.invalidateQueries({ queryKey: ['operation-detail', operationId] });
      messageApi.success(isAr ? 'تم تحديث المتابعة' : 'Follow-up updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => operationService.deleteFollowUp(operationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-follow-ups', operationId] });
      queryClient.invalidateQueries({ queryKey: ['operation-detail', operationId] });
      messageApi.success(isAr ? 'تم حذف المتابعة' : 'Follow-up deleted');
    },
  });

  const renderStat = (
    value: number,
    label: string,
    icon: ReactNode,
    className = '',
  ) => (
    <Card className={`follow-up-stat ${className}`} bordered={false} size="small">
      <div className="follow-up-stat-icon">{icon}</div>
      <div className="follow-up-stat-content">
        <Typography.Text className="follow-up-stat-value">{value}</Typography.Text>
        <Typography.Text className="follow-up-stat-label">{label}</Typography.Text>
      </div>
    </Card>
  );

  return (
    <div className="follow-ups-panel">
      {contextHolder}

      <Flex className="follow-up-summary" gap={10} wrap>
        {renderStat(
          stats.upcoming,
          isAr ? 'قادم' : 'Upcoming',
          <ClockCircleOutlined />,
        )}
        {renderStat(
          stats.overdue,
          isAr ? 'متأخر' : 'Overdue',
          <CalendarOutlined />,
          stats.overdue ? 'is-alert' : '',
        )}
        {renderStat(
          stats.completed,
          isAr ? 'مكتمل' : 'Completed',
          <CheckCircleOutlined />,
          'is-completed',
        )}
        <div className="follow-up-summary-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
            {isAr ? 'إضافة متابعة' : 'Add follow-up'}
          </Button>
          <Tooltip title={isAr ? 'تحديث' : 'Refresh'}>
            <Button
              aria-label={isAr ? 'تحديث المتابعات' : 'Refresh follow-ups'}
              icon={<ReloadOutlined />}
              loading={isFetching}
              onClick={() => refetch()}
            />
          </Tooltip>
        </div>
      </Flex>

      <Card className="follow-up-list-card" bordered={false}>
        {items.length ? (
          <List
            dataSource={items}
            renderItem={(item) => {
              const meta = statusMeta(item.status, isAr);
              const isActive = item.status !== 'COMPLETED' && item.status !== 'CANCELLED';

              return (
                <List.Item className={`follow-up-item follow-up-${item.status.toLowerCase()}`}>
                  <div className="follow-up-item-main">
                    <div className="follow-up-icon">
                      <CalendarOutlined />
                    </div>
                    <div className="follow-up-item-content">
                      <div className="follow-up-item-heading">
                        <Typography.Text strong className="follow-up-item-title">
                          {item.title}
                        </Typography.Text>
                        <Tag color={meta.color}>{meta.label}</Tag>
                      </div>
                      <Typography.Text className="follow-up-item-date" type="secondary">
                        <ClockCircleOutlined />
                        {dayjs(item.scheduledAt).format('DD MMM YYYY · hh:mm A')}
                      </Typography.Text>
                      {item.notes && (
                        <Typography.Text
                          className="follow-up-item-notes"
                          type="secondary"
                          ellipsis={{ tooltip: item.notes }}
                        >
                          {item.notes}
                        </Typography.Text>
                      )}
                    </div>
                  </div>

                  <div className="follow-up-item-actions">
                    {isActive && (
                      <Tooltip title={isAr ? 'إكمال المتابعة' : 'Complete follow-up'}>
                        <Button
                          className="follow-up-complete-button"
                          type="text"
                          icon={<CheckCircleOutlined />}
                          aria-label={isAr ? 'إكمال المتابعة' : 'Complete follow-up'}
                          loading={updateMutation.isPending}
                          onClick={() =>
                            updateMutation.mutate({ id: item.id, status: 'COMPLETED' })
                          }
                        />
                      </Tooltip>
                    )}
                    <Tooltip title={isAr ? 'حذف' : 'Delete'}>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        aria-label={isAr ? 'حذف المتابعة' : 'Delete follow-up'}
                        loading={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(item.id)}
                      />
                    </Tooltip>
                  </div>
                </List.Item>
              );
            }}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={isAr ? 'لا توجد متابعات مجدولة' : 'No follow-ups scheduled yet'}
          />
        )}
      </Card>

      <Modal
        title={isAr ? 'إضافة متابعة' : 'Add follow-up'}
        open={open}
        onCancel={() => setOpen(false)}
        okText={isAr ? 'إضافة' : 'Add'}
        cancelText={isAr ? 'إلغاء' : 'Cancel'}
        confirmLoading={createMutation.isPending}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => createMutation.mutate(values)}
          initialValues={{ scheduledAt: dayjs().add(7, 'day').hour(10).minute(0) }}
        >
          <Form.Item
            name="title"
            label={isAr ? 'عنوان المتابعة' : 'Follow-up title'}
            rules={[{
              required: true,
              message: isAr ? 'أدخل عنوان المتابعة' : 'Enter a follow-up title',
            }]}
          >
            <Input placeholder={isAr ? 'مثال: مراجعة الجرح' : 'e.g. Wound check'} />
          </Form.Item>
          <Form.Item
            name="scheduledAt"
            label={isAr ? 'الموعد' : 'Scheduled for'}
            rules={[{
              required: true,
              message: isAr ? 'اختر الموعد' : 'Choose a date and time',
            }]}
          >
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label={isAr ? 'ملاحظات' : 'Notes'}>
            <Input.TextArea
              rows={3}
              placeholder={isAr ? 'ملاحظات اختيارية' : 'Optional notes'}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
