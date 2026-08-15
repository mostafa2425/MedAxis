import { useEffect, useMemo } from 'react';
import { Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { getSpecialtyLabel } from '@/utils/helpers';
import type { Specialty } from '@/types';

interface SpecialtyFieldsProps {
  specialties: Specialty[];
  loading?: boolean;
  specialtyLabel?: string;
  specialtyPlaceholder?: string;
  subspecialtyLabel?: string;
  subspecialtyPlaceholder?: string;
}

export default function SpecialtyFields({
  specialties,
  loading = false,
  specialtyLabel,
  specialtyPlaceholder,
  subspecialtyLabel,
  subspecialtyPlaceholder,
}: SpecialtyFieldsProps) {
  const { t, i18n } = useTranslation();
  const form = Form.useFormInstance();
  const specialtyIds: string[] = Form.useWatch('specialtyIds', form) ?? [];

  const topLevel = useMemo(
    () => specialties.filter((specialty) => !specialty.parentId),
    [specialties],
  );

  const availableAreas = useMemo(
    () =>
      specialties.filter(
        (specialty) => specialty.parentId && specialtyIds.includes(specialty.parentId),
      ),
    [specialties, specialtyIds],
  );

  const allowedIds = useMemo(
    () => availableAreas.map((area) => area.id).sort().join(','),
    [availableAreas],
  );

  useEffect(() => {
    const current: string[] = form.getFieldValue('subspecialtyIds') ?? [];
    if (current.length === 0) return;
    const allowed = new Set(allowedIds ? allowedIds.split(',') : []);
    const next = current.filter((id) => allowed.has(id));
    if (next.length !== current.length) {
      form.setFieldsValue({ subspecialtyIds: next });
    }
  }, [allowedIds, form]);

  return (
    <>
      <Form.Item
        name="specialtyIds"
        label={specialtyLabel ?? t('auth.specialties')}
        rules={[
          { required: true, message: t('auth.specialtiesRequired') },
          { type: 'array', min: 1, message: t('auth.specialtiesRequired') },
        ]}
      >
        <Select
          mode="multiple"
          allowClear
          showSearch
          optionFilterProp="label"
          maxTagCount="responsive"
          placeholder={specialtyPlaceholder ?? t('auth.selectSpecialties')}
          size="large"
          loading={loading}
          options={topLevel.map((specialty) => ({
            value: specialty.id,
            label: getSpecialtyLabel(specialty, i18n.language),
          }))}
        />
      </Form.Item>

      {availableAreas.length > 0 && (
        <Form.Item
          name="subspecialtyIds"
          label={subspecialtyLabel ?? t('auth.areasOfExpertise')}
        >
          <Select
            mode="multiple"
            allowClear
            showSearch
            optionFilterProp="label"
            maxTagCount="responsive"
            placeholder={subspecialtyPlaceholder ?? t('auth.selectAreas')}
            size="large"
            options={availableAreas.map((specialty) => ({
              value: specialty.id,
              label: getSpecialtyLabel(specialty, i18n.language),
            }))}
          />
        </Form.Item>
      )}
    </>
  );
}
