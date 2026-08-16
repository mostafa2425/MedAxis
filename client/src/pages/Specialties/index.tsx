import { useState, type ChangeEvent } from 'react';
import { Button, Input, Empty, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { specialtyService } from '@/services/specialty.service';
import { useDebounce } from '@/hooks/useDebounce';
import { DEFAULT_PAGINATION } from '@/utils/constants';
import type { Specialty } from '@/types';
import SpecialtyList from './SpecialtyList/SpecialtyList';
import MySpecialtyGroups from './MySpecialtyGroups/MySpecialtyGroups';
import AddSpecialty from './AddSpecialty/AddSpecialty';
import './Specialties.scss';

const PAGE_SIZE = 24;

export default function SpecialtiesPage() {
  const { t } = useTranslation();
  const { user: storeUser } = useAuth();
  const isAdmin = storeUser?.role === 'admin';
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState<number>(DEFAULT_PAGINATION.page);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data: meData } = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => authService.getMe(),
    enabled: !isAdmin,
    staleTime: 60_000,
  });

  const meUser = meData?.data?.data ?? storeUser;
  const mySpecialties = meUser?.specialties ?? [];
  const parentIdsKey = mySpecialties.map((specialty) => specialty.id).slice().sort().join(',');

  const doctorQuery = useQuery({
    queryKey: ['specialties-mine', parentIdsKey],
    queryFn: () =>
      specialtyService.getAll({
        mine: true,
        parentIds: parentIdsKey || undefined,
      }),
    enabled: !isAdmin,
  });

  const adminQuery = useQuery({
    queryKey: ['specialties', page, debouncedSearch],
    queryFn: () =>
      specialtyService.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
      }),
    enabled: isAdmin,
  });

  const data = isAdmin ? adminQuery.data : doctorQuery.data;
  const isLoading = isAdmin ? adminQuery.isLoading : doctorQuery.isLoading;
  const isError = isAdmin ? adminQuery.isError : doctorQuery.isError;

  const specialties: Specialty[] = data?.data?.data ?? [];
  const pagination = data?.data?.meta ?? data?.data?.pagination;
  const total = pagination?.total ?? specialties.length;

  const deleteMutation = useMutation({
    mutationFn: specialtyService.delete,
    onSuccess: () => {
      messageApi.success(t('specialties.specialtyDeleted'));
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
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
    setEditingSpecialty(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSpecialty(null);
  };

  if (isError) {
    return (
      <div className="specialties-page page">
        {contextHolder}
        <div className="pageHeader">
          <div className="pageHeaderLeft">
            <h1 className="pageTitle">
              {isAdmin ? t('specialties.title') : t('specialties.mySpecialties')}
            </h1>
            <p className="pageSubtitle">
              {isAdmin ? t('specialties.catalogSubtitle') : t('specialties.mySubtitle')}
            </p>
          </div>
          {isAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            {t('specialties.addSpecialty')}
          </Button>
          )}
        </div>
        <Empty
          className="emptyState"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('common.operationFailed')}
        />
      </div>
    );
  }

  return (
    <div className="specialties-page page">
      {contextHolder}

      <div className="pageHeader">
        <div className="pageHeaderLeft">
          <h1 className="pageTitle">
            {isAdmin ? t('specialties.title') : t('specialties.mySpecialties')}
          </h1>
          <p className="pageSubtitle">
            {isAdmin ? t('specialties.catalogSubtitle') : t('specialties.mySubtitle')}
          </p>
        </div>
        {isAdmin && (
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
          {t('specialties.addSpecialty')}
        </Button>
        )}
      </div>

      <div className="searchSection">
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('specialties.searchPlaceholder')}
          size="large"
          value={search}
          onChange={handleSearchChange}
          allowClear
          disabled={isLoading}
        />
      </div>

      {isAdmin ? (
        <SpecialtyList
          specialties={specialties}
          isLoading={isLoading}
          hasSearch={Boolean(debouncedSearch)}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={(id) => deleteMutation.mutate(id)}
          readOnly={false}
        />
      ) : (
        <MySpecialtyGroups
          specialties={mySpecialties}
          areas={specialties}
          isLoading={isLoading}
          search={debouncedSearch}
        />
      )}

      <AddSpecialty
        open={modalOpen}
        specialty={editingSpecialty}
        onClose={handleCloseModal}
      />
    </div>
  );
}
