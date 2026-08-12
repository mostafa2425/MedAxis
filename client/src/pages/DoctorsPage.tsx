import React, { useState } from 'react';
import {
  Button,
  Input,
  Avatar,
  Tag,
  Pagination,
  Skeleton,
  Empty,
  Tooltip,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Space,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { doctorService } from '@/services/doctor.service';
import { specialtyService } from '@/services/specialty.service';
import { useDebounce } from '@/hooks/useDebounce';
import { getInitials, formatDate } from '@/utils/helpers';
import { DEFAULT_PAGINATION } from '@/utils/constants';
import type { Doctor, Specialty } from '@/types';
import styles from './DoctorsPage.module.scss';

// ─── Zod Schema ──────────────────────────────────
const doctorFormSchema = z.object({
  name: z.string().min(1, 'validation.required'),
  mobile: z.string().min(1, 'validation.required'),
  email: z.string().email('validation.invalidEmail').or(z.literal('')).optional(),
  specialtyId: z.string().min(1, 'validation.required'),
  licenseNumber: z.string().optional(),
  notes: z.string().optional(),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

// ─── Avatar Color Palette ────────────────────────
const AVATAR_COLORS = [
  'rgba(37,99,235,0.1)',
  'rgba(22,163,74,0.1)',
  'rgba(124,58,237,0.1)',
  'rgba(249,115,22,0.1)',
  'rgba(14,165,233,0.1)',
  'rgba(236,72,153,0.1)',
  'rgba(20,184,166,0.1)',
  'rgba(245,158,11,0.1)',
];

const AVATAR_TEXT_COLORS = [
  '#2563EB',
  '#16A34A',
  '#7C3AED',
  '#F97316',
  '#0EA5E9',
  '#EC4899',
  '#14B8A6',
  '#F59E0B',
];

function getAvatarColor(index: number) {
  return {
    bg: AVATAR_COLORS[index % AVATAR_COLORS.length],
    text: AVATAR_TEXT_COLORS[index % AVATAR_TEXT_COLORS.length],
  };
}

// ─── Skeleton Card (Mobile) ──────────────────────
function SkeletonCard() {
  return (
    <div className={styles.doctorCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <Skeleton.Avatar active size={48} shape="circle" />
          <div className={styles.cardHeaderInfo}>
            <Skeleton.Input active size="small" style={{ width: 140, height: 18 }} />
            <Skeleton.Input active size="small" style={{ width: 100, height: 14, marginTop: 8 }} />
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <Skeleton.Input active size="small" style={{ width: 110, height: 14 }} />
          <Skeleton.Input active size="small" style={{ width: 130, height: 14 }} />
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
    <div className={styles.doctorRow}>
      <div className={styles.rowMain}>
        <Skeleton.Avatar active size={40} shape="circle" />
        <div className={styles.rowInfo}>
          <Skeleton.Input active size="small" style={{ width: 160, height: 18 }} />
          <Skeleton.Input active size="small" style={{ width: 100, height: 14, marginTop: 6 }} />
        </div>
      </div>
      <div className={styles.rowDetails}>
        <Skeleton.Input active size="small" style={{ width: 100, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 130, height: 14 }} />
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

// ─── Doctor Card (Mobile) ────────────────────────
function DoctorCard({
  doctor,
  index,
  onEdit,
  onDelete,
}: {
  doctor: Doctor;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const color = getAvatarColor(index);

  return (
    <div className={styles.doctorCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <Avatar
            size={48}
            className={styles.avatar}
            style={{ backgroundColor: color.bg, color: color.text }}
          >
            {getInitials(doctor.name)}
          </Avatar>
          <div className={styles.cardHeaderInfo}>
            <span className={styles.doctorName}>{doctor.name}</span>
            <div className={styles.cardHeaderMeta}>
              <span
                className={`${styles.activeBadge} ${doctor.isActive ? styles['activeBadge--active'] : styles['activeBadge--inactive']}`}
              >
                {doctor.isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                {doctor.isActive ? t('common.active') : t('common.inactive')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        {doctor.specialty && (
          <div className={styles.cardSpecialties}>
            <Tag
              className={styles.specialtyTag}
              style={{
                color: doctor.specialty.color || '#2563EB',
                background: doctor.specialty.color
                  ? `rgba(${parseInt(doctor.specialty.color.slice(1, 3), 16)},${parseInt(doctor.specialty.color.slice(3, 5), 16)},${parseInt(doctor.specialty.color.slice(5, 7), 16)},0.1)`
                  : 'rgba(37,99,235,0.1)',
                borderColor: doctor.specialty.color
                  ? `rgba(${parseInt(doctor.specialty.color.slice(1, 3), 16)},${parseInt(doctor.specialty.color.slice(3, 5), 16)},${parseInt(doctor.specialty.color.slice(5, 7), 16)},0.2)`
                  : 'rgba(37,99,235,0.2)',
              }}
            >
              {doctor.specialty.name}
            </Tag>
          </div>
        )}
        <div className={styles.cardMeta}>
          {doctor.mobile && (
            <span className={styles.metaItem}>
              <PhoneOutlined className={styles.metaIcon} />
              {doctor.mobile}
            </span>
          )}
          {doctor.email && (
            <span className={styles.metaItem}>
              <MailOutlined className={styles.metaIcon} />
              {doctor.email}
            </span>
          )}
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.metaItem}>
            <CalendarOutlined className={styles.metaIcon} />
            {formatDate(doctor.createdAt)}
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

// ─── Doctor Row (Desktop) ────────────────────────
function DoctorRow({
  doctor,
  index,
  onEdit,
  onDelete,
}: {
  doctor: Doctor;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const color = getAvatarColor(index);

  return (
    <div className={styles.doctorRow}>
      <div className={styles.rowMain}>
        <Avatar
          size={40}
          className={styles.avatar}
          style={{ backgroundColor: color.bg, color: color.text }}
        >
          {getInitials(doctor.name)}
        </Avatar>
        <div className={styles.rowInfo}>
          <span className={styles.doctorName}>{doctor.name}</span>
          <span
            className={`${styles.activeBadge} ${doctor.isActive ? styles['activeBadge--active'] : styles['activeBadge--inactive']}`}
          >
            {doctor.isActive ? <CheckCircleOutlined /> : <StopOutlined />}
            {doctor.isActive ? t('common.active') : t('common.inactive')}
          </span>
        </div>
      </div>
      <div className={styles.rowDetails}>
        {doctor.mobile && (
          <span className={styles.rowMetaItem}>
            <PhoneOutlined className={styles.metaIcon} />
            {doctor.mobile}
          </span>
        )}
        {doctor.email && (
          <span className={styles.rowMetaItem}>
            <MailOutlined className={styles.metaIcon} />
            {doctor.email}
          </span>
        )}
        <div className={styles.rowSpecialty}>
          {doctor.specialty ? (
            <Tag
              className={styles.specialtyTag}
              style={{
                color: doctor.specialty.color || '#2563EB',
                background: doctor.specialty.color
                  ? `rgba(${parseInt(doctor.specialty.color.slice(1, 3), 16)},${parseInt(doctor.specialty.color.slice(3, 5), 16)},${parseInt(doctor.specialty.color.slice(5, 7), 16)},0.1)`
                  : 'rgba(37,99,235,0.1)',
                borderColor: doctor.specialty.color
                  ? `rgba(${parseInt(doctor.specialty.color.slice(1, 3), 16)},${parseInt(doctor.specialty.color.slice(3, 5), 16)},${parseInt(doctor.specialty.color.slice(5, 7), 16)},0.2)`
                  : 'rgba(37,99,235,0.2)',
              }}
            >
              {doctor.specialty.name}
            </Tag>
          ) : (
            <span style={{ color: '#94A3B8', fontSize: 13 }}>—</span>
          )}
        </div>
        <span className={styles.rowMetaItem}>
          <CalendarOutlined className={styles.metaIcon} />
          {formatDate(doctor.createdAt)}
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
// Doctors List Page
// ═══════════════════════════════════════════════════════
export default function DoctorsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  // ─── Queries ──────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ['doctors', page, debouncedSearch],
    queryFn: () =>
      doctorService.getAll({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: debouncedSearch || undefined,
      }),
  });

  const { data: specialtiesData } = useQuery({
    queryKey: ['specialties-list'],
    queryFn: () => specialtyService.getAll({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const doctors: Doctor[] = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const specialties: Specialty[] = specialtiesData?.data?.data ?? [];

  // ─── Mutations ────────────────────────────────
  const createMutation = useMutation({
    mutationFn: doctorService.create,
    onSuccess: () => {
      messageApi.success(t('doctors.doctorCreated'));
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      handleCloseModal();
    },
    onError: () => {
      messageApi.error(t('common.operationFailed'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DoctorFormValues> }) =>
      doctorService.update(id, data),
    onSuccess: () => {
      messageApi.success(t('doctors.doctorUpdated'));
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      handleCloseModal();
    },
    onError: () => {
      messageApi.error(t('common.operationFailed'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: doctorService.delete,
    onSuccess: () => {
      messageApi.success(t('doctors.doctorDeleted'));
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
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
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      specialtyId: '',
      licenseNumber: '',
      notes: '',
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
    setEditingDoctor(null);
    reset({
      name: '',
      mobile: '',
      email: '',
      specialtyId: '',
      licenseNumber: '',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    reset({
      name: doctor.name,
      mobile: doctor.mobile,
      email: doctor.email || '',
      specialtyId: doctor.specialtyId,
      licenseNumber: doctor.licenseNumber || '',
      notes: doctor.notes || '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDoctor(null);
    reset();
  };

  const onSubmit = (values: DoctorFormValues) => {
    const payload = {
      ...values,
      email: values.email || undefined,
      licenseNumber: values.licenseNumber || undefined,
      notes: values.notes || undefined,
    };

    if (editingDoctor) {
      updateMutation.mutate({ id: editingDoctor.id, data: payload });
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
            <h1 className={styles.pageTitle}>{t('doctors.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpenAdd}
            disabled
          >
            {t('doctors.addDoctor')}
          </Button>
        </div>

        <div className={styles.searchSection}>
          <Input
            prefix={<SearchOutlined />}
            placeholder={t('doctors.searchPlaceholder')}
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
              <span className={styles.listColName}>{t('doctors.doctorName')}</span>
              <span className={styles.listColPhone}>{t('doctors.phone')}</span>
              <span className={styles.listColEmail}>{t('doctors.email')}</span>
              <span className={styles.listColSpecialty}>{t('doctors.specialty')}</span>
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
            <h1 className={styles.pageTitle}>{t('doctors.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpenAdd}
          >
            {t('doctors.addDoctor')}
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
          <h1 className={styles.pageTitle}>{t('doctors.title')}</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenAdd}
        >
          {t('doctors.addDoctor')}
        </Button>
      </div>

      {/* ─── Search ──────────────────────────────── */}
      <div className={styles.searchSection}>
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('doctors.searchPlaceholder')}
          size="large"
          value={search}
          onChange={handleSearchChange}
          allowClear
        />
      </div>

      {/* ─── Mobile Cards View ──────────────────── */}
      <div className={styles.mobileView}>
        {doctors.length === 0 ? (
          <Empty
            className={styles.emptyState}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              debouncedSearch
                ? t('common.noResults')
                : t('doctors.noDoctors')
            }
          >
            {!debouncedSearch && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenAdd}
              >
                {t('doctors.addDoctor')}
              </Button>
            )}
          </Empty>
        ) : (
          doctors.map((doctor, index) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              index={index}
              onEdit={() => handleOpenEdit(doctor)}
              onDelete={() => handleDelete(doctor.id)}
            />
          ))
        )}
      </div>

      {/* ─── Desktop List View ──────────────────── */}
      <div className={styles.desktopView}>
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <span className={styles.listColName}>{t('doctors.doctorName')}</span>
            <span className={styles.listColPhone}>{t('doctors.phone')}</span>
            <span className={styles.listColEmail}>{t('doctors.email')}</span>
            <span className={styles.listColSpecialty}>{t('doctors.specialty')}</span>
            <span className={styles.listColDate}>{t('common.date')}</span>
            <span className={styles.listColActions}>{t('common.actions')}</span>
          </div>

          {doctors.length === 0 ? (
            <Empty
              className={styles.emptyState}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                debouncedSearch
                  ? t('common.noResults')
                  : t('doctors.noDoctors')
              }
            >
              {!debouncedSearch && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleOpenAdd}
                >
                  {t('doctors.addDoctor')}
                </Button>
              )}
            </Empty>
          ) : (
            doctors.map((doctor, index) => (
              <DoctorRow
                key={doctor.id}
                doctor={doctor}
                index={index}
                onEdit={() => handleOpenEdit(doctor)}
                onDelete={() => handleDelete(doctor.id)}
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
        title={editingDoctor ? t('doctors.editDoctor') : t('doctors.addDoctor')}
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        width={560}
        centered
      >
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <Form.Item
            label={t('doctors.name')}
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
                  prefix={<UserOutlined />}
                  placeholder={t('doctors.name')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={t('doctors.mobile')}
            required
            validateStatus={errors.mobile ? 'error' : undefined}
            help={errors.mobile?.message ? t(errors.mobile.message) : undefined}
          >
            <Controller
              name="mobile"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<PhoneOutlined />}
                  placeholder={t('doctors.mobile')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={t('doctors.email')}
            validateStatus={errors.email ? 'error' : undefined}
            help={errors.email?.message ? t(errors.email.message) : undefined}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined />}
                  placeholder={t('doctors.email')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={t('doctors.specialty')}
            required
            validateStatus={errors.specialtyId ? 'error' : undefined}
            help={errors.specialtyId?.message ? t(errors.specialtyId.message) : undefined}
          >
            <Controller
              name="specialtyId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={t('doctors.selectSpecialty')}
                  size="large"
                  showSearch
                  optionFilterProp="label"
                  options={specialties.map((s) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                  notFoundContent={null}
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t('doctors.licenseNumber')}>
            <Controller
              name="licenseNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t('doctors.licenseNumber')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item label={t('doctors.notes')}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder={t('doctors.notes')}
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
