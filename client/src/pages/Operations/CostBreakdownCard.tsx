import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Collapse, Divider, Flex, Form, InputNumber, Space, Statistic, Tag, Typography, message } from 'antd';
import { DollarOutlined, SaveOutlined } from '@ant-design/icons';
import { operationService, type OperationCostBreakdownPayload } from '@/services/operation.service';
import type { OperationCost } from '@/types';

interface Props { operationId: string; cost?: OperationCost | null; currency?: string; }
type Values = OperationCostBreakdownPayload;

const money = (value: number) => new Intl.NumberFormat('en-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value || 0);

const MoneyInput = ({ currency, value, onChange }: { currency: string; value?: number; onChange?: (value: number | null) => void }) => (
  <Space.Compact className="moneyInput" block>
    <InputNumber
      min={0}
      precision={2}
      value={value}
      onChange={onChange}
      controls={false}
      inputMode="decimal"
      formatter={(displayValue) => displayValue ? String(displayValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
      parser={(displayValue) => displayValue?.replace(/,/g, '') ?? ''}
    />
    <Typography.Text className="moneyCurrency">{currency}</Typography.Text>
  </Space.Compact>
);

export default function CostBreakdownCard({ operationId, cost, currency = 'EGP' }: Props) {
  const [form] = Form.useForm<Values>();
  const queryClient = useQueryClient();
  const [messageApi, holder] = message.useMessage();
  const values = Form.useWatch([], form) as Values | undefined;
  const total = Number(values?.totalCost ?? cost?.totalCost ?? 0);
  const expenses = ['hospitalCost', 'nursingCost', 'assistantDoctorsCost', 'equipmentCost', 'otherCost'].reduce((sum, key) => sum + Number(values?.[key as keyof Values] ?? 0), 0);
  const doctorShare = Math.max(total - expenses, 0);
  const sharePercentage = total > 0 ? Math.min((doctorShare / total) * 100, 100) : 0;

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
    onSuccess: () => { messageApi.success('Financials updated'); queryClient.invalidateQueries({ queryKey: ['operation-detail', operationId] }); },
    onError: () => messageApi.error('Unable to update operation financials'),
  });

  const breakdownItems = [
    ['hospitalCost', 'Hospital'],
    ['nursingCost', 'Nursing'],
    ['assistantDoctorsCost', 'Assistant Doctors'],
    ['equipmentCost', 'Equipment'],
    ['otherCost', 'Other'],
  ] as const;

  return <>
    {holder}
    <Card className="cost-card financials-card" bordered={false}>
      <Flex justify="space-between" align="flex-start" gap={16} wrap className="financialsHeader">
        <Flex align="center" gap={12}>
          <div className="financialsIcon"><DollarOutlined /></div>
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>Financials</Typography.Title>
            <Typography.Text type="secondary">Operation revenue, expenses and your calculated share.</Typography.Text>
          </div>
        </Flex>
        <Tag color="blue" className="currencyTag">{currency}</Tag>
      </Flex>

      <Form form={form} layout="vertical" onFinish={(data) => mutation.mutate(data)}>
        <div className="financialsTopGrid">
          <div className="totalCostField">
            <Form.Item name="totalCost" label="Total Operation Cost" rules={[{ required: true, message: 'Enter total cost' }]}>
              <MoneyInput currency={currency} />
            </Form.Item>
          </div>
          <div className="doctorShareCard">
            <Flex justify="space-between" align="flex-start" gap={8}>
              <div><Typography.Text type="secondary">Doctor Share</Typography.Text><Typography.Title level={2} className="doctorShareValue">{money(doctorShare)} <small>{currency}</small></Typography.Title></div>
              <Tag color={sharePercentage >= 50 ? 'green' : 'gold'}>{sharePercentage.toFixed(0)}%</Tag>
            </Flex>
            <Typography.Text type="secondary">Total cost minus recorded expenses</Typography.Text>
          </div>
        </div>

        <Collapse
          className="costBreakdownCollapse"
          items={[{
            key: 'breakdown',
            label: <Flex justify="space-between" align="center" gap={12} style={{ width: '100%' }}><Flex align="center" gap={8}><span className="collapseDot" /><Typography.Text strong>Cost Breakdown</Typography.Text></Flex><Typography.Text strong>{money(expenses)} {currency}</Typography.Text></Flex>,
            children: <>
              <Typography.Paragraph type="secondary" className="breakdownIntro">Add only the expenses you know. The doctor share updates instantly.</Typography.Paragraph>
              <div className="breakdownGrid">
                {breakdownItems.map(([name, label]) => <Form.Item key={name} name={name} label={label}><MoneyInput currency={currency} /></Form.Item>)}
              </div>
              {expenses > total && <div className="cost-breakdown-error">Breakdown exceeds total operation cost. Reduce the expenses before saving.</div>}
              <Divider />
              <div className="financialTotals">
                <Flex justify="space-between"><Typography.Text type="secondary">Total Expenses</Typography.Text><Typography.Text strong>{money(expenses)} {currency}</Typography.Text></Flex>
                <Flex justify="space-between" className="doctorShareRow"><Typography.Text strong>Doctor Share</Typography.Text><Typography.Text strong>{money(doctorShare)} {currency}</Typography.Text></Flex>
              </div>
            </>,
          }]}
        />

        <Flex justify="flex-end" className="financialsActions">
          <Button type="primary" size="large" icon={<SaveOutlined />} htmlType="submit" loading={mutation.isPending} disabled={expenses > total}>Save Financials</Button>
        </Flex>
      </Form>
    </Card>
  </>;
}
