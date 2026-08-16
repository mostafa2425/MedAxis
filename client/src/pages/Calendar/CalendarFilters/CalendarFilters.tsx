import { Button, Select, Space } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { OperationStatus, type Doctor, type Hospital, type Specialty } from '@/types';
import { getSpecialtyLabel } from '@/utils/helpers';
import { useAppStore } from '@/stores/app.store';
import type { CalendarFilters } from '../calendarUtils';
import './CalendarFilters.scss';

interface CalendarFiltersProps {
  filters: CalendarFilters;
  hospitals: Hospital[];
  specialties: Specialty[];
  doctors: Doctor[];
  onChange: (filters: CalendarFilters) => void;
  onClear: () => void;
}

export default function CalendarFiltersBar({
  filters,
  hospitals,
  specialties,
  doctors,
  onChange,
  onClear,
}: CalendarFiltersProps) {
  const { t, i18n } = useTranslation();
  const language = useAppStore((s) => s.language);
  const hasFilters = Boolean(
    filters.status || filters.hospitalId || filters.specialtyId || filters.doctorId,
  );

  return (
    <div className="calendarFilters">
      <Select
        allowClear
        placeholder={t('operations.allStatuses')}
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
        options={[
          { value: OperationStatus.Scheduled, label: t('operations.scheduled') },
          { value: OperationStatus.InProgress, label: t('operations.inProgress') },
          { value: OperationStatus.Completed, label: t('operations.completed') },
          { value: OperationStatus.Cancelled, label: t('operations.cancelled') },
        ]}
      />

      <Select
        allowClear
        showSearch
        optionFilterProp="label"
        placeholder={t('operations.allHospitals')}
        value={filters.hospitalId}
        onChange={(hospitalId) => onChange({ ...filters, hospitalId })}
        options={hospitals.map((hospital) => ({
          value: hospital.id,
          label: language === 'ar' && hospital.nameAr ? hospital.nameAr : hospital.name,
        }))}
      />

      <Select
        allowClear
        showSearch
        optionFilterProp="label"
        placeholder={t('operations.allSpecialties')}
        value={filters.specialtyId}
        onChange={(specialtyId) => onChange({ ...filters, specialtyId })}
        options={specialties
          .filter((specialty) => !specialty.parentId)
          .map((specialty) => ({
          value: specialty.id,
          label: getSpecialtyLabel(specialty, i18n.language),
        }))}
      />

      {doctors.length > 0 ? (
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder={t('operations.selectDoctor')}
          value={filters.doctorId}
          onChange={(doctorId) => onChange({ ...filters, doctorId })}
          options={doctors.map((doctor) => ({
            value: doctor.id,
            label: doctor.name,
          }))}
        />
      ) : null}

      {hasFilters ? (
        <Space>
          <Button icon={<ClearOutlined />} onClick={onClear}>
            {t('calendar.clearFilters')}
          </Button>
        </Space>
      ) : null}
    </div>
  );
}
