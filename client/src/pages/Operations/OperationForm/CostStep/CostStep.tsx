import { useCallback } from 'react';
import { Alert, Collapse, Input, Select, InputNumber, Tag, Row, Col, Flex, Typography } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { formatCurrency, calculateRemaining, resolvePaidAmount } from '@/utils/helpers';
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '@/utils/constants';
import { PaymentMethod, PaymentStatus } from '@/types';
import type { WizardFormData, WizardStepProps } from '../wizardTypes';
import './CostStep.scss';

export default function CostStep({ formData, setFormData, errors = {}, clearError = () => {} }: WizardStepProps) {
  const { t } = useTranslation();
  const currency = t('common.currency');
  const isPartial = formData.paymentStatus === PaymentStatus.Partial;
  const remaining = calculateRemaining(formData.totalCost, formData.paidAmount);
  const expenses = formData.hospitalCost + formData.nursingCost + formData.assistantDoctorsCost + formData.equipmentCost + formData.otherCost;
  const doctorShare = Math.max(formData.totalCost - expenses, 0);
  const updateFields = useCallback((patch: Partial<WizardFormData>) => { setFormData((prev) => ({ ...prev, ...patch })); Object.keys(patch).forEach((field) => clearError(field)); }, [setFormData, clearError]);
  const applyPayment = useCallback((total: number, paid: number, status: PaymentStatus) => { updateFields({ totalCost: total, paidAmount: resolvePaidAmount(total, paid, status), paymentStatus: status }); }, [updateFields]);
  const costInput = (field: keyof WizardFormData, label: string) => <div className="fieldGroup"><label className="fieldLabel">{label} ({currency})</label><InputNumber min={0} size="large" value={formData[field] as number} onChange={(v) => updateFields({ [field]: v ?? 0 } as Partial<WizardFormData>)} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => Number(value?.replace(/,/g, '') ?? 0)} /></div>;

  return <div className="stepContent">
    <div className={`costSummary ${remaining > 0 ? 'costSummary--due' : 'costSummary--clear'}`}>
      <div className="costSummaryItem"><span className="costSummaryLabel">{t('operations.totalCost')}</span><strong>{formatCurrency(formData.totalCost, currency)}</strong></div>
      <div className="costSummaryItem"><span className="costSummaryLabel">{t('operations.paidAmount')}</span><strong>{formatCurrency(formData.paidAmount, currency)}</strong></div>
      <div className="costSummaryItem costSummaryItem--remaining"><span className="costSummaryLabel"><DollarOutlined /> {t('operations.remainingAmount')}</span><strong>{formatCurrency(remaining, currency)}</strong><Tag className="autoCalculatedTag">{t('operations.autoCalculated')}</Tag></div>
      <div className="costSummaryItem"><span className="costSummaryLabel">Doctor Share</span><strong>{formatCurrency(doctorShare, currency)}</strong></div>
    </div>
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8}><div className="fieldGroup" data-field="totalCost"><label className="fieldLabel">{t('operations.totalCost')} <span className="required">*</span> ({currency})</label><InputNumber size="large" min={0} max={99999999} value={formData.totalCost} onChange={(v) => applyPayment(v ?? 0, formData.paidAmount, formData.paymentStatus)} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => Number(value?.replace(/,/g, '') ?? 0)} status={errors.totalCost ? 'error' : undefined} />{errors.totalCost && <div className="fieldError">{errors.totalCost}</div>}</div></Col>
      <Col xs={24} sm={12} md={8}><div className="fieldGroup"><label className="fieldLabel">{t('operations.paymentStatus')}</label><Select size="large" value={formData.paymentStatus} onChange={(v: PaymentStatus) => applyPayment(formData.totalCost, formData.paidAmount, v)} style={{ width: '100%' }} options={PAYMENT_STATUSES.map((s) => ({ value: s.value, label: s.label }))} /></div></Col>
      {isPartial && <Col xs={24} sm={12} md={8}><div className="fieldGroup"><label className="fieldLabel">{t('operations.paidAmount')} ({currency})</label><InputNumber size="large" min={0} max={formData.totalCost} value={formData.paidAmount} onChange={(v) => applyPayment(formData.totalCost, v ?? 0, formData.paymentStatus)} style={{ width: '100%' }} /></div></Col>}
      <Col xs={24} sm={12} md={8}><div className="fieldGroup"><label className="fieldLabel">{t('operations.paymentMethod')}</label><Select size="large" value={formData.paymentMethod} onChange={(v: PaymentMethod) => updateFields({ paymentMethod: v })} style={{ width: '100%' }} options={PAYMENT_METHODS.map((m) => ({ value: m.value, label: m.label }))} /></div></Col>
      <Col xs={24} md={8}><div className="fieldGroup"><label className="fieldLabel">{t('operations.paymentNotes')}</label><Input.TextArea rows={1} placeholder={t('operations.paymentNotes')} value={formData.paymentNotes} onChange={(e) => updateFields({ paymentNotes: e.target.value })} /></div></Col>
    </Row>
    <Collapse ghost style={{ marginTop: 20 }} items={[{ key: 'breakdown', label: <Flex justify="space-between" align="center"><span>Cost Breakdown <Typography.Text type="secondary">(optional)</Typography.Text></span><Typography.Text>{formatCurrency(expenses, currency)}</Typography.Text></Flex>, children: <><Alert type="info" showIcon message="Optional cost details" description="Add known expenses. Doctor Share is calculated automatically." style={{ marginBottom: 16 }} /><Row gutter={[16, 16]}><Col xs={24} sm={12} md={8}>{costInput('hospitalCost', 'Hospital')}</Col><Col xs={24} sm={12} md={8}>{costInput('nursingCost', 'Nursing')}</Col><Col xs={24} sm={12} md={8}>{costInput('assistantDoctorsCost', 'Assistant Doctors')}</Col><Col xs={24} sm={12} md={8}>{costInput('equipmentCost', 'Equipment')}</Col><Col xs={24} sm={12} md={8}>{costInput('otherCost', 'Other')}</Col></Row>{expenses > formData.totalCost && <Alert type="error" showIcon message="Cost breakdown cannot exceed total operation cost" />}<Flex justify="space-between" style={{ marginTop: 16 }}><Typography.Text strong>Total Expenses</Typography.Text><Typography.Text strong>{formatCurrency(expenses, currency)}</Typography.Text></Flex><Flex justify="space-between" style={{ marginTop: 8 }}><Typography.Text strong>Doctor Share</Typography.Text><Typography.Text strong>{formatCurrency(doctorShare, currency)}</Typography.Text></Flex></> }]} />
  </div>;
}
