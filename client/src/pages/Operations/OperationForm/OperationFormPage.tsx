import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { operationService } from '@/services/operation.service';
import { patientService } from '@/services/patient.service';
import { doctorService } from '@/services/doctor.service';
import { hospitalService } from '@/services/hospital.service';
import { specialtyService } from '@/services/specialty.service';
import { nurseService } from '@/services/nurse.service';
import { useDebounce } from '@/hooks/useDebounce';
import {
  FileType,
  PaymentMethod,
  PaymentStatus,
  OperationStatus,
  type Operation,
  type Doctor,
  type Hospital,
  type Specialty,
  type Nurse,
  type OperationFile,
  type CreateOperationPayload,
  type CreatePatientPayload,
} from '@/types';

import {
  parseApiValidationErrors,
  toFieldErrorMap,
  scrollToField,
  getApiErrorMessage,
} from '@/utils/apiValidationErrors';
import { isBeforeFileType, isAfterFileType } from '@/utils/helpers';
import { STEPS, LAST_USED_HOSPITAL_KEY, getDefaultFormData } from './wizardConstants';
import type { WizardFormData } from './wizardTypes';
import { resolveWizardErrorStep } from './wizardHelpers';
import PatientStep from './PatientStep/PatientStep';
import OperationDetailsStep from './OperationDetailsStep/OperationDetailsStep';
import TeamStep from './TeamStep/TeamStep';
import CostStep from './CostStep/CostStep';
import FilesStep from './FilesStep/FilesStep';
import ReviewStep from './ReviewStep/ReviewStep';
import WizardNav from './WizardNav/WizardNav';
import WizardActions from './WizardActions/WizardActions';
import './OperationForm.scss';

export default function OperationFormPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const isEditMode = Boolean(id);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WizardFormData>(getDefaultFormData);
  const [savedOperationId, setSavedOperationId] = useState<string | null>(id || null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSaving, setIsSaving] = useState(false);

  const notesDebounced = useDebounce(formData.notes, 800);
  const notesAutoSaveRef = useRef(false);

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

  const { data: nursesData } = useQuery({
    queryKey: ['nurses-active'],
    queryFn: () => nurseService.getActive(),
    staleTime: 60_000,
  });

  const hospitals: Hospital[] = hospitalsData?.data?.data ?? [];
  const specialties: Specialty[] = specialtiesData?.data?.data ?? [];
  const doctors: Doctor[] = doctorsData?.data?.data ?? [];
  const nurses: Nurse[] = nursesData?.data?.data ?? [];

  const { data: operationData, isLoading: loadingOperation } = useQuery({
    queryKey: ['operation-detail', id],
    queryFn: () => operationService.getById(id!),
    enabled: isEditMode,
  });

  const existingOperation: Operation | null = operationData?.data?.data ?? null;

  useEffect(() => {
    if (!existingOperation) return;

    setFormData((prev) => ({
      ...prev,
      patientId: existingOperation.patientId,
      selectedPatientName: existingOperation.patient?.fullName ?? '',
      selectedPatientMobile: existingOperation.patient?.mobile ?? '',
      isNewPatient: false,
      patientSearchQuery: existingOperation.patient?.fullName ?? '',
      name: existingOperation.name,
      operationIds:
        existingOperation.procedures?.map((procedure) => procedure.catalogId).filter((procedureId): procedureId is string => Boolean(procedureId))
        ?? (existingOperation.catalogId ? [existingOperation.catalogId] : []),
      operationId: existingOperation.catalogId ?? existingOperation.catalog?.id ?? '',
      diagnosis: existingOperation.diagnosis ?? '',
      hospitalId: existingOperation.hospitalId,
      specialtyId: existingOperation.specialtyId ?? '',
      operationDate: existingOperation.operationDate,
      operationTime: existingOperation.operationTime,
      operationRoom: existingOperation.operationRoom ?? '',
      duration: existingOperation.duration,
      status: existingOperation.status,
      doctorIds:
        existingOperation.teamMembers?.filter((member) => member.doctorId).map((member) => member.doctorId as string)
        ?? [
          existingOperation.medicalTeam?.primarySurgeonId,
          existingOperation.medicalTeam?.assistantSurgeonId,
          existingOperation.medicalTeam?.anesthesiologistId,
          existingOperation.medicalTeam?.assistantAnesthesiaId,
        ].filter((doctorId): doctorId is string => Boolean(doctorId)),
      nurseIds:
        existingOperation.teamMembers?.filter((member) => member.nurseId).map((member) => member.nurseId as string)
        ?? [],
      primarySurgeonId: existingOperation.medicalTeam?.primarySurgeonId ?? '',
      assistantSurgeonId: existingOperation.medicalTeam?.assistantSurgeonId ?? '',
      anesthesiologistId: existingOperation.medicalTeam?.anesthesiologistId ?? '',
      assistantAnesthesiaId: existingOperation.medicalTeam?.assistantAnesthesiaId ?? '',
      nurseId: '',
      teamNotes: '',
      totalCost: existingOperation.cost?.totalCost ?? 0,
      paidAmount: existingOperation.cost?.paidAmount ?? 0,
      paymentMethod: existingOperation.cost?.paymentMethod ?? PaymentMethod.Cash,
      paymentStatus: existingOperation.cost?.paymentStatus ?? PaymentStatus.Paid,
      paymentNotes: existingOperation.cost?.paymentNotes ?? '',
      notes: existingOperation.notes ?? '',
    }));
    setSavedOperationId(existingOperation.id);
  }, [existingOperation]);

  const { data: beforeFilesData } = useQuery({
    queryKey: ['operation-files-before', savedOperationId],
    queryFn: () => operationService.getById(savedOperationId!),
    enabled: !!savedOperationId,
    select: (res) =>
      res.data.data?.files?.filter((file) => isBeforeFileType(file.fileType)) ?? [],
  });

  const { data: afterFilesData } = useQuery({
    queryKey: ['operation-files-after', savedOperationId],
    queryFn: () => operationService.getById(savedOperationId!),
    enabled: !!savedOperationId,
    select: (res) =>
      res.data.data?.files?.filter((file) => isAfterFileType(file.fileType)) ?? [],
  });

  const beforeFiles: OperationFile[] = beforeFilesData ?? [];
  const afterFiles: OperationFile[] = afterFilesData ?? [];

  const createOperationMutation = useMutation({
    mutationFn: (data: CreateOperationPayload) => operationService.create(data),
  });

  const createPatientMutation = useMutation({
    mutationFn: (data: CreatePatientPayload) => patientService.create(data),
  });

  const updateOperationMutation = useMutation({
    mutationFn: ({
      opId,
      data,
    }: {
      opId: string;
      data: Partial<CreateOperationPayload> & { status?: OperationStatus };
    }) => operationService.update(opId, data),
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
    mutationFn: ({ opId, fileId }: { opId: string; fileId: string }) => operationService.deleteFile(opId, fileId),
  });

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
          newErrors.patientId = t('validation.fieldRequired', { field: t('validation.fields.patientId') });
        }
        if (formData.isNewPatient && !formData.newPatientName.trim()) {
          newErrors.newPatientName = t('validation.fieldRequired', { field: t('validation.fields.fullName') });
        }
        if (formData.isNewPatient && (formData.newPatientAge == null || formData.newPatientAge < 1)) {
          newErrors.newPatientAge = t('validation.fieldRequired', { field: t('validation.fields.age') });
        }
      }

      if (step === 1) {
        if (!formData.operationIds.length && !formData.operationId) {
          newErrors.operationIds = t('validation.fieldRequired', { field: t('operations.surgicalProcedures') });
        }
        if (!formData.hospitalId) {
          newErrors.hospitalId = t('validation.fieldRequired', { field: t('validation.fields.hospitalId') });
        }
        if (!formData.operationDate) {
          newErrors.operationDate = t('validation.fieldRequired', { field: t('validation.fields.operationDate') });
        }
        if (!formData.operationTime) {
          newErrors.operationTime = t('validation.fieldRequired', { field: t('validation.fields.operationTime') });
        }
      }

      if (step === 3) {
        if (formData.totalCost < 0) {
          newErrors.totalCost = t('validation.fieldInvalidNumber', { field: t('validation.fields.totalCost') });
        }
        if (formData.paidAmount < 0 || formData.paidAmount > formData.totalCost) {
          newErrors.paidAmount = t('operations.paidExceedsTotal');
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData, t],
  );

  const buildPayload = useCallback((): CreateOperationPayload => {
    return {
      operationIds: formData.operationIds.length > 0 ? formData.operationIds : [formData.operationId].filter(Boolean),
      operationId: formData.operationIds[0] || formData.operationId,
      name: formData.name,
      diagnosis: formData.diagnosis.trim() || null,
      patientId: formData.patientId,
      hospitalId: formData.hospitalId,
      specialtyId: formData.specialtyId || undefined,
      operationDate: formData.operationDate,
      operationTime: formData.operationTime,
      operationRoom: formData.operationRoom || undefined,
      duration: formData.duration || undefined,
      status: formData.status,
      medicalTeam: {
        doctorIds: formData.doctorIds,
        nurseIds: formData.nurseIds,
        primarySurgeonId: formData.doctorIds[0] || formData.primarySurgeonId || undefined,
        notes: formData.teamNotes || undefined,
      },
      cost: {
        totalCost: formData.totalCost || 0,
        paidAmount: formData.paidAmount || 0,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        paymentNotes: formData.paymentNotes || undefined,
      },
      notes: formData.notes || undefined,
    };
  }, [formData]);

  const handleSave = useCallback(
    async (quickSave = false) => {
      if (!quickSave && !validateCurrentStep(currentStep)) return;

      setIsSaving(true);
      try {
        let finalPatientId = formData.patientId;

        if (formData.isNewPatient && formData.newPatientName.trim()) {
          if (formData.newPatientAge == null || formData.newPatientAge < 1) {
            throw new Error('Patient age is required');
          }
          const patientResult = await createPatientMutation.mutateAsync({
            fullName: formData.newPatientName.trim(),
            age: formData.newPatientAge,
            mobile: formData.newPatientMobile.trim() || undefined,
            gender: formData.newPatientGender,
          });
          finalPatientId = patientResult.data.data.id;
          setFormData((prev) => ({
            ...prev,
            patientId: finalPatientId,
            selectedPatientName: formData.newPatientName.trim(),
            selectedPatientMobile: formData.newPatientMobile.trim(),
            isNewPatient: false,
          }));
        }

        const payload = buildPayload();
        payload.patientId = finalPatientId;

        if (payload.hospitalId) {
          localStorage.setItem(LAST_USED_HOSPITAL_KEY, payload.hospitalId);
        }

        let operationId: string;

        if (savedOperationId) {
          await updateOperationMutation.mutateAsync({ opId: savedOperationId, data: payload });
          operationId = savedOperationId;
        } else {
          const result = await createOperationMutation.mutateAsync(payload);
          operationId = result.data.data.id;
          setSavedOperationId(operationId);
        }

        queryClient.invalidateQueries({ queryKey: ['operations'] });
        queryClient.invalidateQueries({ queryKey: ['operation-detail'] });

        messageApi.success(
          quickSave
            ? t('operations.operationCreated')
            : isEditMode
              ? t('operations.operationUpdated')
              : t('operations.operationCreated'),
        );

        if (!quickSave) navigate(`/operations/${operationId}`);
      } catch (err: unknown) {
        const issues = parseApiValidationErrors(err);
        if (issues.length > 0) {
          const fieldErrors = toFieldErrorMap(issues, t);
          setErrors(fieldErrors);
          const fields = Object.keys(fieldErrors);
          const nextStep = resolveWizardErrorStep(fields, currentStep);
          if (nextStep !== currentStep) setCurrentStep(nextStep);
          messageApi.error(t('validation.fixHighlightedFields'));
          window.setTimeout(() => {
            if (fields[0]) scrollToField(fields[0]);
          }, 180);
        } else {
          messageApi.error(getApiErrorMessage(err, t('common.operationFailed')));
        }
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

  const getBeforeFileType = (file: File): string => {
    if (file.type === 'application/pdf') return 'BEFORE_PDF';
    if (file.type.startsWith('image/')) return 'BEFORE_IMAGE';
    if (/\.(dcm|dicom)$/i.test(file.name)) return 'BEFORE_XRAY';
    return 'BEFORE_IMAGE';
  };

  const getAfterFileType = (file: File): string => {
    if (file.type === 'application/pdf') return 'AFTER_PDF';
    if (file.type.startsWith('image/')) return 'AFTER_IMAGE';
    return 'AFTER_OTHER';
  };

  const handleBeforeUpload = useCallback(async (file: File) => {
    if (!savedOperationId) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('fileType', getBeforeFileType(file));
    try {
      await uploadBeforeMutation.mutateAsync({ opId: savedOperationId, formData: fd });
      messageApi.success(t('operations.fileUploaded'));
      queryClient.invalidateQueries({ queryKey: ['operation-files-before', savedOperationId] });
      queryClient.invalidateQueries({ queryKey: ['operation-detail', savedOperationId] });
    } catch (err) {
      messageApi.error(getApiErrorMessage(err, t('common.operationFailed')));
    }
  }, [savedOperationId, uploadBeforeMutation, queryClient, messageApi, t]);

  const handleAfterUpload = useCallback(async (file: File) => {
    if (!savedOperationId) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('fileType', getAfterFileType(file));
    try {
      await uploadAfterMutation.mutateAsync({ opId: savedOperationId, formData: fd });
      messageApi.success(t('operations.fileUploaded'));
      queryClient.invalidateQueries({ queryKey: ['operation-files-after', savedOperationId] });
      queryClient.invalidateQueries({ queryKey: ['operation-detail', savedOperationId] });
    } catch (err) {
      messageApi.error(getApiErrorMessage(err, t('common.operationFailed')));
    }
  }, [savedOperationId, uploadAfterMutation, queryClient, messageApi, t]);

  const handleDeleteFile = useCallback(async (fileId: string) => {
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
  }, [savedOperationId, deleteFileMutation, queryClient, messageApi, t]);

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

  const stepTitles = [
    t('operations.step1Patient'),
    t('operations.step2Operation'),
    t('operations.step3Team'),
    t('operations.step4Cost'),
    t('operations.step5Files'),
    t('operations.step6Review'),
  ];

  const canContinuePatientStep = Boolean(formData.patientId) || formData.isNewPatient;

  if (isEditMode && loadingOperation) {
    return <div className="operationFormLoading"><Spin size="large" /></div>;
  }

  return (
    <div className="operationFormPage">
      {contextHolder}
      <header className="operationFormHeader">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/operations')}>
          {t('common.back')}
        </Button>
        <div>
          <h1>{isEditMode ? t('operations.editOperation') : t('operations.addOperation')}</h1>
          <p>{t('operations.operationFormSubtitle')}</p>
        </div>
      </header>
      <WizardNav currentStep={currentStep} steps={STEPS} stepTitles={stepTitles} onStepClick={goToStep} />
      <main className="operationFormContent">
        {currentStep === 0 && (
          <PatientStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            clearError={clearError}
          />
        )}
        {currentStep === 1 && (
          <OperationDetailsStep
            formData={formData}
            errors={errors}
            hospitals={hospitals}
            specialties={specialties}
            onChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
            onClearError={clearError}
          />
        )}
        {currentStep === 2 && (
          <TeamStep
            formData={formData}
            doctors={doctors}
            nurses={nurses}
            onChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
          />
        )}
        {currentStep === 3 && (
          <CostStep formData={formData} onChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))} />
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
            hospitals={hospitals}
            specialties={specialties}
            doctors={doctors}
            nurses={nurses}
            beforeFiles={beforeFiles}
            afterFiles={afterFiles}
          />
        )}
      </main>
      <WizardActions
        currentStep={currentStep}
        isSaving={isSaving}
        savedOperationId={savedOperationId}
        isEditMode={isEditMode}
        canContinue={canContinuePatientStep}
        onBack={handleBack}
        onNext={handleNext}
        onQuickSave={() => handleSave(true)}
        onSubmit={() => handleSave(false)}
      />
    </div>
  );
}
