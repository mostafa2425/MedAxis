import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Card, Collapse, Divider, Flex, Form, InputNumber, Space, Statistic, Typography, message } from 'antd';
import { DollarOutlined, DownOutlined, SaveOutlined } from '@ant-design/icons';
import { operationService, type OperationCostBreakdownPayload } from '@/services/operation.service';
import type { OperationCost } from '@/types';

interface Props { operationId: string; cost?: OperationCost | null; currency?: string; }
type Values = OperationCostBreakdownPayload;

const money = (value: number) => new Intl.NumberFormat('en-EG', { maximumFractionDigits: 2 }).format(value || 0);

export default function CostBreakdownCard({ operationId, cost, currency = 'EGP' }: Props) {
  const [form] = Form.useForm<Values>();
  const queryClient = useQueryClient();
  const [messageApi, holder] = message.useMessage();
  const values = Form.useWatch([], form) as Values | undefined;
  const total = Number(values?.totalCost ?? cost?.totalCost ?? 0);
  const expenses = ['hospitalCost', 'nursingCost', 'assistantDoctorsCost', 'equipmentCost', 'otherCost']
    .reduce((sum, key) => sum + Number(values?.[key as keyof Values] ?? 0), 0);
  const doctorShare = Math.max(total - expenses, 0);

  useEffect(() => {
    form.setFieldsValue({
      totalCost: Number(cost?.totalCost ?? 0),
      paidAmount: Number(cost?.paidAmount ?? 0),
      hospitalCost: Number((cost as OperationCost & Partial<Values>)?.hospitalCost ?? 0),
      nursingCost: Number((cost as OperationCost & Partial<Values>)?.nursingCost ?? 0),
      assistantDoctorsCost: Number((cost as OperationCost & Partial<Values>)?.assistantDoctorsCost ?? 0),
      equipmentCost: Number((cost as OperationCost & Partial<Values>)?.equipmentCost ?? 0),
      otherCost: Number((cost as OperationCost & Partial<Values>)?.otherCost ?? 0),
      paymentMethod: cost?.paymentMethod,
      paymentStatus: cost?.paymentStatus,
      paymentNotes: cost?.paymentNotes ?? undefined,
    });
  }, [cost, form]);

  const mutation = useMutation({
    mutationFn: (data: Values) => operationService.updateCost(operationId, data),
    onSuccess: () => { messageApi.success('Cost updated'); queryClient.invalidateQueries({ queryKey: ['operation-detail', operationId] }); },
    onError: () => messageApi.error('Unable to update operation cost'),
  });

  return <>
    {holder}
    <Card className="cost-card" title={<Flex align="center" gap={10}><DollarOutlined /><span>Financials</span></Flex>}>
      <Form form={form} layout="vertical" onFinish={(data) => mutation.mutate(data)}>
        <Flex gap={16} wrap>
          <Form.Item name="totalCost" label="Total Operation Cost" rules={[{ required: true, message: 'Enter total cost' }]} style={{ flex: '1 1 260px' }}>
            <InputNumber min={0} precision={2} size="large" style={{ width: '100%' }} addonAfter={currency} />
          </Form.Item>
          <div className="cost-share-stat"><Typography.Text type="secondary">Doctor Share</Typography.Text><Statistic value={doctorShare} precision={2} suffix={currency} /></div>
        </Flex>

        <Collapse ghost items={[{
          key: 'breakdown',
          label: <Flex justify="space-between" align="center" style={{ width: '100%' }}><span>Cost Breakdown <Typography.Text type="secondary">(optional)</Typography.Text></span><Typography.Text>{money(expenses)} {currency}</Typography.Text></Flex>,
          children: <>
            <Alert type="info" showIcon message="Optional details" description="Add the costs you know. Doctor Share is calculated automatically from the total minus these expenses." style={{ marginBottom: 16 }} />
            <Flex gap={12} wrap>
              {[
                ['hospitalCost', 'Hospital'], ['nursingCost', 'Nursing'], ['assistantDoctorsCost', 'Assistant Doctors'], ['equipmentCost', 'Equipment'], ['otherCost', 'Other'],
              ].map(([name, label]) => <Form.Item key={name} name={name} label={label} style={{ flex: '1 1 180px' }}><InputNumber min={0} precision={2} style={{ width: '100%' }} addonAfter={currency} /></Form.Item>)}
            </Flex>
            {expenses > total && <Alert type="error" showIcon message="Breakdown exceeds total operation cost" />}
            <Divider />
            <Flex justify="space-between" align="center"><Typography.Text strong>Total Expenses</Typography.Text><Typography.Text strong>{money(expenses)} {currency}</Typography.Text></Flex>
            <Flex justify="space-between" align="center" style={{ marginTop: 8 }}><Typography.Text strong>Doctor Share</Typography.Text><Typography.Text strong>{money(doctorShare)} {currency}</Typography.Text></Flex>
          </>,
        }]} />

        <Space style={{ marginTop: 16 }}><Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={mutation.isPending} disabled={expenses > total}>Save Financials</Button></Space>
      </Form>
    </Card>
  </>;
}
