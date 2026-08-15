import { useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input, Select, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { doctorService } from '@/services/doctor.service';
import { nurseService } from '@/services/nurse.service';
import { useAuthStore } from '@/stores/auth.store';
import type { Doctor, Nurse } from '@/types';
import type { WizardFormData, WizardStepProps } from '../wizardTypes';
import './TeamStep.scss';

export default function TeamStep({
  formData,
  setFormData,
  errors = {},
  clearError = () => {},
}: WizardStepProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors-active'],
    queryFn: () => doctorService.getActive(),
    staleTime: 60_000,
  });

  const { data: nursesData, isLoading: nursesLoading } = useQuery({
    queryKey: ['nurses-active'],
    queryFn: () => nurseService.getActive(),
    staleTime: 60_000,
  });

  const doctors: Doctor[] = doctorsData?.data?.data ?? [];
  const nurses: Nurse[] = nursesData?.data?.data ?? [];

  useEffect(() => {
    if (doctors.length === 0 || formData.doctorIds.length > 0) return;
    const matchDoctor =
      doctors.find((d) => d.id === user?.doctorId) ||
      doctors.find((d) => d.email && d.email === user?.email);
    if (matchDoctor) {
      setFormData((prev) => ({
        ...prev,
        doctorIds: [matchDoctor.id],
        primarySurgeonId: matchDoctor.id,
      }));
    }
  }, [doctors, user?.doctorId, user?.email, formData.doctorIds.length, setFormData]);

  const updateField = useCallback(
    (field: keyof WizardFormData, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as string);
    },
    [setFormData, clearError],
  );

  const doctorOptions = useMemo(
    () =>
      doctors.map((d) => {
        const specialtyNames = (d.specialties ?? []).map((specialty) => specialty.name).join(', ');
        return { value: d.id, label: specialtyNames ? `${d.name} (${specialtyNames})` : d.name };
      }),
    [doctors],
  );

  const nurseOptions = useMemo(
    () => nurses.map((n) => ({ value: n.id, label: n.name })),
    [nurses],
  );

  return (
    <div className="stepContent">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="fieldGroup" data-field="doctorIds">
            <label className="fieldLabel">{t('operations.teamDoctors')}</label>
            <Select
              mode="multiple"
              size="large"
              placeholder={t('operations.selectDoctors')}
              value={formData.doctorIds}
              onChange={(ids: string[]) => {
                updateField('doctorIds', ids);
                updateField('primarySurgeonId', ids[0] ?? '');
              }}
              allowClear
              showSearch
              optionFilterProp="label"
              options={doctorOptions}
              maxTagCount="responsive"
              style={{ width: '100%' }}
              loading={doctorsLoading}
              status={errors.doctorIds ? 'error' : undefined}
            />
            {errors.doctorIds && <div className="fieldError">{errors.doctorIds}</div>}
          </div>
        </Col>
        <Col xs={24}>
          <div className="fieldGroup" data-field="nurseIds">
            <label className="fieldLabel">{t('operations.teamNurses')}</label>
            <Select
              mode="multiple"
              size="large"
              placeholder={t('operations.selectNurses')}
              value={formData.nurseIds}
              onChange={(ids: string[]) => updateField('nurseIds', ids)}
              allowClear
              showSearch
              optionFilterProp="label"
              options={nurseOptions}
              maxTagCount="responsive"
              style={{ width: '100%' }}
              loading={nursesLoading}
              status={errors.nurseIds ? 'error' : undefined}
            />
            {errors.nurseIds && <div className="fieldError">{errors.nurseIds}</div>}
          </div>
        </Col>
        <Col xs={24}>
          <div className="fieldGroup" data-field="teamNotes">
            <label className="fieldLabel">{t('operations.teamNotes')}</label>
            <Input.TextArea
              rows={3}
              placeholder={t('operations.teamNotes')}
              value={formData.teamNotes}
              onChange={(e) => updateField('teamNotes', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
