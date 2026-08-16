import { useState, type ChangeEvent } from 'react';
import { Button, Input, Empty, message } from 'antd';
import { PlusOutlined, SearchOutlined, BankOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { hospitalService } from '@/services/hospital.service';
import { useDebounce } from '@/hooks/useDebounce';
import { DEFAULT_PAGINATION } from '@/utils/constants';
import type { Hospital } from '@/types';
import HospitalList from './HospitalList/HospitalList';
import AddHospital from './AddHospital/AddHospital';
import './Hospitals.scss';

export default function HospitalsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState<number>(DEFAULT_PAGINATION.page);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hospitals', page, debouncedSearch],
    queryFn: () =>
      hospitalService.getAll({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: debouncedSearch || undefined,
      }),
  });

  const hospitals: Hospital[] = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const total = pagination?.total ?? hospitals.length;

  const deleteMutation = useMutation({
    mutationFn: hospitalService.delete,
    onSuccess: () => {
      messageApi.success(t('hospitals.hospitalDeleted'));
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
    },
    onError: () => {
      messageApi.error(t('common.operationFailed'));
    },
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleOpenAdd = () => {
    setEditingHospital(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingHospital(null);
  };

  if (isError) {
    return (
      <div className="hospitals-page page">
        {contextHolder}
        <header className="pageHeader">
          <div className="pageHeaderText">
            <h1 className="pageTitle">{t('hospitals.title')}</h1>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            {t('hospitals.addHospital')}
          </Button>
        </header>
        <Empty
          className="emptyState"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('common.operationFailed')}
        />
      </div>
    );
  }

  return (
    <div className="hospitals-page page">
      {contextHolder}

      <header className="pageHeader">
        <div className="pageHeaderLeft">
          <div className="pageIcon" aria-hidden>
            <BankOutlined />
          </div>
          <div className="pageHeaderText">
            <h1 className="pageTitle">{t('hospitals.title')}</h1>
          </div>
        </div>
        <div className="pageHeaderMeta">
          {/* {!isLoading && (
            <span className="countPill">
              {t('common.total')}: {total}
            </span>
          )} */}
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd} size="large">
            {t('hospitals.addHospital')}
          </Button>
        </div>
      </header>

      <div className="toolbar">
        <Input
          className="toolbarSearch"
          prefix={<SearchOutlined />}
          placeholder={t('hospitals.searchPlaceholder')}
          size="large"
          value={search}
          onChange={handleSearchChange}
          allowClear
          disabled={isLoading}
        />
      </div>

      <HospitalList
        hospitals={hospitals}
        isLoading={isLoading}
        hasSearch={Boolean(debouncedSearch)}
        page={page}
        pageSize={DEFAULT_PAGINATION.limit}
        total={total}
        onPageChange={setPage}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <AddHospital
        open={modalOpen}
        hospital={editingHospital}
        onClose={handleCloseModal}
      />
    </div>
  );
}
