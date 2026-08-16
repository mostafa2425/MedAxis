import { useState, type ChangeEvent } from 'react';
import {
  Button,
  Card,
  Empty,
  Input,
  message,
  Pagination,
  Spin,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
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

import './Doctors.scss';

export default function DoctorsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);
  const [nursePage, setNursePage] = useState(1);

  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [nurseModalOpen, setNurseModalOpen] = useState(false);

  const [editingDoctor, setEditingDoctor] =
    useState<Doctor | null>(null);

  const [editingNurse, setEditingNurse] =
    useState<Nurse | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  // ============================================================
  // Doctors
  // ============================================================

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['doctors', page, debouncedSearch],
    queryFn: () =>
      doctorService.getAll({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: debouncedSearch || undefined,
      }),
  });

  // ============================================================
  // Nurses
  // ============================================================

  const {
    data: nursesData,
    isLoading: nursesLoading,
  } = useQuery({
    queryKey: ['nurses', nursePage, debouncedSearch],
    queryFn: () =>
      nurseService.getAll({
        page: nursePage,
        limit: DEFAULT_PAGINATION.limit,
        search: debouncedSearch || undefined,
      }),
  });

  const doctors: Doctor[] = data?.data?.data ?? [];

  const pagination =
    data?.data?.meta ?? data?.data?.pagination;

  const total = pagination?.total ?? doctors.length;

  const nurses: Nurse[] =
    nursesData?.data?.data ?? [];

  const nursePagination =
    nursesData?.data?.meta ??
    nursesData?.data?.pagination;

  const nurseTotal =
    nursePagination?.total ?? nurses.length;

  // ============================================================
  // Delete Doctor
  // ============================================================

  const deleteDoctorMutation = useMutation({
    mutationFn: doctorService.delete,

    onSuccess: () => {
      messageApi.success(
        t('doctors.doctorDeleted'),
      );

      queryClient.invalidateQueries({
        queryKey: ['doctors'],
      });
    },

    onError: () => {
      messageApi.error(
        t('common.operationFailed'),
      );
    },
  });

  // ============================================================
  // Delete Nurse
  // ============================================================

  const deleteNurseMutation = useMutation({
    mutationFn: nurseService.delete,

    onSuccess: () => {
      messageApi.success(
        t('nurses.nurseDeleted'),
      );

      queryClient.invalidateQueries({
        queryKey: ['nurses'],
      });
    },

    onError: () => {
      messageApi.error(
        t('common.operationFailed'),
      );
    },
  });

  // ============================================================
  // Handlers
  // ============================================================

  const openAddDoctor = () => {
    setEditingDoctor(null);
    setDoctorModalOpen(true);
  };

  const openAddNurse = () => {
    setEditingNurse(null);
    setNurseModalOpen(true);
  };

  const openEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setDoctorModalOpen(true);
  };

  const openEditNurse = (nurse: Nurse) => {
    setEditingNurse(nurse);
    setNurseModalOpen(true);
  };

  const closeDoctorModal = () => {
    setDoctorModalOpen(false);
    setEditingDoctor(null);
  };

  const closeNurseModal = () => {
    setNurseModalOpen(false);
    setEditingNurse(null);
  };

  const handleSearchChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    setSearch(value);

    setPage(1);
    setNursePage(1);
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
    setNursePage(1);
  };

  // ============================================================
  // Error
  // ============================================================

  if (isError) {
    return (
      <div className="doctors-page page">
        {contextHolder}

        <div className="teamErrorState">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="teamEmptyContent">
                <span className="teamEmptyTitle">
                  {t('common.operationFailed')}
                </span>

                <span className="teamEmptyDescription">
                  {t(
                    'common.tryAgain',
                    'Something went wrong. Please try again.',
                  )}
                </span>
              </div>
            }
          >
            <Button
              type="primary"
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ['doctors'],
                })
              }
            >
              {t('common.retry', 'Try again')}
            </Button>
          </Empty>
        </div>
      </div>
    );
  }

  const hasSearch = Boolean(debouncedSearch);

  return (
    <div className="doctors-page page">
      {contextHolder}

      {/* ======================================================
          Page Header
          ====================================================== */}

      <header className="teamPageHeader">
        <div className="teamPageHeaderContent">
          <div className="teamPageTitleWrapper">
            <div className="teamPageTitleIcon">
              <TeamOutlined />
            </div>

            <div className="teamPageTitleContent">
              <h1 className="pageTitle">
                {t('team.title')}
              </h1>

              <Typography.Text className="teamPageSubtitle">
                {t('team.subtitle')}
              </Typography.Text>
            </div>
          </div>
        </div>

        <div className="teamPageActions">
          <Button
            className="teamSecondaryAction"
            icon={<PlusOutlined />}
            onClick={openAddNurse}
          >
            {t('nurses.addNurse')}
          </Button>

          <Button
            type="primary"
            className="teamPrimaryAction"
            icon={<PlusOutlined />}
            onClick={openAddDoctor}
          >
            {t('doctors.addDoctor')}
          </Button>
        </div>
      </header>

      {/* ======================================================
          Search
          ====================================================== */}

      <div className="teamSearchWrapper">
        <div className="teamSearch">
          <SearchOutlined className="teamSearchIcon" />

          <Input
            bordered={false}
            value={search}
            onChange={handleSearchChange}
            placeholder={t(
              'team.searchPlaceholder',
            )}
            className="teamSearchInput"
            allowClear
          />
        </div>

        {hasSearch && (
          <Button
            type="text"
            icon={<ClearOutlined />}
            className="teamClearSearch"
            onClick={handleClearSearch}
          >
            {t('common.clear')}
          </Button>
        )}
      </div>

      {/* ======================================================
          Doctors Section
          ====================================================== */}

      <section className="teamSection">
        <div className="teamSectionHeader">
          <div className="teamSectionTitleWrapper">
            <div className="teamSectionIcon teamSectionIcon--doctor">
              <UserOutlined />
            </div>

            <div>
              <h2 className="teamSectionTitle">
                {t('team.doctors')}
              </h2>

              <span className="teamSectionCount">
                {total}{' '}
                {total === 1
                  ? t('team.doctor', 'doctor')
                  : t('team.doctors', 'doctors')}
              </span>
            </div>
          </div>

          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={openAddDoctor}
            className="teamSectionAdd"
          >
            {t('doctors.addDoctor')}
          </Button>
        </div>

        <DoctorList
          doctors={doctors}
          isLoading={isLoading}
          hasSearch={hasSearch}
          page={page}
          pageSize={DEFAULT_PAGINATION.limit}
          total={total}
          onPageChange={setPage}
          onAdd={openAddDoctor}
          onEdit={openEditDoctor}
          onDelete={(id) =>
            deleteDoctorMutation.mutate(id)
          }
        />
      </section>

      {/* ======================================================
          Nurses Section
          ====================================================== */}

      <section className="teamSection">
        <div className="teamSectionHeader">
          <div className="teamSectionTitleWrapper">
            <div className="teamSectionIcon teamSectionIcon--nurse">
              <TeamOutlined />
            </div>

            <div>
              <h2 className="teamSectionTitle">
                {t('team.nurses')}
              </h2>

              <span className="teamSectionCount">
                {nurseTotal}{' '}
                {nurseTotal === 1
                  ? t('team.nurse', 'nurse')
                  : t('team.nurses', 'nurses')}
              </span>
            </div>
          </div>

          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={openAddNurse}
            className="teamSectionAdd"
          >
            {t('nurses.addNurse')}
          </Button>
        </div>

        <Spin
          spinning={
            nursesLoading && nurses.length > 0
          }
        >
          {nurses.length === 0 && !nursesLoading ? (
            <div className="teamEmptyState">
              <div className="teamEmptyIcon">
                <TeamOutlined />
              </div>

              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="teamEmptyContent">
                    <span className="teamEmptyTitle">
                      {hasSearch
                        ? t('common.noResults')
                        : t('nurses.noNurses')}
                    </span>

                    <span className="teamEmptyDescription">
                      {hasSearch
                        ? t(
                            'common.tryDifferentSearch',
                            'Try adjusting your search.',
                          )
                        : t(
                            'nurses.noNursesDescription',
                            'Add your first nurse to your medical team.',
                          )}
                    </span>
                  </div>
                }
              >
                {!hasSearch && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openAddNurse}
                  >
                    {t('nurses.addNurse')}
                  </Button>
                )}
              </Empty>
            </div>
          ) : (
            <div className="nurseListGrid">
              {nursesLoading &&
              nurses.length === 0 ? (
                Array.from({ length: 3 }).map(
                  (_, index) => (
                    <Card
                      key={`nurse-skeleton-${index}`}
                      className="nurseListSkeleton"
                      loading
                    />
                  ),
                )
              ) : (
                nurses.map((nurse) => (
                  <NurseCard
                    key={nurse.id}
                    nurse={nurse}
                    onEdit={openEditNurse}
                    onDelete={(id) =>
                      deleteNurseMutation.mutate(id)
                    }
                  />
                ))
              )}
            </div>
          )}
        </Spin>

        {nurseTotal >
          DEFAULT_PAGINATION.limit && (
          <div className="nurseListPagination">
            <Pagination
              current={nursePage}
              pageSize={DEFAULT_PAGINATION.limit}
              total={nurseTotal}
              onChange={setNursePage}
              showSizeChanger={false}
              showLessItems
              hideOnSinglePage
              responsive
            />
          </div>
        )}
      </section>

      {/* ======================================================
          Modals
          ====================================================== */}

      <AddDoctor
        open={doctorModalOpen}
        doctor={editingDoctor}
        onClose={closeDoctorModal}
      />

      <AddNurse
        open={nurseModalOpen}
        nurse={editingNurse}
        onClose={closeNurseModal}
      />
    </div>
  );
}