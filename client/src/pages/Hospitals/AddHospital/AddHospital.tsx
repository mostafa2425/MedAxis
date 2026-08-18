import { useEffect } from 'react';
import { Modal, Form, Input, Button, Space, Row, Col, Select, Typography, Flex, message } from 'antd';
import { BankOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { hospitalService } from '@/services/hospital.service';
import { governorateService } from '@/services/governorate.service';
import { parseApiValidationErrors, applyValidationErrorsToAntdForm } from '@/utils/apiValidationErrors';
import type { Hospital } from '@/types';
import './AddHospital.scss';

interface HospitalFormValues { name: string; nameAr?: string; address?: string; city?: string; governorateId?: string; phone?: string; notes?: string; }
interface HospitalWithGovernorate extends Hospital { governorateId?: string | null; governorate?: { id: string; nameEn: string; nameAr: string } | null; }
interface AddHospitalProps { open: boolean; hospital: Hospital | null; onClose: () => void; }

export default function AddHospital({ open, hospital, onClose }: AddHospitalProps) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<HospitalFormValues>();
  const isEdit = Boolean(hospital);
  const { data: governoratesData, isLoading: governoratesLoading } = useQuery({ queryKey: ['governorates'], queryFn: () => governorateService.getAll(), enabled: open });
  const governorates = governoratesData?.data?.data ?? [];
  useEffect(() => { if (!open) return; if (hospital) { const item = hospital as HospitalWithGovernorate; form.setFieldsValue({ name: item.name, nameAr: item.nameAr || undefined, address: item.address || undefined, city: item.city || undefined, governorateId: item.governorateId || item.governorate?.id || undefined, phone: item.phone || undefined, notes: item.notes || undefined }); } else form.resetFields(); }, [open, hospital, form]);
  const handleFormError = (error: unknown) => { const issues = parseApiValidationErrors(error); const applied = applyValidationErrorsToAntdForm(form, issues, t, { labelKeys: { name: 'hospitals.name', governorateId: 'hospitals.city' } }); messageApi.error(applied ? t('validation.fixHighlightedFields') : t('common.operationFailed')); };
  const createMutation = useMutation({ mutationFn: hospitalService.create, onSuccess: () => { messageApi.success(t('hospitals.hospitalCreated')); queryClient.invalidateQueries({ queryKey: ['hospitals'] }); onClose(); }, onError: handleFormError });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<HospitalFormValues> }) => hospitalService.update(id, data), onSuccess: () => { messageApi.success(t('hospitals.hospitalUpdated')); queryClient.invalidateQueries({ queryKey: ['hospitals'] }); onClose(); }, onError: handleFormError });
  const onFinish = (values: HospitalFormValues) => { const payload = { name: values.name, nameAr: values.nameAr || undefined, address: values.address || undefined, city: values.city || undefined, governorateId: values.governorateId || undefined, phone: values.phone || undefined, notes: values.notes || undefined }; if (hospital) updateMutation.mutate({ id: hospital.id, data: payload }); else createMutation.mutate(payload as Parameters<typeof hospitalService.create>[0]); };
  return <>{contextHolder}<Modal title={isEdit ? t('hospitals.editHospital') : t('hospitals.addHospital')} open={open} onCancel={onClose} footer={null} destroyOnClose width={620} centered className="addHospitalModal"><div className="hospitalFormIntro"><Typography.Text type="secondary">{t('hospitals.formHint', { defaultValue: 'Only hospital name and governorate are required. Add the remaining details when available.' })}</Typography.Text></div><Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional" className="addHospitalForm"><Row gutter={[16, 0]}><Col xs={24} md={16}><Form.Item name="name" label={t('hospitals.name')} rules={[{ required: true, message: t('validation.required') }]}><Input prefix={<BankOutlined />} placeholder={t('hospitals.name')} size="large" /></Form.Item></Col><Col xs={24} md={8}><Form.Item name="nameAr" label={t('hospitals.nameAr')}><Input placeholder={t('hospitals.nameAr')} size="large" /></Form.Item></Col><Col xs={24} md={12}><Form.Item name="governorateId" label={t('hospitals.city', { defaultValue: 'Governorate' })} rules={[{ required: true, message: t('validation.required') }]}><Select showSearch size="large" loading={governoratesLoading} optionFilterProp="label" placeholder={t('hospitals.city', { defaultValue: 'Select governorate' })} options={governorates.map((g) => ({ value: g.id, label: i18n.language.startsWith('ar') ? g.nameAr : g.nameEn }))} /></Form.Item></Col><Col xs={24} md={12}><Form.Item name="city" label={t('hospitals.district', { defaultValue: 'District / Area' })}><Input prefix={<EnvironmentOutlined />} placeholder={t('hospitals.district', { defaultValue: 'Optional area or district' })} size="large" /></Form.Item></Col><Col xs={24} md={12}><Form.Item name="address" label={t('hospitals.address')}><Input prefix={<EnvironmentOutlined />} placeholder={t('hospitals.address')} size="large" /></Form.Item></Col><Col xs={24} md={12}><Form.Item name="phone" label={t('hospitals.phone')}><Input prefix={<PhoneOutlined />} placeholder={t('hospitals.phone')} size="large" /></Form.Item></Col><Col xs={24}><Form.Item name="notes" label={t('hospitals.notes')}><Input.TextArea placeholder={t('hospitals.notes')} rows={3} /></Form.Item></Col></Row><Form.Item style={{ marginBottom: 0 }}><Flex justify="end"><Space><Button onClick={onClose}>{t('common.cancel')}</Button><Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>{t('common.save')}</Button></Space></Flex></Form.Item></Form></Modal></>;
}
