import React, { useState } from 'react';
import {
  Button,
  Input,
  Pagination,
  Skeleton,
  Empty,
  Tooltip,
  Modal,
  Form,
  message,
  Popconfirm,
  Space,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { hospitalService } from '@/services/hospital.service';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/helpers';
import { DEFAULT_PAGINATION } from '@/utils/constants';
import type { Hospital } from '@/types';
import styles from './HospitalsPage.module.scss';

// ─── Zod Schema ──────────────────────────────────
const hospitalFormSchema = z.object({
  name: z.string().min(1, 'validation.required'),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  nameAr: z.string().optional(),
});

type HospitalFormValues = z.infer<typeof hospitalFormSchema>;

// ─── Skeleton Card (Mobile) ──────────────────────
function SkeletonCard() {
  return (
    <div className={styles.hospitalCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <Skeleton.Avatar active size={48} shape="square" style={{ borderRadius: 12 }} />
          <div className={styles.cardHeaderInfo}>
            <Skeleton.Input active size="small" style={{ width: 160, height: 18 }} />
            <Skeleton.Input active size="small" style={{ width: 100, height: 14, marginTop: 8 }} />
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <Skeleton.Input active size="small" style={{ width: 140, height: 14 }} />
          <Skeleton.Input active size="small" style={{ width: 120, height: 14 }} />
        </div>
        <div className={styles.cardFooter}>
          <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
          <div className={styles.cardActions}>
            <Skeleton.Avatar active size={32} shape="square" />
            <Skeleton.Avatar active size={32} shape="square" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Row (Desktop) ──────────────────────
function SkeletonRow() {
  return (
    <div className={styles.hospitalRow}>
      <div className={styles.rowMain}>
        <Skeleton.Avatar active size={40} shape="square" style={{ borderRadius: 10 }} />
        <div className={styles.rowInfo}>
          <Skeleton.Input active size="small" style={{ width: 180, height: 18 }} />
          <Skeleton.Input active size="small" style={{ width: 100, height: 14, marginTop: 6 }} />
        </div>
      </div>
      <div className={styles.rowDetails}>
        <Skeleton.Input active size="small" style={{ width: 150, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 110, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 90, height: 14 }} />
      </div>
      <div className={styles.rowActions}>
        <Skeleton.Avatar active size={28} shape="square" />
        <Skeleton.Avatar active size={28} shape="square" />
      </div>
    </div>
  );
}

// ─── Hospital Card (Mobile) ──────────────────────
function HospitalCard({
  hospital,
  onEdit,
  onDelete,
}: {
  hospital: Hospital;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className={styles.hospitalCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <div className={styles.hospitalIcon}>
            <BankOutlined />
          </div>
          <div className={styles.cardHeaderInfo}>
            <span className={styles.hospitalName}>{hospital.name}</span>
            <div className={styles.cardHeaderMeta}>
              <span
                className={`${styles.activeBadge} ${hospital.isActive ? styles['activeBadge--active'] : styles['activeBadge--inactive']}`}
              >
                {hospital.isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                {hospital.isActive ? t('common.active') : t('common.inactive')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          {hospital.address && (
            <span className={styles.metaItem}>
              <EnvironmentOutlined className={styles.metaIcon} />
              {hospital.address}
            </span>
          )}
          {hospital.phone && (
            <span className={styles.metaItem}>
              <PhoneOutlined className={styles.metaIcon} />
              {hospital.phone}
            </span>
          )}
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.metaItem}>
            <CalendarOutlined className={styles.metaIcon} />
            {formatDate(hospital.createdAt)}
          </span>
          <div className={styles.cardActions}>
            <Tooltip title={t('common.edit')}>
              <Button type="text" size="small" icon={<EditOutlined />} onClick={onEdit} />
            </Tooltip>
            <Popconfirm
              title={t('common.deleteConfirm')}
              onConfirm={onDelete}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              okButtonProps={{ danger: true }}
            >
              <Tooltip title={t('common.delete')}>
                <Button type="text" size="small" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hospital Row (Desktop) ──────────────────────
function HospitalRow({
  hospital,
  onEdit,
  onDelete,
}: {
  hospital: Hospital;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className={styles.hospitalRow}>
      <div className={styles.rowMain}>
        <div className={styles.hospitalIcon}>
          <BankOutlined />
        </div>
        <div className={styles.rowInfo}>
          <span className={styles.hospitalName}>{hospital.name}</span>
          <span
            className={`${styles.activeBadge} ${hospital.isActive ? styles['activeBadge--active'] : styles['activeBadge--inactive']}`}
          >
            {hospital.isActive ? <CheckCircleOutlined /> : <StopOutlined />}
            {hospital.isActive ? t('common.active') : t('common.inactive')}
          </span>
        </div>
      </div>
      <div className={styles.rowDetails}>
        <span className={styles.rowMetaItem}>
          <EnvironmentOutlined className={styles.metaIcon} />
          {hospital.address || '—'}
        </span>
        <span className={styles.rowMetaItem}>
          <PhoneOutlined className={styles.metaIcon} />
          {hospital.phone || '—'}
        </span>
        <span className={styles.rowMetaItem}>
          <CalendarOutlined className={styles.metaIcon} />
          {formatDate(hospital.createdAt)}
        </span>
      </div>
      <div className={styles.rowActions}>
        <Tooltip title={t('common.edit')}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={onEdit} />
        </Tooltip>
        <Popconfirm
          title={t('common.deleteConfirm')}
          onConfirm={onDelete}
          okText={t('common.yes')}
          cancelText={t('common.no')}
          okButtonProps={{ danger: true }}
        >
          <Tooltip title={t('common.delete')}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Popconfirm>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Hospitals List Page
// ═══════════════════════════════════════════════════════
export default function HospitalsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  // ─── Query ───────────────────────────────────
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

  // ─── Mutations ────────────────────────────────
  const createMutation = useMutation({
    mutationFn: hospitalService.create,
    onSuccess: () => {
      messageApi.success(t('hospitals.hospitalCreated'));
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      handleCloseModal();
    },
    onError: () => {
      messageApi.error(t('common.operationFailed'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HospitalFormValues> }) =>
      hospitalService.update(id, data),
    onSuccess: () => {
      messageApi.success(t('hospitals.hospitalUpdated'));
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      handleCloseModal();
    },
    onError: () => {
      messageApi.error(t('common.operationFailed'));
    },
  });

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

  // ─── Form ─────────────────────────────────────
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalFormSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      phone: '',
      notes: '',
      nameAr: '',
    },
  });

  // ─── Handlers ─────────────────────────────────
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleOpenAdd = () => {
    setEditingHospital(null);
    reset({
      name: '',
      address: '',
      city: '',
      phone: '',
      notes: '',
      nameAr: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    reset({
      name: hospital.name,
      address: hospital.address || '',
      city: hospital.city || '',
      phone: hospital.phone || '',
      notes: hospital.notes || '',
      nameAr: hospital.nameAr || '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingHospital(null);
    reset();
  };

  const onSubmit = (values: HospitalFormValues) => {
    const payload = {
      ...values,
      address: values.address || undefined,
      city: values.city || undefined,
      phone: values.phone || undefined,
      notes: values.notes || undefined,
      nameAr: values.nameAr || undefined,
    };

    if (editingHospital) {
      updateMutation.mutate({ id: editingHospital.id, data: payload });
    } else {
      createMutation.mutate(payload as any);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // ─── Loading State ─────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>{t('hospitals.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpenAdd}
            disabled
          >
            {t('hospitals.addHospital')}
          </Button>
        </div>

        <div className={styles.searchSection}>
          <Input
            prefix={<SearchOutlined />}
            placeholder={t('hospitals.searchPlaceholder')}
            size="large"
            disabled
          />
        </div>

        <div className={styles.mobileView}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <div className={styles.desktopView}>
          <div className={styles.listContainer}>
            <div className={styles.listHeader}>
              <span className={styles.listColName}>{t('hospitals.hospitalName')}</span>
              <span className={styles.listColAddress}>{t('hospitals.address')}</span>
              <span className={styles.listColPhone}>{t('hospitals.phone')}</span>
              <span className={styles.listColDate}>{t('common.date')}</span>
              <span className={styles.listColActions}>{t('common.actions')}</span>
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ───────────────────────────────
  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>{t('hospitals.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpenAdd}
          >
            {t('hospitals.addHospital')}
          </Button>
        </div>

        <Empty
          className={styles.emptyState}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('common.operationFailed')}
        />
      </div>
    );
  }

  // ─── Main Content ──────────────────────────────
  return (
    <div className={styles.page}>
      {contextHolder}

      {/* ─── Page Header ──────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>{t('hospitals.title')}</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenAdd}
        >
          {t('hospitals.addHospital')}
        </Button>
      </div>

      {/* ─── Search ──────────────────────────────── */}
      <div className={styles.searchSection}>
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('hospitals.searchPlaceholder')}
          size="large"
          value={search}
          onChange={handleSearchChange}
          allowClear
        />
      </div>

      {/* ─── Mobile Cards View ──────────────────── */}
      <div className={styles.mobileView}>
        {hospitals.length === 0 ? (
          <Empty
            className={styles.emptyState}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              debouncedSearch
                ? t('common.noResults')
                : t('hospitals.noHospitals')
            }
          >
            {!debouncedSearch && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenAdd}
              >
                {t('hospitals.addHospital')}
              </Button>
            )}
          </Empty>
        ) : (
          hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onEdit={() => handleOpenEdit(hospital)}
              onDelete={() => handleDelete(hospital.id)}
            />
          ))
        )}
      </div>

      {/* ─── Desktop List View ──────────────────── */}
      <div className={styles.desktopView}>
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <span className={styles.listColName}>{t('hospitals.hospitalName')}</span>
            <span className={styles.listColAddress}>{t('hospitals.address')}</span>
            <span className={styles.listColPhone}>{t('hospitals.phone')}</span>
            <span className={styles.listColDate}>{t('common.date')}</span>
            <span className={styles.listColActions}>{t('common.actions')}</span>
          </div>

          {hospitals.length === 0 ? (
            <Empty
              className={styles.emptyState}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                debouncedSearch
                  ? t('common.noResults')
                  : t('hospitals.noHospitals')
              }
            >
              {!debouncedSearch && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleOpenAdd}
                >
                  {t('hospitals.addHospital')}
                </Button>
              )}
            </Empty>
          ) : (
            hospitals.map((hospital) => (
              <HospitalRow
                key={hospital.id}
                hospital={hospital}
                onEdit={() => handleOpenEdit(hospital)}
                onDelete={() => handleDelete(hospital.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ─── Pagination ─────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className={styles.paginationSection}>
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
            showLessItems
          />
        </div>
      )}

      {/* ─── Add/Edit Modal ────────────────────── */}
      <Modal
        title={editingHospital ? t('hospitals.editHospital') : t('hospitals.addHospital')}
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        width={560}
        centered
      >
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Form.Item
            label={t('hospitals.name')}
            required
            validateStatus={errors.name ? 'error' : undefined}
            help={errors.name?.message ? t(errors.name.message) : undefined}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<BankOutlined />}
                  placeholder={t('hospitals.name')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={t('hospitals.nameAr')}
          >
            <Controller
              name="nameAr"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t('hospitals.nameAr')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={t('hospitals.address')}
          >
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<EnvironmentOutlined />}
                  placeholder={t('hospitals.address')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t('hospitals.city')}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t('hospitals.city')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t('hospitals.phone')}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<PhoneOutlined />}
                  placeholder={t('hospitals.phone')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t('hospitals.notes')}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder={t('hospitals.notes')}
                  rows={3}
                />
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCloseModal}>{t('common.cancel')}</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting || createMutation.isPending || updateMutation.isPending}
              >
                {t('common.save')}
              </Button>
            </Space>
          </Form.Item>
        </form>
      </Modal>
    </div>
  );
}
