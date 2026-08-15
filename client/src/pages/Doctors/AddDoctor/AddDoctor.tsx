import { useEffect } from 'react';
import {
  Modal,
  Drawer,
  Form,
  Input,
  Button,
  Space,
  message,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { doctorService } from '@/services/doctor.service';
import { specialtyService } from '@/services/specialty.service';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  parseApiValidationErrors,
  applyValidationErrorsToAntdForm,
} from '@/utils/apiValidationErrors';
import SpecialtyFields from '@/components/SpecialtyFields/SpecialtyFields';
import type { CreateDoctorPayload, Doctor, Specialty } from '@/types';
import './AddDoctor.scss';

interface DoctorFormValues {
  name: string;
  phone?: string;
  email?: string;
  specialtyIds: string[];
  subspecialtyIds?: string[];
}

interface AddDoctorProps {
  open: boolean;
  doctor: Doctor | null;
  onClose: () => void;
}

export default function AddDoctor({ open, doctor, onClose }: AddDoctorProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<DoctorFormValues>();
  const isMobile = useIsMobile();
  const isEdit = Boolean(doctor);

  const { data: specialtiesData } = useQuery({
    queryKey: ['specialties-list'],
    queryFn: () => specialtyService.getAll({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const specialties: Specialty[] = specialtiesData?.data?.data ?? [];

  useEffect(() => {
    if (!open) return;

    if (doctor) {
      form.setFieldsValue({
        name: doctor.name,
        phone: doctor.phone || undefined,
        email: doctor.email || undefined,
        specialtyIds: (doctor.specialties ?? []).map((specialty) => specialty.id),
        subspecialtyIds: (doctor.subspecialties ?? []).map((specialty) => specialty.id),
      });
    } else {
      form.resetFields();
    }
  }, [open, doctor, form]);

  const handleFormError = (error: unknown) => {
    const issues = parseApiValidationErrors(error);
    const applied = applyValidationErrorsToAntdForm(form, issues, t, {
      labelKeys: {
        name: 'doctors.name',
        phone: 'doctors.phone',
        email: 'doctors.email',
        specialtyIds: 'doctors.specialties',
        subspecialtyIds: 'doctors.areasOfExpertise',
      },
    });
    messageApi.error(applied ? t('validation.fixHighlightedFields') : t('common.operationFailed'));
  };

  const createMutation = useMutation({
    mutationFn: doctorService.create,
    onSuccess: () => {
      messageApi.success(t('doctors.doctorCreated'));
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors-active'] });
      onClose();
    },
    onError: handleFormError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDoctorPayload> }) =>
      doctorService.update(id, data),
    onSuccess: () => {
      messageApi.success(t('doctors.doctorUpdated'));
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors-active'] });
      onClose();
    },
    onError: handleFormError,
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const onFinish = (values: DoctorFormValues) => {
    if (isSaving) return;

    const payload: CreateDoctorPayload = {
      name: values.name.trim(),
      phone: values.phone?.trim() || undefined,
      email: values.email?.trim() || undefined,
      specialtyIds: values.specialtyIds ?? [],
      subspecialtyIds: values.subspecialtyIds ?? [],
    };

    if (doctor) {
      updateMutation.mutate({ id: doctor.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      className="entityForm"
      onFinish={onFinish}
      requiredMark
    >
      <Form.Item
        name="name"
        label={t('doctors.name')}
        rules={[{ required: true, message: t('validation.required') }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder={t('doctors.name')}
          size="large"
          autoFocus={!isMobile}
        />
      </Form.Item>

      <Form.Item name="phone" label={t('doctors.phone')}>
        <Input
          prefix={<PhoneOutlined />}
          placeholder={t('doctors.phone')}
          size="large"
          inputMode="tel"
          allowClear
        />
      </Form.Item>

      <Form.Item
        name="email"
        label={t('doctors.email')}
        rules={[{ type: 'email', message: t('validation.invalidEmail') }]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder={t('doctors.email')}
          size="large"
          inputMode="email"
          allowClear
        />
      </Form.Item>

      <SpecialtyFields
        specialties={specialties}
        specialtyLabel={t('doctors.specialties')}
        specialtyPlaceholder={t('doctors.selectSpecialties')}
        subspecialtyLabel={t('doctors.areasOfExpertise')}
        subspecialtyPlaceholder={t('doctors.selectAreas')}
      />

      <Form.Item className="entityFormActions">
        <Space>
          <Button onClick={onClose} disabled={isSaving}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" htmlType="submit" loading={isSaving}>
            {isEdit ? t('common.save') : t('common.add')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const title = isEdit ? t('doctors.editDoctor') : t('doctors.addDoctor');

  return (
    <>
      {contextHolder}
      {isMobile ? (
        <Drawer
          title={title}
          open={open}
          onClose={onClose}
          destroyOnClose
          placement="bottom"
          height="92%"
          className="entityFormDrawer"
        >
          {formContent}
        </Drawer>
      ) : (
        <Modal
          title={title}
          open={open}
          onCancel={onClose}
          footer={null}
          destroyOnClose
          width={560}
          centered
          className="entityFormModal"
        >
          {formContent}
        </Modal>
      )}
    </>
  );
}
