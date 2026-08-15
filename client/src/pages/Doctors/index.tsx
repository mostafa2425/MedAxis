import { useState, type ChangeEvent } from 'react';
import { Button, Input, Empty, message, Space, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { doctorService } from '@/services/doctor.service';
import { nurseService } from '@/services/nurse.service';
import { useDebounce } from '@/hooks/useDebounce';
import { DEFAULT_PAGINATION } from '@/utils/constants';
import type { Doctor, Nurse } from '@/types';
import DoctorList from './DoctorList/DoctorList';
import AddDoctor from './AddDoctor/AddDoctor';
import AddNurse from './AddNurse';
import NurseCard from './NurseCard';
import { Card, Pagination, Spin } from 'antd';
import './Doctors.scss';

export default function DoctorsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState<number>(DEFAULT_PAGINATION.page);
  const [nursePage, setNursePage] = useState(1);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [nurseModalOpen, setNurseModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['doctors', page, debouncedSearch],
    queryFn: () =>
      doctorService.getAll({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: debouncedSearch || undefined,
      }),
  });

  const { data: nursesData, isLoading: nursesLoading } = useQuery({
    queryKey: ['nurses', nursePage, debouncedSearch],
    queryFn: () =>
      nurseService.getAll({
        page: nursePage,
        limit: DEFAULT_PAGINATION.limit,
        search: debouncedSearch || undefined,
      }),
  });

  const doctors: Doctor[] = data?.data?.data ?? [];
  const pagination = data?.data?.meta ?? data?.data?.pagination;
  const total = pagination?.total ?? doctors.length;
  const nurses: Nurse[] = nursesData?.data?.data ?? [];
  const nursePagination = nursesData?.data?.meta ?? nursesData?.data?.pagination;
  const nurseTotal = nursePagination?.total ?? nurses.length;

  const deleteDoctorMutation = useMutation({
    mutationFn: doctorService.delete,
    onSuccess: () => {
      messageApi.success(t('doctors.doctorDeleted'));
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
    onError: () => messageApi.error(t('common.operationFailed')),
  });

  const deleteNurseMutation = useMutation({
    mutationFn: nurseService.delete,
    onSuccess: () => {
      messageApi.success(t('nurses.nurseDeleted'));
      queryClient.invalidateQueries({ queryKey: ['nurses'] });
    },
    onError: () => messageApi.error(t('common.operationFailed')),
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    setNursePage(1);
  };

  if (isError) {
    return (
      <div className="doctors-page page">
        {contextHolder}
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.operationFailed')} />
      </div>
    );
  }

  return (
    <div className="doctors-page page">
      {contextHolder}

      <div className="pageHeader">
        <div className="pageHeaderLeft">
          <h1 className="pageTitle">{t('team.title')}</h1>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {t('team.subtitle')}
          </Typography.Paragraph>
        </div>
        <Space wrap>
          <Button icon={<PlusOutlined />} onClick={() => { setEditingNurse(null); setNurseModalOpen(true); }}>
            {t('nurses.addNurse')}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingDoctor(null); setDoctorModalOpen(true); }}>
            {t('doctors.addDoctor')}
          </Button>
        </Space>
      </div>

      <div className="searchSection">
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('team.searchPlaceholder')}
          size="large"
          value={search}
          onChange={handleSearchChange}
          allowClear
        />
      </div>

      <section>
        <h2 className="pageTitle" style={{ fontSize: 18 }}>{t('team.doctors')}</h2>
        <DoctorList
          doctors={doctors}
          isLoading={isLoading}
          hasSearch={Boolean(debouncedSearch)}
          page={page}
          pageSize={DEFAULT_PAGINATION.limit}
          total={total}
          onPageChange={setPage}
          onAdd={() => { setEditingDoctor(null); setDoctorModalOpen(true); }}
          onEdit={(doctor) => { setEditingDoctor(doctor); setDoctorModalOpen(true); }}
          onDelete={(id) => deleteDoctorMutation.mutate(id)}
        />
      </section>

      <section>
        <h2 className="pageTitle" style={{ fontSize: 18 }}>{t('team.nurses')}</h2>
        <Spin spinning={nursesLoading && nurses.length > 0}>
          {nurses.length === 0 && !nursesLoading ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={debouncedSearch ? t('common.noResults') : t('nurses.noNurses')}
            >
              {!debouncedSearch && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setNurseModalOpen(true)}>
                  {t('nurses.addNurse')}
                </Button>
              )}
            </Empty>
          ) : (
            <div className="doctorListGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {nursesLoading && nurses.length === 0
                ? Array.from({ length: 3 }).map((_, index) => <Card key={index} loading />)
                : nurses.map((nurse) => (
                    <NurseCard
                      key={nurse.id}
                      nurse={nurse}
                      onEdit={(item) => { setEditingNurse(item); setNurseModalOpen(true); }}
                      onDelete={(id) => deleteNurseMutation.mutate(id)}
                    />
                  ))}
            </div>
          )}
        </Spin>
        {nurseTotal > DEFAULT_PAGINATION.limit && (
          <Pagination
            style={{ marginTop: 16, textAlign: 'center' }}
            current={nursePage}
            pageSize={DEFAULT_PAGINATION.limit}
            total={nurseTotal}
            onChange={setNursePage}
            showSizeChanger={false}
          />
        )}
      </section>

      <AddDoctor open={doctorModalOpen} doctor={editingDoctor} onClose={() => { setDoctorModalOpen(false); setEditingDoctor(null); }} />
      <AddNurse open={nurseModalOpen} nurse={editingNurse} onClose={() => { setNurseModalOpen(false); setEditingNurse(null); }} />
    </div>
  );
}
