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
  Switch,
  message,
  Popconfirm,
  Space,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { specialtyService } from '@/services/specialty.service';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/helpers';
import { DEFAULT_PAGINATION } from '@/utils/constants';
import type { Specialty } from '@/types';
import styles from './SpecialtiesPage.module.scss';

// ─── Zod Schema ──────────────────────────────────
const specialtyFormSchema = z.object({
  name: z.string().min(1, 'validation.required'),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

type SpecialtyFormValues = z.infer<typeof specialtyFormSchema>;

// ─── Color Palette for Icons ─────────────────────
const PRESET_COLORS = [
  '#2563EB', '#7C3AED', '#EC4899', '#F97316', '#F59E0B',
  '#16A34A', '#14B8A6', '#0EA5E9', '#6366F1', '#DC2626',
];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getSpecialtyColor(index: number, specialtyColor?: string | null): string {
  return specialtyColor || PRESET_COLORS[index % PRESET_COLORS.length];
}

// ─── Skeleton Card ──────────────────────────────
function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonTop}>
        <Skeleton.Avatar active size={48} shape="square" style={{ borderRadius: 12 }} />
        <div className={styles.cardActions}>
          <Skeleton.Avatar active size={28} shape="square" />
          <Skeleton.Avatar active size={28} shape="square" />
        </div>
      </div>
      <div className={styles.skeletonBody}>
        <Skeleton.Input active size="small" style={{ width: '70%', height: 18 }} />
        <Skeleton.Input active size="small" style={{ width: '50%', height: 14 }} />
      </div>
      <div className={styles.skeletonFooter}>
        <Skeleton.Input active size="small" style={{ width: 90, height: 14 }} />
      </div>
    </div>
  );
}

// ─── Specialty Card ─────────────────────────────
function SpecialtyCard({
  specialty,
  index,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  specialty: Specialty;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}) {
  const { t } = useTranslation();
  const color = getSpecialtyColor(index, specialty.color);
  const isActive = (specialty as any).isActive !== false;

  return (
    <div className={styles.specialtyCard}>
      <div className={styles.cardTop}>
        <div
          className={`${styles.cardIcon} ${specialty.color ? styles['cardIcon--colored'] : ''}`}
          style={{
            backgroundColor: hexToRgba(color, 0.1),
            color: specialty.color || color,
          }}
        >
          <TagOutlined />
        </div>
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

      <div className={styles.cardBody}>
        <span className={styles.specialtyName}>{specialty.name}</span>
        {specialty.nameAr && (
          <span className={styles.specialtyNameAr}>{specialty.nameAr}</span>
        )}
        <div className={styles.cardMeta}>
          <span className={styles.metaItem}>
            <TeamOutlined />
            {t('specialties.totalDoctors')}: {specialty._count?.doctors ?? 0}
          </span>
          <span className={styles.metaItem}>
            <UserOutlined />
            {t('specialties.totalOperations')}: {specialty._count?.operations ?? 0}
          </span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.cardDate}>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {formatDate(specialty.createdAt)}
        </span>
        <div className={styles.toggleWrapper}>
          <span className={styles.toggleLabel}>
            {isActive ? t('common.active') : t('common.inactive')}
          </span>
          <Switch
            size="small"
            checked={isActive}
            onChange={onToggleActive}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Specialties List Page
// ═══════════════════════════════════════════════════════
export default function SpecialtiesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  // ─── Query ───────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ['specialties', page, debouncedSearch],
    queryFn: () =>
      specialtyService.getAll({
        page,
        limit: 24,
        search: debouncedSearch || undefined,
      }),
  });

  const specialties: Specialty[] = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  // ─── Mutations ────────────────────────────────
  const createMutation = useMutation({
    mutationFn: specialtyService.create,
    onSuccess: () => {
      messageApi.success(t('specialties.specialtyCreated'));
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      handleCloseModal();
    },
    onError: () => {
      messageApi.error(t('common.operationFailed'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SpecialtyFormValues> }) =>
      specialtyService.update(id, data),
    onSuccess: () => {
      messageApi.success(t('specialties.specialtyUpdated'));
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      handleCloseModal();
    },
    onError: () => {
      messageApi.error(t('common.operationFailed'));
    },
  });

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

  // ─── Form ─────────────────────────────────────
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SpecialtyFormValues>({
    resolver: zodResolver(specialtyFormSchema),
    defaultValues: {
      name: '',
      nameAr: '',
      description: '',
      icon: '',
      color: '',
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
    setEditingSpecialty(null);
    reset({
      name: '',
      nameAr: '',
      description: '',
      icon: '',
      color: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    reset({
      name: specialty.name,
      nameAr: specialty.nameAr || '',
      description: specialty.description || '',
      icon: specialty.icon || '',
      color: specialty.color || '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSpecialty(null);
    reset();
  };

  const onSubmit = (values: SpecialtyFormValues) => {
    const payload = {
      ...values,
      nameAr: values.nameAr || undefined,
      description: values.description || undefined,
      icon: values.icon || undefined,
      color: values.color || undefined,
    };

    if (editingSpecialty) {
      updateMutation.mutate({ id: editingSpecialty.id, data: payload });
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
            <h1 className={styles.pageTitle}>{t('specialties.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpenAdd}
            disabled
          >
            {t('specialties.addSpecialty')}
          </Button>
        </div>

        <div className={styles.searchSection}>
          <Input
            prefix={<SearchOutlined />}
            placeholder={t('specialties.searchPlaceholder')}
            size="large"
            disabled
          />
        </div>

        <div className={styles.gridContainer}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
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
            <h1 className={styles.pageTitle}>{t('specialties.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpenAdd}
          >
            {t('specialties.addSpecialty')}
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
          <h1 className={styles.pageTitle}>{t('specialties.title')}</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenAdd}
        >
          {t('specialties.addSpecialty')}
        </Button>
      </div>

      {/* ─── Search ──────────────────────────────── */}
      <div className={styles.searchSection}>
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('specialties.searchPlaceholder')}
          size="large"
          value={search}
          onChange={handleSearchChange}
          allowClear
        />
      </div>

      {/* ─── Grid View ──────────────────────────── */}
      <div className={styles.gridContainer}>
        {specialties.length === 0 ? (
          <Empty
            className={styles.emptyState}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              debouncedSearch
                ? t('common.noResults')
                : t('specialties.noSpecialties')
            }
          >
            {!debouncedSearch && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenAdd}
              >
                {t('specialties.addSpecialty')}
              </Button>
            )}
          </Empty>
        ) : (
          specialties.map((specialty, index) => (
            <SpecialtyCard
              key={specialty.id}
              specialty={specialty}
              index={index}
              onEdit={() => handleOpenEdit(specialty)}
              onDelete={() => handleDelete(specialty.id)}
              onToggleActive={() => {
                // Toggle active state (visual only since API doesn't have isActive on Specialty)
                messageApi.info(t('common.operationSuccess'));
              }}
            />
          ))
        )}
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
        title={editingSpecialty ? t('specialties.editSpecialty') : t('specialties.addSpecialty')}
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        width={560}
        centered
      >
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Form.Item
            label={t('specialties.name')}
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
                  prefix={<TagOutlined />}
                  placeholder={t('specialties.name')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t('specialties.nameAr')}>
            <Controller
              name="nameAr"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t('specialties.nameAr')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t('specialties.description')}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder={t('specialties.description')}
                  rows={3}
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t('specialties.icon')}>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. bone, heart, stethoscope"
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t('specialties.color')}>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => field.onChange(c)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: field.value === c ? '2px solid #0F172A' : '2px solid transparent',
                        backgroundColor: c,
                        cursor: 'pointer',
                        outline: 'none',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {field.value === c && (
                        <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>✓</span>
                      )}
                    </button>
                  ))}
                  <Input
                    {...field}
                    placeholder="#2563EB"
                    size="large"
                    style={{ flex: 1, minWidth: 120 }}
                    maxLength={7}
                  />
                </div>
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
