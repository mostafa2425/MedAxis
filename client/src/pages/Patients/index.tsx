import { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, Empty } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { patientService } from '@/services/patient.service';
import { operationCatalogService } from '@/services/operationCatalog.service';
import { useDebounce } from '@/hooks/useDebounce';
import { DEFAULT_PAGINATION } from '@/utils/constants';
import { Gender, type OperationCatalogItem, type Patient } from '@/types';
import PatientList from './PatientList/PatientList';
import AddPatient from './AddPatient/AddPatient';
import './Patients.scss';

export default function PatientsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [gender, setGender] = useState<Gender | undefined>();
  const [surgicalProcedureId, setSurgicalProcedureId] = useState<string | undefined>();
  const [page, setPage] = useState<number>(DEFAULT_PAGINATION.page);
  const [modalOpen, setModalOpen] = useState(searchParams.get('add') === '1');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (searchParams.get('add') !== '1') return;
    setModalOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete('add');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['patients', page, debouncedSearch, gender, surgicalProcedureId],
    queryFn: () =>
      patientService.getAll({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: debouncedSearch || undefined,
        gender,
        surgicalProcedureId,
      }),
  });

  const { data: surgicalProceduresData, isLoading: isLoadingSurgicalProcedures } = useQuery({
    queryKey: ['patient-used-surgical-procedures'],
    queryFn: () => operationCatalogService.getUsed(),
  });

  const patients: Patient[] = data?.data?.data ?? [];
  const pagination = data?.data?.meta ?? data?.data?.pagination;
  const total = pagination?.total ?? patients.length;
  const surgicalProcedures: OperationCatalogItem[] = surgicalProceduresData?.data?.data ?? [];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleGenderChange = (value?: Gender) => {
    setGender(value);
    setPage(1);
  };

  const handleSurgicalProcedureChange = (value?: string) => {
    setSurgicalProcedureId(value);
    setPage(1);
  };

  const handleOpenAdd = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  if (isError) {
    return (
      <div className="patients-page page">
        <div className="pageHeader">
          <div className="pageHeaderLeft">
            <h1 className="pageTitle">{t('patients.title')}</h1>
            <p className="pageSubtitle">{t('patients.patientInfo')}</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            {t('patients.addPatient')}
          </Button>
        </div>
        <Empty className="emptyState" image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.operationFailed')} />
      </div>
    );
  }

  return (
    <div className="patients-page page">
      <div className="pageHeader">
        <div className="pageHeaderLeft">
          <h1 className="pageTitle">{t('patients.title')}</h1>
          <p className="pageSubtitle">{t('patients.patientInfo')}</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
          {t('patients.addPatient')}
        </Button>
      </div>

      <div className="searchSection">
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('patients.searchPlaceholder')}
          value={search}
          onChange={handleSearchChange}
          allowClear
          disabled={isLoading}
        />
      </div>

      <PatientList
        patients={patients}
        isLoading={isLoading}
        hasSearch={Boolean(debouncedSearch) || Boolean(gender) || Boolean(surgicalProcedureId)}
        page={page}
        pageSize={DEFAULT_PAGINATION.limit}
        total={total}
        gender={gender}
        surgicalProcedureId={surgicalProcedureId}
        surgicalProcedures={surgicalProcedures}
        isLoadingSurgicalProcedures={isLoadingSurgicalProcedures}
        onGenderChange={handleGenderChange}
        onSurgicalProcedureChange={handleSurgicalProcedureChange}
        onPageChange={setPage}
        onRowClick={(id) => navigate(`/patients/${id}`)}
        onAdd={handleOpenAdd}
      />

      <AddPatient open={modalOpen} onClose={handleCloseModal} />
    </div>
  );
}
