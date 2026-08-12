import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Steps,
  Input,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Form,
  AutoComplete,
  Upload,
  message,
  Spin,
  Divider,
  Descriptions,
  Card,
  Tag,
  Alert,
  Row,
  Col,
  Popconfirm,
  Typography,
} from 'antd';
import {
  UserOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  DollarOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CameraOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
  FileImageOutlined,
  ClockCircleOutlined,
  BankOutlined,
  HomeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';

import { operationService } from '@/services/operation.service';
import { patientService } from '@/services/patient.service';
import { doctorService } from '@/services/doctor.service';
import { hospitalService } from '@/services/hospital.service';
import { specialtyService } from '@/services/specialty.service';
import { useAuthStore } from '@/stores/auth.store';
import { useDebounce } from '@/hooks/useDebounce';
import {
  formatCurrency,
  formatDate,
  formatTime,
  getStatusColor,
  getInitials,
  calculateRemaining,
} from '@/utils/helpers';
import {
  OPERATION_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  ORTHOPEDIC_CATEGORIES,
  GENDERS,
} from '@/utils/constants';
import {
  Gender,
  OperationStatus,
  PaymentMethod,
  PaymentStatus,
  FileType,
  type Operation,
  type Patient,
  type Doctor,
  type Hospital,
  type Specialty,
  type OperationFile,
  type CreateOperationPayload,
  type CreatePatientPayload,
} from '@/types';

import styles from './OperationFormPage.module.scss';

// ═══════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════

const STEPS = [
  { key: 'patient', icon: <UserOutlined /> },
  { key: 'operation', icon: <MedicineBoxOutlined /> },
  { key: 'team', icon: <TeamOutlined /> },
  { key: 'cost', icon: <DollarOutlined /> },
  { key: 'files', icon: <CloudUploadOutlined /> },
  { key: 'review', icon: <CheckCircleOutlined /> },
] as const;

const LAST_USED_HOSPITAL_KEY = 'medaxis_lastUsedHospital';

const ACCEPTED_FILE_TYPES =
  '.jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.dicom,.avi,.mp4,.mov';

// ═══════════════════════════════════════════════════════
// Zod Schemas
// ═══════════════════════════════════════════════════════

const patientSchema = z.object({
  patientId: z.string().min(1, 'Please select or create a patient'),
});

const operationSchema = z.object({
  name: z.string().min(1, 'Operation name is required'),
  diagnosis: z.string().optional().default(''),
  hospitalId: z.string().min(1, 'Hospital is required'),
  specialtyId: z.string().min(1, 'Specialty is required'),
  operationDate: z.string().min(1, 'Operation date is required'),
  operationTime: z.string().min(1, 'Operation time is required'),
  operationRoom: z.string().optional().default(''),
  duration: z.number().optional().default(null),
  status: z.nativeEnum(OperationStatus).default(OperationStatus.Completed),
});

const costSchema = z.object({
  totalCost: z.number().min(0, 'Cost must be >= 0'),
  paidAmount: z.number().min(0).optional().default(0),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.Cash),
  paymentStatus: z.nativeEnum(PaymentStatus).default(PaymentStatus.Paid),
  paymentNotes: z.string().optional().default(''),
});

// ═══════════════════════════════════════════════════════
// Form Data Interface
// ═══════════════════════════════════════════════════════

interface WizardFormData {
  // Step 1 – Patient
  patientSearchQuery: string;
  patientId: string;
  isNewPatient: boolean;
  newPatientName: string;
  newPatientAge: number | null;
  newPatientGender: Gender;
  newPatientMobile: string;

  // Step 2 – Operation
  name: string;
  diagnosis: string;
  hospitalId: string;
  specialtyId: string;
  operationDate: string;
  operationTime: string;
  operationRoom: string;
  duration: number | null;
  status: OperationStatus;

  // Step 3 – Team
  primarySurgeonId: string;
  assistantSurgeonId: string;
  anesthesiologistId: string;
  assistantAnesthesiaId: string;
  nurseId: string;
  teamNotes: string;

  // Step 4 – Cost
  totalCost: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentNotes: string;

  // Step 5 – Files (managed separately)
  // uploadedBeforeFiles: OperationFile[];
  // uploadedAfterFiles: OperationFile[];

  // Notes
  notes: string;
}

function getDefaultFormData(): WizardFormData {
  const lastHospital = typeof window !== 'undefined'
    ? localStorage.getItem(LAST_USED_HOSPITAL_KEY)
    : null;

  return {
    patientSearchQuery: '',
    patientId: '',
    isNewPatient: false,
    newPatientName: '',
    newPatientAge: null,
    newPatientGender: Gender.Male,
    newPatientMobile: '',

    name: '',
    diagnosis: '',
    hospitalId: lastHospital || '',
    specialtyId: '',
    operationDate: dayjs().format('YYYY-MM-DD'),
    operationTime: dayjs().format('HH:mm'),
    operationRoom: '',
    duration: null,
    status: OperationStatus.Completed,

    primarySurgeonId: '',
    assistantSurgeonId: '',
    anesthesiologistId: '',
    assistantAnesthesiaId: '',
    nurseId: '',
    teamNotes: '',

    totalCost: 0,
    paidAmount: 0,
    paymentMethod: PaymentMethod.Cash,
    paymentStatus: PaymentStatus.Paid,
    paymentNotes: '',

    notes: '',
  };
}

// ═══════════════════════════════════════════════════════
// Step 1 – Patient
// ═══════════════════════════════════════════════════════

function PatientStep({
  formData,
  setFormData,
  errors,
  clearError,
}: {
  formData: WizardFormData;
  setFormData: React.Dispatch<React.SetStateAction<WizardFormData>>;
  errors: Record<string, string | undefined>;
  clearError: (field: string) => void;
}) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(formData.patientSearchQuery);
  const debouncedSearch = useDebounce(searchQuery, 350);

  const { data: patientsData, isLoading: patientsLoading } = useQuery({
    queryKey: ['patient-search', debouncedSearch],
    queryFn: () => patientService.search(debouncedSearch),
    enabled: debouncedSearch.length >= 1,
    staleTime: 10_000,
  });

  const patients: Patient[] = patientsData?.data?.data ?? [];

  const patientOptions = useMemo(() => {
    if (!formData.isNewPatient) {
      return patients.map((p) => ({
        value: p.id,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>{p.fullName}</span>
            <span style={{ color: '#94A3B8', fontSize: 12 }}>{p.mobile || p.gender}</span>
          </div>
        ),
      }));
    }
    return [];
  }, [patients, formData.isNewPatient]);

  const handleSelectPatient = useCallback(
    (patientId: string) => {
      setFormData((prev) => ({
        ...prev,
        patientId,
        isNewPatient: false,
        patientSearchQuery: '',
      }));
      clearError('patientId');
    },
    [setFormData, clearError],
  );

  const handleCreateNew = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      patientId: '',
      isNewPatient: true,
      patientSearchQuery: '',
    }));
    clearError('patientId');
  }, [setFormData, clearError]);

  const handleBackToSearch = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      isNewPatient: false,
      patientId: '',
    }));
  }, [setFormData]);

  return (
    <div className={styles.stepContent}>
      {!formData.isNewPatient ? (
        <>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {t('operations.searchExistingPatient')} <span className={styles.required}>*</span>
            </label>
            <AutoComplete
              style={{ width: '100%' }}
              options={patientOptions}
              onSearch={setSearchQuery}
              onSelect={handleSelectPatient}
              placeholder={t('operations.selectPatient')}
              size="large"
              notFoundContent={patientsLoading ? <Spin size="small" /> : null}
              value={formData.patientId ? formData.patientId : searchQuery}
              filterOption={false}
            >
              <Input
                size="large"
                prefix={<UserOutlined style={{ color: '#94A3B8' }} />}
                allowClear
              />
            </AutoComplete>
            {formData.patientId && !formData.isNewPatient && (
              <div className={styles.selectedPatient}>
                <Tag color="blue" closable onClose={handleBackToSearch}>
                  <UserOutlined /> {formData.patientId}
                </Tag>
              </div>
            )}
          </div>

          {patients.length > 0 && !formData.patientId && (
            <div className={styles.createNewRow}>
              <Button type="dashed" icon={<PlusOutlined />} onClick={handleCreateNew} block>
                {t('operations.createNewPatient')}
              </Button>
            </div>
          )}

          {errors.patientId && (
            <div className={styles.fieldError}>{errors.patientId}</div>
          )}
        </>
      ) : (
        <>
          <Alert
            type="info"
            showIcon
            icon={<PlusOutlined />}
            message={t('operations.createNewPatient')}
            className={styles.newPatientAlert}
          />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  {t('patients.fullName')} <span className={styles.required}>*</span>
                </label>
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder={t('patients.fullName')}
                  value={formData.newPatientName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, newPatientName: e.target.value }))
                  }
                  allowClear
                />
              </div>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  {t('patients.mobile')} <span className={styles.required}>*</span>
                </label>
                <Input
                  size="large"
                  placeholder={t('patients.mobile')}
                  value={formData.newPatientMobile}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, newPatientMobile: e.target.value }))
                  }
                  allowClear
                />
              </div>
            </Col>
            <Col xs={12} sm={8} md={3}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{t('common.gender')}</label>
                <Select
                  size="large"
                  value={formData.newPatientGender}
                  onChange={(v: Gender) =>
                    setFormData((prev) => ({ ...prev, newPatientGender: v }))
                  }
                  style={{ width: '100%' }}
                  options={GENDERS.map((g) => ({ value: g.value, label: g.label }))}
                />
              </div>
            </Col>
            <Col xs={12} sm={8} md={3}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{t('common.age')}</label>
                <InputNumber
                  size="large"
                  placeholder={t('common.age')}
                  min={0}
                  max={150}
                  value={formData.newPatientAge}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, newPatientAge: v }))
                  }
                  style={{ width: '100%' }}
                  addonAfter={t('common.years') || 'y'}
                />
              </div>
            </Col>
          </Row>

          <Button
            type="link"
            size="small"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToSearch}
          >
            {t('operations.searchExistingPatient')}
          </Button>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Step 2 – Operation Details
// ═══════════════════════════════════════════════════════

function OperationStep({
  formData,
  setFormData,
  errors,
  clearError,
}: {
  formData: WizardFormData;
  setFormData: React.Dispatch<React.SetStateAction<WizardFormData>>;
  errors: Record<string, string | undefined>;
  clearError: (field: string) => void;
}) {
  const { t } = useTranslation();

  const { data: hospitalsData } = useQuery({
    queryKey: ['hospitals-active'],
    queryFn: () => hospitalService.getActive(),
    staleTime: 60_000,
  });

  const { data: specialtiesData } = useQuery({
    queryKey: ['specialties-all'],
    queryFn: () => specialtyService.getAll({ limit: 100 }),
    staleTime: 60_000,
  });

  const hospitals: Hospital[] = hospitalsData?.data?.data ?? [];
  const specialties: Specialty[] = specialtiesData?.data?.data ?? [];

  const updateField = useCallback(
    (field: keyof WizardFormData, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as string);
    },
    [setFormData, clearError],
  );

  return (
    <div className={styles.stepContent}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {t('operations.operationName')} <span className={styles.required}>*</span>
            </label>
            <Input
              size="large"
              prefix={<MedicineBoxOutlined />}
              placeholder={t('operations.operationName')}
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              allowClear
              status={errors.name ? 'error' : undefined}
            />
            {errors.name && <div className={styles.fieldError}>{errors.name}</div>}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t('operations.diagnosis')}</label>
            <Input
              size="large"
              placeholder={t('operations.diagnosis')}
              value={formData.diagnosis}
              onChange={(e) => updateField('diagnosis', e.target.value)}
              allowClear
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {t('operations.hospital')} <span className={styles.required}>*</span>
            </label>
            <Select
              size="large"
              placeholder={t('operations.selectHospital')}
              value={formData.hospitalId || undefined}
              onChange={(v: string) => updateField('hospitalId', v)}
              allowClear
              showSearch
              optionFilterProp="label"
              options={hospitals.map((h) => ({ value: h.id, label: h.name }))}
              style={{ width: '100%' }}
              status={errors.hospitalId ? 'error' : undefined}
            />
            {errors.hospitalId && <div className={styles.fieldError}>{errors.hospitalId}</div>}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {t('operations.specialty')} <span className={styles.required}>*</span>
            </label>
            <Select
              size="large"
              placeholder={t('operations.selectSpecialty')}
              value={formData.specialtyId || undefined}
              onChange={(v: string) => updateField('specialtyId', v)}
              allowClear
              showSearch
              optionFilterProp="label"
              options={specialties.map((s) => ({ value: s.id, label: s.name }))}
              style={{ width: '100%' }}
              status={errors.specialtyId ? 'error' : undefined}
            />
            {errors.specialtyId && <div className={styles.fieldError}>{errors.specialtyId}</div>}
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {t('operations.operationDate')} <span className={styles.required}>*</span>
            </label>
            <DatePicker
              size="large"
              value={formData.operationDate ? dayjs(formData.operationDate) : null}
              onChange={(d) => updateField('operationDate', d?.format('YYYY-MM-DD') ?? '')}
              style={{ width: '100%' }}
              placeholder={t('operations.operationDate')}
            />
            {errors.operationDate && <div className={styles.fieldError}>{errors.operationDate}</div>}
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {t('operations.operationTime')} <span className={styles.required}>*</span>
            </label>
            <TimePicker
              size="large"
              value={formData.operationTime ? dayjs(formData.operationTime, 'HH:mm') : null}
              onChange={(t2) => updateField('operationTime', t2?.format('HH:mm') ?? '')}
              format="HH:mm"
              style={{ width: '100%' }}
              placeholder={t('operations.operationTime')}
              needConfirm={false}
            />
            {errors.operationTime && <div className={styles.fieldError}>{errors.operationTime}</div>}
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t('operations.operationRoom')}</label>
            <Input
              size="large"
              placeholder={t('operations.operationRoom')}
              value={formData.operationRoom}
              onChange={(e) => updateField('operationRoom', e.target.value)}
              allowClear
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t('operations.durationMinutes')}</label>
            <InputNumber
              size="large"
              placeholder={t('operations.durationMinutes')}
              min={1}
              max={1440}
              value={formData.duration}
              onChange={(v) => updateField('duration', v)}
              style={{ width: '100%' }}
              addonAfter={t('common.minutes') || 'min'}
            />
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t('operations.status')}</label>
            <Select
              size="large"
              value={formData.status}
              onChange={(v: OperationStatus) => updateField('status', v)}
              style={{ width: '100%' }}
              options={OPERATION_STATUSES.map((s) => ({
                value: s.value,
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: s.color,
                        display: 'inline-block',
                      }}
                    />
                    {s.label}
                  </span>
                ),
              }))}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Step 3 – Medical Team
// ═══════════════════════════════════════════════════════

function TeamStep({
  formData,
  setFormData,
}: {
  formData: WizardFormData;
  setFormData: React.Dispatch<React.SetStateAction<WizardFormData>>;
}) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors-active'],
    queryFn: () => doctorService.getActive(),
    staleTime: 60_000,
  });

  const doctors: Doctor[] = doctorsData?.data?.data ?? [];

  // Set default primary surgeon once doctors load
  useEffect(() => {
    if (doctors.length > 0 && !formData.primarySurgeonId) {
      // Prefer logged-in doctor
      const matchDoctor = doctors.find((d) => d.id === user?.id);
      if (matchDoctor) {
        setFormData((prev) => ({ ...prev, primarySurgeonId: matchDoctor.id }));
      }
    }
  }, [doctors, user?.id, formData.primarySurgeonId, setFormData]);

  const updateField = useCallback(
    (field: keyof WizardFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData],
  );

  const doctorOptions = useMemo(
    () =>
      doctors.map((d) => ({
        value: d.id,
        label: d.name + (d.specialty?.name ? ` (${d.specialty.name})` : ''),
      })),
    [doctors],
  );

  const renderDoctorSelect = (
    field: 'primarySurgeonId' | 'assistantSurgeonId' | 'anesthesiologistId' | 'assistantAnesthesiaId' | 'nurseId',
    label: string,
    placeholder: string,
  ) => (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <Select
        size="large"
        placeholder={placeholder}
        value={formData[field] || undefined}
        onChange={(v: string) => updateField(field, v)}
        allowClear
        showSearch
        optionFilterProp="label"
        options={doctorOptions}
        style={{ width: '100%' }}
        loading={doctorsLoading}
      />
    </div>
  );

  return (
    <div className={styles.stepContent}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          {renderDoctorSelect(
            'primarySurgeonId',
            `${t('operations.primarySurgeon')} *`,
            t('operations.selectDoctor'),
          )}
        </Col>
        <Col xs={24} md={12}>
          {renderDoctorSelect(
            'assistantSurgeonId',
            t('operations.assistantSurgeon'),
            t('operations.selectDoctor'),
          )}
        </Col>
        <Col xs={24} md={12}>
          {renderDoctorSelect(
            'anesthesiologistId',
            t('operations.anesthesiologist'),
            t('operations.selectDoctor'),
          )}
        </Col>
        <Col xs={24} md={12}>
          {renderDoctorSelect(
            'assistantAnesthesiaId',
            t('operations.assistantAnesthesia'),
            t('operations.selectDoctor'),
          )}
        </Col>
        <Col xs={24} md={12}>
          {renderDoctorSelect('nurseId', t('operations.nurse'), t('operations.selectDoctor'))}
        </Col>
        <Col xs={24} md={12}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t('operations.teamNotes')}</label>
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

// ═══════════════════════════════════════════════════════
// Step 4 – Cost & Payment
// ═══════════════════════════════════════════════════════

function CostStep({
  formData,
  setFormData,
  errors,
  clearError,
}: {
  formData: WizardFormData;
  setFormData: React.Dispatch<React.SetStateAction<WizardFormData>>;
  errors: Record<string, string | undefined>;
  clearError: (field: string) => void;
}) {
  const { t } = useTranslation();

  const remaining = calculateRemaining(formData.totalCost, formData.paidAmount);

  const updateField = useCallback(
    (field: keyof WizardFormData, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as string);
    },
    [setFormData, clearError],
  );

  return (
    <div className={styles.stepContent}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {t('operations.totalCost')} <span className={styles.required}>*</span> ({t('common.currency')})
            </label>
            <InputNumber
              size="large"
              placeholder={t('operations.totalCost')}
              min={0}
              max={99999999}
              value={formData.totalCost}
              onChange={(v) => updateField('totalCost', v ?? 0)}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number(value?.replace(/,/g, '') ?? 0)}
              status={errors.totalCost ? 'error' : undefined}
            />
            {errors.totalCost && <div className={styles.fieldError}>{errors.totalCost}</div>}
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {t('operations.paidAmount')} ({t('common.currency')})
            </label>
            <InputNumber
              size="large"
              placeholder={t('operations.paidAmount')}
              min={0}
              max={formData.totalCost || 99999999}
              value={formData.paidAmount}
              onChange={(v) => updateField('paidAmount', v ?? 0)}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number(value?.replace(/,/g, '') ?? 0)}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {t('operations.remainingAmount')} ({t('common.currency')})
            </label>
            <div className={styles.readOnlyField}>
              <DollarOutlined className={styles.readOnlyIcon} />
              <span className={styles.readOnlyValue}>{formatCurrency(remaining)}</span>
              <Tag className={styles.autoCalculatedTag}>{t('operations.autoCalculated')}</Tag>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t('operations.paymentMethod')}</label>
            <Select
              size="large"
              value={formData.paymentMethod}
              onChange={(v: PaymentMethod) => updateField('paymentMethod', v)}
              style={{ width: '100%' }}
              options={PAYMENT_METHODS.map((m) => ({
                value: m.value,
                label: m.label,
              }))}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t('operations.paymentStatus')}</label>
            <Select
              size="large"
              value={formData.paymentStatus}
              onChange={(v: PaymentStatus) => updateField('paymentStatus', v)}
              style={{ width: '100%' }}
              options={PAYMENT_STATUSES.map((s) => ({
                value: s.value,
                label: s.label,
              }))}
            />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t('operations.paymentNotes')}</label>
            <Input.TextArea
              rows={1}
              placeholder={t('operations.paymentNotes')}
              value={formData.paymentNotes}
              onChange={(e) => updateField('paymentNotes', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Step 5 – Files
// ═══════════════════════════════════════════════════════

function FilesStep({
  operationId,
  beforeFiles,
  afterFiles,
  onBeforeUpload,
  onAfterUpload,
  onDeleteFile,
}: {
  operationId: string | null;
  beforeFiles: OperationFile[];
  afterFiles: OperationFile[];
  onBeforeUpload: (file: File) => Promise<void>;
  onAfterUpload: (file: File) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [beforeUploading, setBeforeUploading] = useState(false);
  const [afterUploading, setAfterUploading] = useState(false);

  const handleBeforeUpload = async (file: File) => {
    setBeforeUploading(true);
    try {
      await onBeforeUpload(file);
    } finally {
      setBeforeUploading(false);
    }
    return false; // prevent default upload
  };

  const handleAfterUpload = async (file: File) => {
    setAfterUploading(true);
    try {
      await onAfterUpload(file);
    } finally {
      setAfterUploading(false);
    }
    return false;
  };

  const renderFileGallery = (files: OperationFile[]) => {
    if (files.length === 0) {
      return (
        <div className={styles.emptyFiles}>
          <FileImageOutlined style={{ fontSize: 32, color: '#CBD5E1' }} />
          <span>{t('operations.noFiles')}</span>
        </div>
      );
    }
    return (
      <div className={styles.fileGallery}>
        {files.map((f) => (
          <div key={f.id} className={styles.fileThumb}>
            <div className={styles.fileThumbPreview}>
              {f.mimeType?.startsWith('image/') ? (
                <img src={f.fileUrl} alt={f.fileName} className={styles.fileThumbImg} />
              ) : (
                <FileImageOutlined style={{ fontSize: 24, color: '#94A3B8' }} />
              )}
            </div>
            <div className={styles.fileThumbName}>{f.fileName}</div>
            <div className={styles.fileThumbActions}>
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => window.open(f.fileUrl, '_blank')}
              />
              <Button
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = f.fileUrl;
                  a.download = f.fileName;
                  a.click();
                }}
              />
              <Popconfirm
                title={t('operations.deleteFile')}
                onConfirm={() => onDeleteFile(f.id)}
                okText={t('common.yes')}
                cancelText={t('common.no')}
              >
                <Button type="text" size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.stepContent}>
      {/* ─── Before Operation ─────────────────── */}
      <div className={styles.fileSection}>
        <div className={styles.fileSectionHeader}>
          <CameraOutlined className={styles.fileSectionIcon} />
          <h3 className={styles.fileSectionTitle}>{t('operations.beforeOperation')}</h3>
        </div>

        {operationId && (
          <>
            {renderFileGallery(beforeFiles)}
            <Upload.Dragger
              accept={ACCEPTED_FILE_TYPES}
              showUploadList={false}
              multiple
              beforeUpload={handleBeforeUpload}
              disabled={beforeUploading}
              className={styles.uploadArea}
            >
              <p className={styles.uploadIcon}>
                <InboxOutlined />
              </p>
              <p className={styles.uploadText}>
                {t('operations.uploadFiles')}
              </p>
              <p className={styles.uploadHint}>
                JPG, PNG, PDF, DICOM
              </p>
            </Upload.Dragger>
          </>
        )}

        {!operationId && (
          <Alert
            type="info"
            showIcon
            message={t('operations.step5Files')}
            description={t('operations.saveFirstToUpload') || 'Save the operation first to upload files.'}
            className={styles.noOperationAlert}
          />
        )}
      </div>

      <Divider />

      {/* ─── After Operation ──────────────────── */}
      <div className={styles.fileSection}>
        <div className={styles.fileSectionHeader}>
          <FileImageOutlined className={styles.fileSectionIcon} />
          <h3 className={styles.fileSectionTitle}>{t('operations.afterOperation')}</h3>
        </div>

        {operationId && (
          <>
            {renderFileGallery(afterFiles)}
            <Upload.Dragger
              accept={ACCEPTED_FILE_TYPES}
              showUploadList={false}
              multiple
              beforeUpload={handleAfterUpload}
              disabled={afterUploading}
              className={styles.uploadArea}
            >
              <p className={styles.uploadIcon}>
                <InboxOutlined />
              </p>
              <p className={styles.uploadText}>
                {t('operations.uploadFiles')}
              </p>
              <p className={styles.uploadHint}>
                JPG, PNG, PDF, DICOM
              </p>
            </Upload.Dragger>
          </>
        )}

        {!operationId && (
          <Alert
            type="info"
            showIcon
            message={t('operations.step5Files')}
            description={t('operations.saveFirstToUpload') || 'Save the operation first to upload files.'}
            className={styles.noOperationAlert}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Step 6 – Review
// ═══════════════════════════════════════════════════════

function ReviewStep({
  formData,
  goToStep,
  hospitals,
  specialties,
  doctors,
}: {
  formData: WizardFormData;
  goToStep: (step: number) => void;
  hospitals: Hospital[];
  specialties: Specialty[];
  doctors: Doctor[];
}) {
  const { t } = useTranslation();

  const findHospital = (id: string) => hospitals.find((h) => h.id === id)?.name ?? id;
  const findSpecialty = (id: string) => specialties.find((s) => s.id === id)?.name ?? id;
  const findDoctor = (id: string) => doctors.find((d) => d.id === id)?.name ?? id;
  const getStatusLabel = (status: OperationStatus) =>
    OPERATION_STATUSES.find((s) => s.value === status)?.label ?? status;
  const getPaymentLabel = (method: PaymentMethod) =>
    PAYMENT_METHODS.find((m) => m.value === method)?.label ?? method;
  const getPayStatusLabel = (status: PaymentStatus) =>
    PAYMENT_STATUSES.find((s) => s.value === status)?.label ?? status;

  const remaining = calculateRemaining(formData.totalCost, formData.paidAmount);

  return (
    <div className={styles.stepContent}>
      {/* ─── Patient Card ────────────────────────── */}
      <Card
        className={styles.reviewCard}
        title={
          <span className={styles.reviewCardTitle}>
            <UserOutlined /> {t('operations.step1Patient')}
          </span>
        }
        extra={
          <Button type="link" icon={<EditOutlined />} onClick={() => goToStep(0)}>
            {t('common.edit')}
          </Button>
        }
      >
        {formData.isNewPatient ? (
          <Descriptions column={2} size="small">
            <Descriptions.Item label={t('patients.fullName')}>
              {formData.newPatientName || '—'}
            </Descriptions.Item>
            <Descriptions.Item label={t('patients.mobile')}>
              {formData.newPatientMobile || '—'}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.gender')}>
              {GENDERS.find((g) => g.value === formData.newPatientGender)?.label ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.age')}>
              {formData.newPatientAge ?? '—'}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div className={styles.reviewSelectedPatient}>
            <Tag color="blue" icon={<UserOutlined />}>
              {formData.patientId}
            </Tag>
          </div>
        )}
      </Card>

      {/* ─── Operation Card ─────────────────────── */}
      <Card
        className={styles.reviewCard}
        title={
          <span className={styles.reviewCardTitle}>
            <MedicineBoxOutlined /> {t('operations.step2Operation')}
          </span>
        }
        extra={
          <Button type="link" icon={<EditOutlined />} onClick={() => goToStep(1)}>
            {t('common.edit')}
          </Button>
        }
      >
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label={t('operations.operationName')}>
            {formData.name || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.diagnosis')}>
            {formData.diagnosis || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.hospital')}>
            {formData.hospitalId ? findHospital(formData.hospitalId) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.specialty')}>
            {formData.specialtyId ? findSpecialty(formData.specialtyId) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.operationDate')}>
            {formData.operationDate ? formatDate(formData.operationDate) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.operationTime')}>
            {formData.operationTime ? formatTime(formData.operationTime) : '—'}
          </Descriptions.Item>
          {formData.operationRoom && (
            <Descriptions.Item label={t('operations.operationRoom')}>
              {formData.operationRoom}
            </Descriptions.Item>
          )}
          {formData.duration && (
            <Descriptions.Item label={t('operations.duration')}>
              {formData.duration} {t('common.minutes')}
            </Descriptions.Item>
          )}
          <Descriptions.Item label={t('operations.status')}>
            <Tag
              color={getStatusBg(formData.status)}
              style={{ color: getStatusColor(formData.status), border: 'none' }}
            >
              {getStatusLabel(formData.status)}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* ─── Team Card ───────────────────────────── */}
      <Card
        className={styles.reviewCard}
        title={
          <span className={styles.reviewCardTitle}>
            <TeamOutlined /> {t('operations.step3Team')}
          </span>
        }
        extra={
          <Button type="link" icon={<EditOutlined />} onClick={() => goToStep(2)}>
            {t('common.edit')}
          </Button>
        }
      >
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label={t('operations.primarySurgeon')}>
            {formData.primarySurgeonId ? findDoctor(formData.primarySurgeonId) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.assistantSurgeon')}>
            {formData.assistantSurgeonId ? findDoctor(formData.assistantSurgeonId) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.anesthesiologist')}>
            {formData.anesthesiologistId ? findDoctor(formData.anesthesiologistId) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.assistantAnesthesia')}>
            {formData.assistantAnesthesiaId ? findDoctor(formData.assistantAnesthesiaId) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.nurse')}>
            {formData.nurseId ? findDoctor(formData.nurseId) : '—'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* ─── Cost Card ───────────────────────────── */}
      <Card
        className={styles.reviewCard}
        title={
          <span className={styles.reviewCardTitle}>
            <DollarOutlined /> {t('operations.step4Cost')}
          </span>
        }
        extra={
          <Button type="link" icon={<EditOutlined />} onClick={() => goToStep(3)}>
            {t('common.edit')}
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={8}>
            <div className={styles.reviewCostItem}>
              <span className={styles.reviewCostLabel}>{t('operations.totalCost')}</span>
              <span className={styles.reviewCostValue}>{formatCurrency(formData.totalCost)}</span>
            </div>
          </Col>
          <Col xs={8}>
            <div className={styles.reviewCostItem}>
              <span className={styles.reviewCostLabel}>{t('operations.paidAmount')}</span>
              <span className={styles.reviewCostValue}>{formatCurrency(formData.paidAmount)}</span>
            </div>
          </Col>
          <Col xs={8}>
            <div className={styles.reviewCostItem}>
              <span className={styles.reviewCostLabel}>{t('operations.remainingAmount')}</span>
              <span
                className={styles.reviewCostValue}
                style={{ color: remaining > 0 ? '#F59E0B' : '#16A34A' }}
              >
                {formatCurrency(remaining)}
              </span>
            </div>
          </Col>
          <Col xs={24}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label={t('operations.paymentMethod')}>
                {getPaymentLabel(formData.paymentMethod)}
              </Descriptions.Item>
              <Descriptions.Item label={t('operations.paymentStatus')}>
                <Tag
                  color={formData.paymentStatus === PaymentStatus.Paid ? 'green' : formData.paymentStatus === PaymentStatus.Unpaid ? 'red' : 'orange'}
                >
                  {getPayStatusLabel(formData.paymentStatus)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Helper
// ═══════════════════════════════════════════════════════

function getStatusBg(status: OperationStatus): string {
  const found = OPERATION_STATUSES.find((s) => s.value === status);
  return found?.bg ?? 'rgba(148,163,184,0.1)';
}

// ═══════════════════════════════════════════════════════
// Main Wizard Page
// ═══════════════════════════════════════════════════════

export default function OperationFormPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const isEditMode = Boolean(id);

  // ── Step State ─────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WizardFormData>(getDefaultFormData);
  const [savedOperationId, setSavedOperationId] = useState<string | null>(id || null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSaving, setIsSaving] = useState(false);

  const notesDebounced = useDebounce(formData.notes, 800);
  const notesAutoSaveRef = useRef(false);

  // ── Reference data queries ──────────────────────
  const { data: hospitalsData } = useQuery({
    queryKey: ['hospitals-active'],
    queryFn: () => hospitalService.getActive(),
    staleTime: 60_000,
  });

  const { data: specialtiesData } = useQuery({
    queryKey: ['specialties-all'],
    queryFn: () => specialtyService.getAll({ limit: 100 }),
    staleTime: 60_000,
  });

  const { data: doctorsData } = useQuery({
    queryKey: ['doctors-active'],
    queryFn: () => doctorService.getActive(),
    staleTime: 60_000,
  });

  const hospitals: Hospital[] = hospitalsData?.data?.data ?? [];
  const specialties: Specialty[] = specialtiesData?.data?.data ?? [];
  const doctors: Doctor[] = doctorsData?.data?.data ?? [];

  // ── Load existing operation for edit mode ───────
  const { data: operationData, isLoading: loadingOperation } = useQuery({
    queryKey: ['operation-detail', id],
    queryFn: () => operationService.getById(id!),
    enabled: isEditMode,
  });

  const existingOperation: Operation | null = operationData?.data?.data ?? null;

  useEffect(() => {
    if (existingOperation) {
      setFormData((prev) => ({
        ...prev,
        patientId: existingOperation.patientId,
        isNewPatient: false,
        patientSearchQuery: existingOperation.patient?.fullName ?? '',
        name: existingOperation.name,
        diagnosis: existingOperation.diagnosis ?? '',
        hospitalId: existingOperation.hospitalId,
        specialtyId: existingOperation.specialtyId,
        operationDate: existingOperation.operationDate,
        operationTime: existingOperation.operationTime,
        operationRoom: existingOperation.operationRoom ?? '',
        duration: existingOperation.duration,
        status: existingOperation.status,
        primarySurgeonId: existingOperation.medicalTeam?.primarySurgeonId ?? '',
        assistantSurgeonId: existingOperation.medicalTeam?.assistantSurgeonId ?? '',
        anesthesiologistId: existingOperation.medicalTeam?.anesthesiologistId ?? '',
        assistantAnesthesiaId: existingOperation.medicalTeam?.assistantAnesthesiaId ?? '',
        nurseId: existingOperation.medicalTeam?.nurseId ?? '',
        teamNotes: '',
        totalCost: existingOperation.cost?.totalCost ?? 0,
        paidAmount: existingOperation.cost?.paidAmount ?? 0,
        paymentMethod: existingOperation.cost?.paymentMethod ?? PaymentMethod.Cash,
        paymentStatus: existingOperation.cost?.paymentStatus ?? PaymentStatus.Paid,
        paymentNotes: existingOperation.cost?.paymentNotes ?? '',
        notes: existingOperation.notes ?? '',
      }));
      setSavedOperationId(existingOperation.id);
    }
  }, [existingOperation]);

  // ── File queries ───────────────────────────────
  const { data: beforeFilesData } = useQuery({
    queryKey: ['operation-files-before', savedOperationId],
    queryFn: () => operationService.getById(savedOperationId!),
    enabled: !!savedOperationId,
    select: (res) =>
      res.data.data?.files?.filter((f) => f.fileType === FileType.BeforeOperation) ?? [],
  });

  const { data: afterFilesData } = useQuery({
    queryKey: ['operation-files-after', savedOperationId],
    queryFn: () => operationService.getById(savedOperationId!),
    enabled: !!savedOperationId,
    select: (res) =>
      res.data.data?.files?.filter((f) => f.fileType === FileType.AfterOperation) ?? [],
  });

  const beforeFiles: OperationFile[] = beforeFilesData ?? [];
  const afterFiles: OperationFile[] = afterFilesData ?? [];

  // ── Mutations ─────────────────────────────────
  const createOperationMutation = useMutation({
    mutationFn: (data: CreateOperationPayload) => operationService.create(data),
  });

  const createPatientMutation = useMutation({
    mutationFn: (data: CreatePatientPayload) => patientService.create(data),
  });

  const updateOperationMutation = useMutation({
    mutationFn: ({ opId, data }: { opId: string; data: Partial<CreateOperationPayload> & { status?: OperationStatus } }) =>
      operationService.update(opId, data),
  });

  const uploadBeforeMutation = useMutation({
    mutationFn: ({ opId, formData: fd }: { opId: string; formData: FormData }) =>
      operationService.uploadFiles(opId, fd),
  });

  const uploadAfterMutation = useMutation({
    mutationFn: ({ opId, formData: fd }: { opId: string; formData: FormData }) =>
      operationService.uploadFiles(opId, fd),
  });

  const deleteFileMutation = useMutation({
    mutationFn: ({ opId, fileId }: { opId: string; fileId: string }) =>
      operationService.deleteFile(opId, fileId),
  });

  // ── Auto-save notes ───────────────────────────
  useEffect(() => {
    if (savedOperationId && notesDebounced !== undefined && !notesAutoSaveRef.current) {
      notesAutoSaveRef.current = true;
      updateOperationMutation.mutate(
        { opId: savedOperationId, data: { notes: notesDebounced } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['operation-detail', savedOperationId] });
          },
          onSettled: () => {
            notesAutoSaveRef.current = false;
          },
        },
      );
    }
  }, [notesDebounced, savedOperationId]);

  // ── Validation ─────────────────────────────────
  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validateCurrentStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string | undefined> = {};

      if (step === 0) {
        if (!formData.isNewPatient && !formData.patientId) {
          newErrors.patientId = t('validation.required');
        }
        if (formData.isNewPatient && !formData.newPatientName.trim()) {
          newErrors.newPatientName = t('validation.required');
        }
      }

      if (step === 1) {
        if (!formData.name.trim()) {
          newErrors.name = t('validation.required');
        }
        if (!formData.hospitalId) {
          newErrors.hospitalId = t('validation.required');
        }
        if (!formData.specialtyId) {
          newErrors.specialtyId = t('validation.required');
        }
        if (!formData.operationDate) {
          newErrors.operationDate = t('validation.required');
        }
        if (!formData.operationTime) {
          newErrors.operationTime = t('validation.required');
        }
      }

      if (step === 3) {
        if (formData.totalCost === 0 || formData.totalCost === undefined || formData.totalCost === null) {
          // cost is optional for quick save but required for final
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData, t],
  );

  // ── Build Payload ───────────────────────────────
  const buildPayload = useCallback((): CreateOperationPayload => {
    return {
      name: formData.name,
      diagnosis: formData.diagnosis || undefined,
      patientId: formData.patientId,
      hospitalId: formData.hospitalId,
      specialtyId: formData.specialtyId,
      operationDate: formData.operationDate,
      operationTime: formData.operationTime,
      operationRoom: formData.operationRoom || undefined,
      duration: formData.duration || undefined,
      status: formData.status,
      primarySurgeonId: formData.primarySurgeonId || undefined,
      assistantSurgeonId: formData.assistantSurgeonId || undefined,
      anesthesiologistId: formData.anesthesiologistId || undefined,
      assistantAnesthesiaId: formData.assistantAnesthesiaId || undefined,
      nurseId: formData.nurseId || undefined,
      totalCost: formData.totalCost || undefined,
      paidAmount: formData.paidAmount || undefined,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      paymentNotes: formData.paymentNotes || undefined,
      notes: formData.notes || undefined,
    };
  }, [formData]);

  // ── Save Handler (Quick or Full) ────────────────
  const handleSave = useCallback(
    async (quickSave = false) => {
      if (!quickSave && !validateCurrentStep(currentStep)) {
        return;
      }

      setIsSaving(true);
      try {
        let finalPatientId = formData.patientId;

        // Create new patient if needed
        if (formData.isNewPatient && formData.newPatientName.trim()) {
          const patientResult = await createPatientMutation.mutateAsync({
            fullName: formData.newPatientName.trim(),
            mobile: formData.newPatientMobile.trim() || undefined,
            gender: formData.newPatientGender,
            dateOfBirth: formData.newPatientAge
              ? dayjs().subtract(formData.newPatientAge, 'year').format('YYYY-MM-DD')
              : undefined,
          });
          finalPatientId = patientResult.data.data.id;
          setFormData((prev) => ({ ...prev, patientId: finalPatientId, isNewPatient: false }));
        }

        const payload = buildPayload();
        payload.patientId = finalPatientId;

        // Save last used hospital
        if (payload.hospitalId) {
          localStorage.setItem(LAST_USED_HOSPITAL_KEY, payload.hospitalId);
        }

        let operationId: string;

        if (savedOperationId) {
          // Update existing
          await updateOperationMutation.mutateAsync({
            opId: savedOperationId,
            data: payload,
          });
          operationId = savedOperationId;
        } else {
          // Create new
          const result = await createOperationMutation.mutateAsync(payload);
          operationId = result.data.data.id;
          setSavedOperationId(operationId);
        }

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['operations'] });
        queryClient.invalidateQueries({ queryKey: ['operation-detail'] });

        messageApi.success(
          quickSave
            ? t('operations.operationCreated')
            : isEditMode
              ? t('operations.operationUpdated')
              : t('operations.operationCreated'),
        );

        if (!quickSave) {
          navigate(`/operations/${operationId}`);
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        messageApi.error(error?.response?.data?.message || t('common.operationFailed'));
      } finally {
        setIsSaving(false);
      }
    },
    [
      formData,
      savedOperationId,
      currentStep,
      validateCurrentStep,
      buildPayload,
      createPatientMutation,
      createOperationMutation,
      updateOperationMutation,
      queryClient,
      messageApi,
      t,
      navigate,
      isEditMode,
    ],
  );

  // ── File Handlers ──────────────────────────────
  const handleBeforeUpload = useCallback(
    async (file: File) => {
      if (!savedOperationId) return;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('fileType', FileType.BeforeOperation);
      try {
        await uploadBeforeMutation.mutateAsync({ opId: savedOperationId, formData: fd });
        messageApi.success(t('operations.fileUploaded'));
        queryClient.invalidateQueries({ queryKey: ['operation-files-before', savedOperationId] });
        queryClient.invalidateQueries({ queryKey: ['operation-detail', savedOperationId] });
      } catch {
        messageApi.error(t('common.operationFailed'));
      }
    },
    [savedOperationId, uploadBeforeMutation, queryClient, messageApi, t],
  );

  const handleAfterUpload = useCallback(
    async (file: File) => {
      if (!savedOperationId) return;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('fileType', FileType.AfterOperation);
      try {
        await uploadAfterMutation.mutateAsync({ opId: savedOperationId, formData: fd });
        messageApi.success(t('operations.fileUploaded'));
        queryClient.invalidateQueries({ queryKey: ['operation-files-after', savedOperationId] });
        queryClient.invalidateQueries({ queryKey: ['operation-detail', savedOperationId] });
      } catch {
        messageApi.error(t('common.operationFailed'));
      }
    },
    [savedOperationId, uploadAfterMutation, queryClient, messageApi, t],
  );

  const handleDeleteFile = useCallback(
    async (fileId: string) => {
      if (!savedOperationId) return;
      try {
        await deleteFileMutation.mutateAsync({ opId: savedOperationId, fileId });
        messageApi.success(t('operations.fileDeleted'));
        queryClient.invalidateQueries({ queryKey: ['operation-files-before', savedOperationId] });
        queryClient.invalidateQueries({ queryKey: ['operation-files-after', savedOperationId] });
        queryClient.invalidateQueries({ queryKey: ['operation-detail', savedOperationId] });
      } catch {
        messageApi.error(t('common.operationFailed'));
      }
    },
    [savedOperationId, deleteFileMutation, queryClient, messageApi, t],
  );

  // ── Navigation ─────────────────────────────────
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNext = useCallback(() => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, validateCurrentStep]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Loading for edit mode ──────────────────────
  if (isEditMode && loadingOperation) {
    return (
      <div className={styles.page}>
        {contextHolder}
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // ── Step titles ────────────────────────────────
  const stepTitles = [
    t('operations.step1Patient'),
    t('operations.step2Operation'),
    t('operations.step3Team'),
    t('operations.step4Cost'),
    t('operations.step5Files'),
    t('operations.step6Review'),
  ];

  // ═══════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════
  return (
    <div className={styles.page}>
      {contextHolder}

      {/* ─── Page Header ──────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/operations')}
            className={styles.backButton}
          >
            {t('common.back')}
          </Button>
          <h1 className={styles.pageTitle}>
            {isEditMode ? t('operations.editOperation') : t('operations.addOperation')}
          </h1>
          <span className={styles.stepSubtitle}>
            {t('operations.step', { current: currentStep + 1, total: STEPS.length })}
          </span>
        </div>
      </div>

      {/* ─── Steps Navigator ─────────────────────── */}
      <div className={styles.stepsContainer}>
        <Steps
          current={currentStep}
          onChange={goToStep}
          items={STEPS.map((step, idx) => ({
            title: stepTitles[idx],
            icon: step.icon,
          }))}
          className={styles.stepsBar}
          direction="horizontal"
          size="small"
        />
      </div>

      {/* ─── Step Content ────────────────────────── */}
      <div className={styles.stepsContent}>
        {currentStep === 0 && (
          <PatientStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            clearError={clearError}
          />
        )}
        {currentStep === 1 && (
          <OperationStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            clearError={clearError}
          />
        )}
        {currentStep === 2 && (
          <TeamStep
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {currentStep === 3 && (
          <CostStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            clearError={clearError}
          />
        )}
        {currentStep === 4 && (
          <FilesStep
            operationId={savedOperationId}
            beforeFiles={beforeFiles}
            afterFiles={afterFiles}
            onBeforeUpload={handleBeforeUpload}
            onAfterUpload={handleAfterUpload}
            onDeleteFile={handleDeleteFile}
          />
        )}
        {currentStep === 5 && (
          <ReviewStep
            formData={formData}
            goToStep={goToStep}
            hospitals={hospitals}
            specialties={specialties}
            doctors={doctors}
          />
        )}
      </div>

      {/* ─── Bottom Action Bar (Mobile Sticky) ──── */}
      <div className={styles.bottomActionBar}>
        <div className={styles.bottomActions}>
          {currentStep > 0 && (
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className={styles.backBtn}
            >
              {t('common.back')}
            </Button>
          )}

          {currentStep >= 1 && currentStep < 5 && !savedOperationId && (
            <Button
              size="large"
              icon={<SaveOutlined />}
              onClick={() => handleSave(true)}
              loading={isSaving}
              className={styles.quickSaveBtn}
            >
              {t('operations.quickSave')}
            </Button>
          )}

          {currentStep < 5 && (
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={handleNext}
              className={styles.nextBtn}
            >
              {t('common.next')}
            </Button>
          )}

          {currentStep === 5 && (
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={() => handleSave(false)}
              loading={isSaving}
              className={styles.submitBtn}
            >
              {savedOperationId
                ? isEditMode
                  ? t('operations.operationUpdated')
                  : t('operations.saveAndContinue')
                : t('common.submit')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
