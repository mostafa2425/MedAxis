import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Input, InputNumber, Radio, notification, Spin, Typography } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { patientService } from '@/services/patient.service';
import { Gender, type CreatePatientPayload, type UpdatePatientPayload } from '@/types';
import dayjs from 'dayjs';
import styles from './PatientFormPage.module.scss';

const { TextArea } = Input;
const { Text } = Typography;

// ─── Zod Schema ──────────────────────────────────
const patientFormSchema = z.object({
  fullName: z.string().min(1, 'validation.required'),
  age: z.coerce
    .number({ invalid_type_error: 'validation.mustBeNumber' })
    .int('validation.mustBeNumber')
    .min(0, 'validation.mustBePositive')
    .max(150, 'validation.maxLength'),
  gender: z.nativeEnum(Gender),
  mobile: z.string().optional(),
  notes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

// ─── Age from dateOfBirth ────────────────────────
function computeAgeFromDateOfBirth(dateOfBirth: string | null): number | undefined {
  if (!dateOfBirth) return undefined;
  return dayjs().diff(dayjs(dateOfBirth), 'year');
}

// ─── Convert age to dateOfBirth ──────────────────
function ageToDateOfBirth(age: number): string {
  return dayjs().subtract(age, 'year').format('YYYY-MM-DD');
}

// ═══════════════════════════════════════════════════════
// Patient Form Page (Add / Edit)
// ═══════════════════════════════════════════════════════
export default function PatientFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const editId = searchParams.get('edit');
  const isEditMode = Boolean(editId);

  // ─── Fetch existing patient for edit mode ──────
  const { data: patientData, isLoading: isLoadingPatient } = useQuery({
    queryKey: ['patient', editId],
    queryFn: () => patientService.getById(editId!),
    enabled: isEditMode,
  });

  const existingPatient = patientData?.data?.data ?? null;

  // ─── Form Setup ────────────────────────────────
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      fullName: '',
      age: undefined as unknown as number,
      gender: Gender.Male,
      mobile: '',
      notes: '',
    },
  });

  // ─── Reset form when patient data loads ───────
  useEffect(() => {
    if (existingPatient) {
      reset({
        fullName: existingPatient.fullName ?? '',
        age: computeAgeFromDateOfBirth(existingPatient.dateOfBirth) as unknown as number,
        gender: existingPatient.gender ?? Gender.Male,
        mobile: existingPatient.mobile ?? '',
        notes: existingPatient.notes ?? '',
      });
    }
  }, [existingPatient, reset]);

  // ─── Create Mutation ───────────────────────────
  const createMutation = useMutation({
    mutationFn: (values: PatientFormValues) => {
      const payload: CreatePatientPayload = {
        fullName: values.fullName,
        gender: values.gender,
        mobile: values.mobile ?? '',
        dateOfBirth: ageToDateOfBirth(values.age),
        notes: values.notes || undefined,
      };
      return patientService.create(payload);
    },
    onSuccess: (response) => {
      const newPatient = response.data.data;
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      notification.success({
        message: t('common.success'),
        description: t('patients.patientCreated'),
        placement: 'topRight',
      });
      if (newPatient?.id) {
        navigate(`/patients/${newPatient.id}`);
      } else {
        navigate('/patients');
      }
    },
    onError: () => {
      notification.error({
        message: t('common.error'),
        description: t('common.operationFailed'),
        placement: 'topRight',
      });
    },
  });

  // ─── Update Mutation ───────────────────────────
  const updateMutation = useMutation({
    mutationFn: (values: PatientFormValues) => {
      const payload: UpdatePatientPayload = {
        fullName: values.fullName,
        gender: values.gender,
        mobile: values.mobile || undefined,
        dateOfBirth: ageToDateOfBirth(values.age),
        notes: values.notes || undefined,
      };
      return patientService.update(editId!, payload);
    },
    onSuccess: (response) => {
      const updatedPatient = response.data.data;
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', editId] });
      notification.success({
        message: t('common.success'),
        description: t('patients.patientUpdated'),
        placement: 'topRight',
      });
      if (updatedPatient?.id) {
        navigate(`/patients/${updatedPatient.id}`);
      } else {
        navigate('/patients');
      }
    },
    onError: () => {
      notification.error({
        message: t('common.error'),
        description: t('common.operationFailed'),
        placement: 'topRight',
      });
    },
  });

  // ─── Submit Handler ────────────────────────────
  const onSubmit = (values: PatientFormValues) => {
    if (isEditMode) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  // ─── Loading State (Edit Mode) ─────────────────
  if (isEditMode && isLoadingPatient) {
    return (
      <div className={styles.loadingWrapper}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ─── Page Header ────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            type="text"
            className={styles.backButton}
          >
            {t('common.back')}
          </Button>
          <h1 className={styles.pageTitle}>
            {isEditMode ? t('patients.editPatient') : t('patients.addPatient')}
          </h1>
        </div>
      </div>

      {/* ─── Form ──────────────────────────────────── */}
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.formCard}>
          {/* Full Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="fullName">
              {t('patients.fullName')} <span className={styles.required}>*</span>
            </label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  id="fullName"
                  size="large"
                  placeholder={t('patients.fullName')}
                  status={errors.fullName ? 'error' : undefined}
                  {...field}
                />
              )}
            />
            {errors.fullName && (
              <Text type="danger" className={styles.errorText}>
                {t(errors.fullName.message)}
              </Text>
            )}
          </div>

          {/* Age & Gender Row */}
          <div className={styles.formRow}>
            {/* Age */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="age">
                {t('common.age')} <span className={styles.required}>*</span>
              </label>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    id="age"
                    size="large"
                    min={0}
                    max={150}
                    placeholder={t('common.age')}
                    style={{ width: '100%' }}
                    status={errors.age ? 'error' : undefined}
                    {...field}
                    value={field.value as number | undefined}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
              {errors.age && (
                <Text type="danger" className={styles.errorText}>
                  {t(errors.age.message)}
                </Text>
              )}
            </div>

            {/* Gender */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {t('patients.gender')} <span className={styles.required}>*</span>
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Radio.Group
                    size="large"
                    optionType="button"
                    buttonStyle="solid"
                    className={styles.genderRadio}
                    {...field}
                  >
                    <Radio.Button value={Gender.Male}>
                      {t('patients.male')}
                    </Radio.Button>
                    <Radio.Button value={Gender.Female}>
                      {t('patients.female')}
                    </Radio.Button>
                  </Radio.Group>
                )}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="mobile">
              {t('patients.mobile')}
            </label>
            <Controller
              name="mobile"
              control={control}
              render={({ field }) => (
                <Input
                  id="mobile"
                  size="large"
                  placeholder={t('patients.mobile')}
                  allowClear
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />
          </div>

          {/* Notes */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="notes">
              {t('patients.notes')}
            </label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextArea
                  id="notes"
                  rows={4}
                  placeholder={t('patients.notes')}
                  allowClear
                  showCount
                  maxLength={1000}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />
          </div>
        </div>

        {/* ─── Form Actions (Desktop) ──────────────── */}
        <div className={styles.formActionsDesktop}>
          <Button
            size="large"
            onClick={() => navigate(-1)}
            className={styles.cancelBtn}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<SaveOutlined />}
            loading={isSaving}
            className={styles.submitBtn}
          >
            {t('common.save')}
          </Button>
        </div>
      </form>

      {/* ─── Sticky Bottom Actions (Mobile) ──────── */}
      <div className={styles.formActionsMobile}>
        <Button
          size="large"
          onClick={() => navigate(-1)}
          block
          className={styles.cancelBtn}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon={<SaveOutlined />}
          loading={isSaving}
          block
          onClick={handleSubmit(onSubmit)}
        >
          {t('common.save')}
        </Button>
      </div>
    </div>
  );
}
