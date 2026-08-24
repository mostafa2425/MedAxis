import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Input,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Divider,
  Empty,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { hospitalService } from '@/services/hospital.service';
import { operationCatalogService } from '@/services/operationCatalog.service';
import {
  parseApiValidationErrors,
  applyValidationErrorsToAntdForm,
} from '@/utils/apiValidationErrors';
import { OPERATION_STATUSES } from '@/utils/constants';
import { getSpecialtyLabel } from '@/utils/helpers';
import { useAuth } from '@/hooks/useAuth';
import { OperationStatus, type Hospital, type OperationCatalogItem } from '@/types';
import type { WizardFormData, WizardStepProps, WizardFormSetter } from '../wizardTypes';
import './OperationDetailsStep.scss';

interface OperationDetailsStepProps extends Omit<WizardStepProps, 'setFormData'> {
  setFormData?: WizardFormSetter;
  hospitals?: Hospital[];
  specialties?: unknown[];
  onChange?: (patch: Partial<WizardFormData>) => void;
  onClearError?: (field: string) => void;
}

export default function OperationDetailsStep({
  formData,
  setFormData: providedSetFormData,
  errors = {},
  clearError: providedClearError,
  onChange,
  onClearError,
}: OperationDetailsStepProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [customOpen, setCustomOpen] = useState(false);
  const [customForm] = Form.useForm<{ name: string }>();

  const setFormData = useCallback<WizardFormSetter>(
    (updater) => {
      if (providedSetFormData) {
        providedSetFormData(updater);
        return;
      }

      if (onChange) {
        const previous = formData;
        const next = typeof updater === 'function' ? updater(previous) : updater;
        const patch = Object.keys(next).reduce((acc, key) => {
          const typedKey = key as keyof WizardFormData;
          if (next[typedKey] !== previous[typedKey]) {
            (acc as Record<string, unknown>)[key] = next[typedKey];
          }
          return acc;
        }, {} as Partial<WizardFormData>);
        onChange(patch);
      }
    },
    [providedSetFormData, onChange, formData],
  );

  const clearError = useCallback(
    (field: string) => {
      (providedClearError ?? onClearError)?.(field);
    },
    [providedClearError, onClearError],
  );

  const { data: hospitalsData } = useQuery({
    queryKey: ['hospitals-active'],
    queryFn: () => hospitalService.getActive(),
    staleTime: 60_000,
    enabled: !providedSetFormData && !onChange,
  });

  const { data: catalogData, isLoading: catalogLoading } = useQuery({
    queryKey: ['operation-catalog'],
    queryFn: () => operationCatalogService.getAll(),
    staleTime: 30_000,
  });

  const hospitalsFromApi: Hospital[] = useMemo(() => hospitalsData?.data?.data ?? [], [hospitalsData]);
  const hospitals: Hospital[] = providedSetFormData || !onChange ? hospitalsFromApi : (hospitalsFromApi.length ? hospitalsFromApi : []);
  const catalogItems: OperationCatalogItem[] = useMemo(
    () => (Array.isArray(catalogData?.data?.data) ? catalogData.data.data : []),
    [catalogData],
  );

  const updateField = useCallback(
    (field: keyof WizardFormData, value: unknown) => {
      if (providedSetFormData) {
        providedSetFormData((prev) => ({ ...prev, [field]: value }));
      } else {
        onChange?.({ [field]: value } as Partial<WizardFormData>);
      }
      clearError(field as string);
    },
    [providedSetFormData, onChange, clearError],
  );

  const groupedOptions = useMemo(() => {
    const preferredAreas = new Set((user?.subspecialties ?? []).map((area) => area.id));
    const custom = catalogItems.filter((item) => item.isCustom);
    const groupsByKey = new Map<string, { order: number; label: string; items: OperationCatalogItem[] }>();

    for (const item of catalogItems) {
      if (item.isCustom) continue;
      const area = item.subspecialty;
      const specialty = item.specialty;
      const key = area?.id ?? `specialty-${specialty?.id ?? 'other'}`;
      const label = area
        ? getSpecialtyLabel(area, i18n.language)
        : specialty
          ? getSpecialtyLabel(specialty, i18n.language)
          : t('operations.commonOperations');
      const order = area && preferredAreas.has(area.id) ? 0 : 1;
      const group = groupsByKey.get(key) ?? { order, label, items: [] };
      group.items.push(item);
      groupsByKey.set(key, group);
    }

    const groups = [...groupsByKey.values()]
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
      .map((group) => ({
        label: group.label,
        options: group.items.map((item) => ({
          value: item.id,
          label: i18n.language.startsWith('ar') && item.nameAr ? item.nameAr : item.name,
        })),
      }));

    if (custom.length > 0) {
      groups.unshift({
        label: t('operations.customOperations'),
        options: custom.map((item) => ({ value: item.id, label: item.name })),
      });
    }

    return groups;
  }, [catalogItems, i18n.language, t, user?.subspecialties]);

  const handleOperationChange = (catalogIds: string[]) => {
    const selected = catalogItems.filter((item) => catalogIds.includes(item.id));
    const first = selected[0];
    const patch: Partial<WizardFormData> = {
      operationIds: catalogIds,
      operationId: first?.id ?? '',
      name: selected.map((item) => item.name).join(' + '),
      specialtyId: first?.specialty?.id ?? formData.specialtyId,
    };
    if (providedSetFormData) {
      providedSetFormData((prev) => ({ ...prev, ...patch }));
    } else {
      onChange?.(patch);
    }
    clearError('operationId');
    clearError('operationIds');
    clearError('name');
  };

  const createCustomMutation = useMutation({
    mutationFn: (name: string) => operationCatalogService.createCustom(name),
    onSuccess: async (response) => {
      const created = response.data.data;
      await queryClient.invalidateQueries({ queryKey: ['operation-catalog'] });
      const nextIds = formData.operationIds.includes(created.id) ? formData.operationIds : [...formData.operationIds, created.id];
      const selected = [...catalogItems, created].filter((item) => nextIds.includes(item.id));
      const patch: Partial<WizardFormData> = {
        operationIds: nextIds,
        operationId: nextIds[0] ?? created.id,
        name: selected.map((item) => item.name).join(' + ') || created.name,
        specialtyId: created.specialty?.id ?? formData.specialtyId,
      };
      if (providedSetFormData) {
        providedSetFormData((prev) => ({ ...prev, ...patch }));
      } else {
        onChange?.(patch);
      }
      clearError('operationId');
      clearError('name');
      setCustomOpen(false);
      customForm.resetFields();
      message.success(t('operations.customOperationCreated'));
    },
    onError: (error) => {
      const issues = parseApiValidationErrors(error);
      const applied = applyValidationErrorsToAntdForm(customForm, issues, t, {
        labelKeys: { name: 'operations.customOperationName' },
      });
      message.error(applied ? t('validation.fixHighlightedFields') : t('common.operationFailed'));
    },
  });

  const onAddCustom = async () => {
    try {
      const values = await customForm.validateFields();
      await createCustomMutation.mutateAsync(values.name.trim());
    } catch {
      // antd form validation handles field errors
    }
  };

  const isNewOperation = !formData.operationId || formData.status === OperationStatus.Scheduled;

  return (
    <div className="stepContent">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="fieldGroup" data-field="operationIds">
            <label className="fieldLabel">{t('operations.surgicalProcedures')} <span className="required">*</span></label>
            <Select
              size="large"
              mode="multiple"
              showSearch
              allowClear
              optionFilterProp="label"
              placeholder={t('operations.searchOperation')}
              value={formData.operationIds.length > 0 ? formData.operationIds : undefined}
              onChange={handleOperationChange}
              options={groupedOptions}
              loading={catalogLoading}
              style={{ width: '100%' }}
              maxTagCount="responsive"
              status={errors.operationIds || errors.operationId || errors.name ? 'error' : undefined}
              notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('operations.noOperationsFound')} />}
              popupRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setCustomOpen(true)}
                    block
                    className="addCustomOperationBtn"
                  >
                    {t('operations.addCustomOperation')}
                  </Button>
                </>
              )}
            />
            {(errors.operationIds || errors.operationId || errors.name) && <div className="fieldError">{errors.operationIds || errors.operationId || errors.name}</div>}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="fieldGroup" data-field="diagnosis">
            <label className="fieldLabel">{t('operations.diagnosis')}</label>
            <Input size="large" placeholder={t('operations.diagnosis')} value={formData.diagnosis} onChange={(e) => updateField('diagnosis', e.target.value)} allowClear status={errors.diagnosis ? 'error' : undefined} />
            {errors.diagnosis && <div className="fieldError">{errors.diagnosis}</div>}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="fieldGroup" data-field="hospitalId">
            <label className="fieldLabel">{t('operations.hospital')} <span className="required">*</span></label>
            <Select size="large" placeholder={t('operations.selectHospital')} value={formData.hospitalId || undefined} onChange={(v: string) => updateField('hospitalId', v)} allowClear showSearch optionFilterProp="label" options={hospitals.map((h) => ({ value: h.id, label: h.name }))} style={{ width: '100%' }} status={errors.hospitalId ? 'error' : undefined} />
            {errors.hospitalId && <div className="fieldError">{errors.hospitalId}</div>}
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="fieldGroup" data-field="operationDate">
            <label className="fieldLabel">{t('operations.operationDate')} <span className="required">*</span></label>
            <DatePicker
              size="large"
              value={formData.operationDate ? dayjs(formData.operationDate) : null}
              onChange={(d) => updateField('operationDate', d?.format('YYYY-MM-DD') ?? '')}
              disabledDate={(current) => isNewOperation && current.isBefore(dayjs().startOf('day'))}
              style={{ width: '100%' }}
              placeholder={t('operations.operationDate')}
              status={errors.operationDate ? 'error' : undefined}
            />
            {errors.operationDate && <div className="fieldError">{errors.operationDate}</div>}
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="fieldGroup" data-field="operationTime">
            <label className="fieldLabel">{t('operations.operationTime')} <span className="required">*</span></label>
            <TimePicker size="large" value={formData.operationTime ? dayjs(formData.operationTime, 'HH:mm') : null} onChange={(t2) => updateField('operationTime', t2?.format('HH:mm') ?? '')} format="HH:mm" style={{ width: '100%' }} placeholder={t('operations.operationTime')} needConfirm={false} status={errors.operationTime ? 'error' : undefined} />
            {errors.operationTime && <div className="fieldError">{errors.operationTime}</div>}
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="fieldGroup" data-field="operationRoom">
            <label className="fieldLabel">{t('operations.operationRoom')}</label>
            <Input size="large" placeholder={t('operations.operationRoom')} value={formData.operationRoom} onChange={(e) => updateField('operationRoom', e.target.value)} allowClear status={errors.operationRoom ? 'error' : undefined} />
            {errors.operationRoom && <div className="fieldError">{errors.operationRoom}</div>}
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="fieldGroup" data-field="duration">
            <label className="fieldLabel">{t('operations.durationMinutes')}</label>
            <InputNumber size="large" placeholder={t('operations.durationMinutes')} min={1} max={1440} value={formData.duration} onChange={(v) => updateField('duration', v)} style={{ width: '100%' }} addonAfter={t('common.minutes') || 'min'} status={errors.duration ? 'error' : undefined} />
            {errors.duration && <div className="fieldError">{errors.duration}</div>}
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="fieldGroup" data-field="status">
            <label className="fieldLabel">{t('operations.status')}</label>
            <Select
              size="large"
              value={formData.status}
              onChange={(v: OperationStatus) => updateField('status', v)}
              style={{ width: '100%' }}
              status={errors.status ? 'error' : undefined}
              options={OPERATION_STATUSES.map((s) => ({
                value: s.value,
                label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />{s.label}</span>,
              }))}
            />
            {errors.status && <div className="fieldError">{errors.status}</div>}
          </div>
        </Col>
      </Row>

      <Modal title={t('operations.addCustomOperation')} open={customOpen} onCancel={() => { setCustomOpen(false); customForm.resetFields(); }} onOk={onAddCustom} confirmLoading={createCustomMutation.isPending} okText={t('common.add')} cancelText={t('common.cancel')} destroyOnClose>
        <Form form={customForm} layout="vertical">
          <Form.Item name="name" label={t('operations.customOperationName')} rules={[{ required: true, message: t('validation.required') }]}>
            <Input size="large" placeholder={t('operations.customOperationName')} autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
