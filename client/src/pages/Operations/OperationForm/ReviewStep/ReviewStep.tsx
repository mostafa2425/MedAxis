import type { ReactNode } from 'react';
import { Button, Tag, Descriptions } from 'antd';
import {
  UserOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  DollarOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  formatCurrency,
  formatDate,
  formatTime,
  getStatusColor,
  calculateRemaining,
} from '@/utils/helpers';
import {
  OPERATION_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  GENDERS,
} from '@/utils/constants';
import {
  OperationStatus,
  PaymentMethod,
  PaymentStatus,
  type Hospital,
  type Specialty,
  type Doctor,
  type Nurse,
} from '@/types';
import type { WizardFormData } from '../wizardTypes';
import { getStatusBg } from '../wizardHelpers';
import './ReviewStep.scss';

export interface ReviewStepProps {
  formData: WizardFormData;
  goToStep: (step: number) => void;
  hospitals: Hospital[];
  specialties: Specialty[];
  doctors: Doctor[];
  nurses: Nurse[];
}

function ReviewSection({
  icon,
  title,
  onEdit,
  children,
}: {
  icon: ReactNode;
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <section className="reviewSection">
      <header className="reviewSectionHeader">
        <h3 className="reviewSectionTitle">
          {icon}
          <span>{title}</span>
        </h3>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={onEdit}>
          {t('common.edit')}
        </Button>
      </header>
      <div className="reviewSectionBody">{children}</div>
    </section>
  );
}

export default function ReviewStep({
  formData,
  goToStep,
  hospitals,
  specialties,
  doctors,
  nurses,
}: ReviewStepProps) {
  const { t } = useTranslation();
  const currency = t('common.currency');

  const findHospital = (id: string) => hospitals.find((h) => h.id === id)?.name ?? id;
  const findSpecialty = (id: string) => specialties.find((s) => s.id === id)?.name ?? id;
  const findDoctor = (id: string) => doctors.find((d) => d.id === id)?.name ?? id;
  const findNurse = (id: string) => nurses.find((n) => n.id === id)?.name ?? id;
  const getStatusLabel = (status: OperationStatus) =>
    OPERATION_STATUSES.find((s) => s.value === status)?.label ?? status;
  const getPaymentLabel = (method: PaymentMethod) =>
    PAYMENT_METHODS.find((m) => m.value === method)?.label ?? method;
  const getPayStatusLabel = (status: PaymentStatus) =>
    PAYMENT_STATUSES.find((s) => s.value === status)?.label ?? status;

  const remaining = calculateRemaining(formData.totalCost, formData.paidAmount);

  return (
    <div className="stepContent reviewStep">
      <ReviewSection
        icon={<UserOutlined />}
        title={t('operations.step1Patient')}
        onEdit={() => goToStep(0)}
      >
        {formData.isNewPatient ? (
          <Descriptions column={{ xs: 1, sm: 2 }} size="small">
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
          <div className="reviewSelectedPatient">
            <Tag color="blue" icon={<UserOutlined />}>
              {formData.selectedPatientName || formData.patientId || '—'}
            </Tag>
            {formData.selectedPatientMobile && (
              <span className="reviewMeta">{formData.selectedPatientMobile}</span>
            )}
          </div>
        )}
      </ReviewSection>

      <ReviewSection
        icon={<MedicineBoxOutlined />}
        title={t('operations.step2Operation')}
        onEdit={() => goToStep(1)}
      >
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label={t('operations.surgicalProcedures')}>
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
      </ReviewSection>

      <ReviewSection
        icon={<TeamOutlined />}
        title={t('operations.step3Team')}
        onEdit={() => goToStep(2)}
      >
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label={t('operations.teamDoctors')}>
            {formData.doctorIds.length
              ? formData.doctorIds.map((id) => findDoctor(id)).join(', ')
              : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.teamNurses')}>
            {formData.nurseIds.length
              ? formData.nurseIds.map((id) => findNurse(id)).join(', ')
              : '—'}
          </Descriptions.Item>
        </Descriptions>
      </ReviewSection>

      <ReviewSection
        icon={<DollarOutlined />}
        title={t('operations.step4Cost')}
        onEdit={() => goToStep(3)}
      >
        <div className="reviewCostGrid">
          <div className="reviewCostItem">
            <span className="reviewCostLabel">{t('operations.totalCost')}</span>
            <span className="reviewCostValue">{formatCurrency(formData.totalCost, currency)}</span>
          </div>
          <div className="reviewCostItem">
            <span className="reviewCostLabel">{t('operations.paidAmount')}</span>
            <span className="reviewCostValue">{formatCurrency(formData.paidAmount, currency)}</span>
          </div>
          <div className="reviewCostItem">
            <span className="reviewCostLabel">{t('operations.remainingAmount')}</span>
            <span className={`reviewCostValue ${remaining > 0 ? 'isDue' : 'isClear'}`}>
              {formatCurrency(remaining, currency)}
            </span>
          </div>
        </div>
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label={t('operations.paymentMethod')}>
            {getPaymentLabel(formData.paymentMethod)}
          </Descriptions.Item>
          <Descriptions.Item label={t('operations.paymentStatus')}>
            <Tag
              color={
                formData.paymentStatus === PaymentStatus.Paid
                  ? 'green'
                  : formData.paymentStatus === PaymentStatus.Unpaid
                    ? 'red'
                    : 'orange'
              }
            >
              {getPayStatusLabel(formData.paymentStatus)}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </ReviewSection>
    </div>
  );
}
