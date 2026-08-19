import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, InputNumber, Select, Spin } from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  PhoneOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { patientService } from '@/services/patient.service';
import { useDebounce } from '@/hooks/useDebounce';
import { GENDERS } from '@/utils/constants';
import { Gender, type Patient } from '@/types';
import type { WizardStepProps } from '../wizardTypes';
import './PatientStep.scss';

const PATIENT_LIST_LIMIT = 10;

function formatPatientOption(patient: Patient) {
  const meta = [patient.mobile, patient.age ? `${patient.age}` : null]
    .filter(Boolean)
    .join(' · ');
  return meta ? `${patient.fullName} — ${meta}` : patient.fullName;
}

export default function PatientStep({
  formData,
  setFormData,
  errors = {},
  clearError = () => {},
}: WizardStepProps) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 350);
  const preselectedPatientId = searchParams.get('patientId');

  const { data: patientsData, isFetching: patientsLoading } = useQuery({
    queryKey: ['patient-search', debouncedSearch],
    queryFn: () => patientService.search(debouncedSearch, PATIENT_LIST_LIMIT),
    staleTime: 10_000,
  });

  const { data: preselectedPatientData } = useQuery({
    queryKey: ['patient-prefill', preselectedPatientId],
    queryFn: () => patientService.getById(preselectedPatientId!),
    enabled: Boolean(preselectedPatientId && !formData.patientId),
    staleTime: 60_000,
  });

  const patients: Patient[] = patientsData?.data?.data ?? [];

  useEffect(() => {
    if (!preselectedPatientId || formData.patientId) return;

    const patient = preselectedPatientData?.data?.data;
    if (!patient) return;

    setFormData((prev) => ({
      ...prev,
      patientId: patient.id,
      selectedPatientName: patient.fullName,
      selectedPatientMobile: patient.mobile || '',
      isNewPatient: false,
      patientSearchQuery: patient.fullName,
    }));
    clearError('patientId');
  }, [preselectedPatientId, preselectedPatientData, formData.patientId, setFormData, clearError]);

  const selectOptions = useMemo(() => {
    const options = patients.map((p) => ({
      value: p.id,
      label: formatPatientOption(p),
      patient: p,
    }));

    if (
      formData.patientId &&
      formData.selectedPatientName &&
      !options.some((o) => o.value === formData.patientId)
    ) {
      options.unshift({
        value: formData.patientId,
        label: formData.selectedPatientMobile
          ? `${formData.selectedPatientName} — ${formData.selectedPatientMobile}`
          : formData.selectedPatientName,
        patient: {
          id: formData.patientId,
          fullName: formData.selectedPatientName,
          mobile: formData.selectedPatientMobile || null,
        } as Patient,
      });
    }

    return options;
  }, [patients, formData.patientId, formData.selectedPatientName, formData.selectedPatientMobile]);

  const handleSelectPatient = useCallback(
    (patientId: string, option?: { patient?: Patient }) => {
      const patient = option?.patient ?? patients.find((p) => p.id === patientId);
      if (!patient) return;

      setFormData((prev) => ({
        ...prev,
        patientId: patient.id,
        selectedPatientName: patient.fullName,
        selectedPatientMobile: patient.mobile || '',
        isNewPatient: false,
        patientSearchQuery: patient.fullName,
      }));
      setSearchQuery('');
      clearError('patientId');
    },
    [setFormData, clearError, patients],
  );

  const handleClearSelection = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      patientId: '',
      selectedPatientName: '',
      selectedPatientMobile: '',
      isNewPatient: false,
      patientSearchQuery: '',
    }));
    setSearchQuery('');
  }, [setFormData]);

  const handleCreateNew = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      patientId: '',
      selectedPatientName: '',
      selectedPatientMobile: '',
      isNewPatient: true,
      patientSearchQuery: searchQuery,
      newPatientName: searchQuery || prev.newPatientName,
    }));
    clearError('patientId');
  }, [setFormData, clearError, searchQuery]);

  const handleBackToSearch = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      isNewPatient: false,
      patientId: '',
      selectedPatientName: '',
      selectedPatientMobile: '',
    }));
  }, [setFormData]);

  if (formData.isNewPatient) {
    return (
      <div className="patientStep"> 
        <div className="patientStepCard patientStepCard--form">
          <div className="newPatientHeader">
            <Button type="text" size="small" icon={<ArrowLeftOutlined />} onClick={handleBackToSearch} className="backToSearchBtn">
              {t('operations.searchExistingPatient')}
            </Button>
            <div className="newPatientHeaderText">
              <h3 className="patientCardTitle">{t('operations.createNewProfile')}</h3>
              <p className="patientCardDesc">{t('operations.createNewProfileHint')}</p>
            </div>
          </div>

          <div className="compactNewPatient">
            <div className="fieldGroup" data-field="newPatientName">
              <label className="fieldLabel">{t('patients.fullName')} <span className="required">*</span></label>
              <Input size="large" prefix={<UserOutlined />} placeholder={t('patients.fullName')} value={formData.newPatientName} onChange={(e) => setFormData((prev) => ({ ...prev, newPatientName: e.target.value }))} status={errors.newPatientName ? 'error' : undefined} allowClear autoFocus />
              {errors.newPatientName && <span className="fieldError">{errors.newPatientName}</span>}
            </div>

            <div className="compactPatientRow">
              <div className="fieldGroup" data-field="newPatientAge">
                <label className="fieldLabel">{t('common.age')} <span className="required">*</span></label>
                <InputNumber size="large" placeholder={t('common.age')} min={1} max={150} value={formData.newPatientAge} onChange={(v) => setFormData((prev) => ({ ...prev, newPatientAge: v }))} status={errors.newPatientAge ? 'error' : undefined} style={{ width: '100%' }} />
                {errors.newPatientAge && <span className="fieldError">{errors.newPatientAge}</span>}
              </div>
              <div className="fieldGroup">
                <label className="fieldLabel">{t('patients.gender')}</label>
                <Select size="large" value={formData.newPatientGender} onChange={(v: Gender) => setFormData((prev) => ({ ...prev, newPatientGender: v }))} style={{ width: '100%' }} options={GENDERS.map((g) => ({ value: g.value, label: g.label }))} />
              </div>
            </div>

            <div className="fieldGroup">
              <label className="fieldLabel">{t('patients.mobile')}</label>
              <Input size="large" prefix={<PhoneOutlined />} placeholder={t('patients.mobile')} inputMode="tel" value={formData.newPatientMobile} onChange={(e) => setFormData((prev) => ({ ...prev, newPatientMobile: e.target.value }))} allowClear />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="patientStep">
      {formData.patientId ? (
        <div className="patientStepCard selectedPatientCard">
          <div className="selectedPatientInfo">
            <div className="selectedPatientAvatar"><CheckCircleFilled /></div>
            <div className="selectedPatientText">
              <span className="selectedPatientLabel">{t('operations.patientSelected')}</span>
              <strong>{formData.selectedPatientName || formData.patientId}</strong>
              {formData.selectedPatientMobile && <span className="selectedPatientMeta"><PhoneOutlined />{formData.selectedPatientMobile}</span>}
            </div>
          </div>
          <Button type="link" onClick={handleClearSelection}>{t('common.edit')}</Button>
        </div>
      ) : (
        <>
          <section className="patientStepCard" data-field="patientId">
            <div className="patientCardHeader"><SearchOutlined className="patientCardIcon" /><h3 className="patientCardTitle">{t('operations.searchExistingPatient')}</h3></div>
            <Select
              showSearch
              allowClear
              size="large"
              className="patientSearchSelect"
              placeholder={t('operations.patientSearchPlaceholder')}
              value={formData.patientId || undefined}
              filterOption={false}
              onSearch={setSearchQuery}
              onClear={handleClearSelection}
              onSelect={(value, option) => handleSelectPatient(value, option as { patient?: Patient })}
              notFoundContent={patientsLoading ? <div className="patientSelectLoading"><Spin size="small" /></div> : <div className="patientSelectEmpty"><p>{t('common.noResults')}</p><Button type="link" size="small" icon={<UserAddOutlined />} onClick={handleCreateNew}>{t('operations.createNewProfile')}</Button></div>}
              status={errors.patientId ? 'error' : undefined}
              options={selectOptions}
              optionRender={(option) => {
                const patient = (option.data as { patient?: Patient })?.patient;
                if (!patient) return option.label;
                return (
                  <div className="patientSelectOption">
                    <span className="patientSelectOptionAvatar"><UserOutlined /></span>
                    <span className="patientSelectOptionBody">
                      <span className="patientSelectOptionName">{patient.fullName}</span>
                      <span className="patientSelectOptionMeta">{[patient.mobile, patient.age != null ? `${patient.age} ${t('common.age')}` : null, patient.id ? `#${patient.id.slice(0, 8)}` : null].filter(Boolean).join(' · ')}</span>
                    </span>
                  </div>
                );
              }}
              prefix={<UserOutlined style={{ color: '#94A3B8' }} />}
            />
            <p className="patientSearchHint"><InfoCircleOutlined />{t('operations.patientSearchHint')}</p>
            {errors.patientId && <div className="fieldError">{errors.patientId}</div>}
          </section>

          <div className="patientOrSeparator" aria-hidden="true"><span className="patientOrLine" /><span className="patientOrLabel">{t('operations.or')}</span><span className="patientOrLine" /></div>

          <button type="button" className="patientStepCard patientCreateCard" onClick={handleCreateNew}>
            <div className="patientCreateIcon"><UserAddOutlined /></div>
            <h3 className="patientCardTitle">{t('operations.createNewProfile')}</h3>
            {/* <p className="patientCardDesc">{t('operations.createNewProfileHint')}</p> */}
            <span className="patientCreateCta">{t('operations.getStarted')}<ArrowRightOutlined /></span>
          </button>
        </>
      )}
    </div>
  );
}
