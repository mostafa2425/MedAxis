import { useEffect } from 'react';
import { Modal, Form, Input, Button, Space, message, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { TagOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { specialtyService } from '@/services/specialty.service';
import {
  parseApiValidationErrors,
  applyValidationErrorsToAntdForm,
} from '@/utils/apiValidationErrors';
import type { Specialty } from '@/types';
import './AddSpecialty.scss';

interface SpecialtyFormValues {
  name: string;
  nameAr?: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface AddSpecialtyProps {
  open: boolean;
  specialty: Specialty | null;
  onClose: () => void;
}

export default function AddSpecialty({ open, specialty, onClose }: AddSpecialtyProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<SpecialtyFormValues>();
  const isEdit = Boolean(specialty);

  useEffect(() => {
    if (!open) return;

    if (specialty) {
      form.setFieldsValue({
        name: specialty.name,
        nameAr: specialty.nameAr || undefined,
        description: specialty.description || undefined,
        icon: specialty.icon || undefined,
        color: specialty.color || undefined,
      });
    } else {
      form.resetFields();
    }
  }, [open, specialty, form]);

  const handleFormError = (error: unknown) => {
    const issues = parseApiValidationErrors(error);
    const applied = applyValidationErrorsToAntdForm(form, issues, t, {
      labelKeys: { name: 'specialties.name' },
    });
    messageApi.error(applied ? t('validation.fixHighlightedFields') : t('common.operationFailed'));
  };

  const createMutation = useMutation({
    mutationFn: specialtyService.create,
    onSuccess: () => {
      messageApi.success(t('specialties.specialtyCreated'));
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      onClose();
    },
    onError: handleFormError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SpecialtyFormValues> }) =>
      specialtyService.update(id, data),
    onSuccess: () => {
      messageApi.success(t('specialties.specialtyUpdated'));
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      onClose();
    },
    onError: handleFormError,
  });

  const onFinish = (values: SpecialtyFormValues) => {
    const payload = {
      name: values.name,
      nameAr: values.nameAr || undefined,
      description: values.description || undefined,
      icon: values.icon || undefined,
      color: values.color || undefined,
    };

    if (specialty) {
      updateMutation.mutate({ id: specialty.id, data: payload });
    } else {
      createMutation.mutate(payload as Parameters<typeof specialtyService.create>[0]);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={isEdit ? t('specialties.editSpecialty') : t('specialties.addSpecialty')}
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnClose
        width={560}
        centered
        className="addSpecialtyModal"
      >
        <Form
          form={form}
          layout="vertical"
          className="addSpecialtyForm"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={t('specialties.name')}
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Input
              prefix={<TagOutlined />}
              placeholder={t('specialties.name')}
              size="large"
            />
          </Form.Item>

          <Form.Item name="nameAr" label={t('specialties.nameAr')}>
            <Input placeholder={t('specialties.nameAr')} size="large" />
          </Form.Item>

          <Form.Item name="description" label={t('specialties.description')}>
            <Input.TextArea placeholder={t('specialties.description')} rows={3} />
          </Form.Item>

          <Form.Item name="icon" label={t('specialties.icon')}>
            <Input placeholder="e.g. bone, heart, stethoscope" size="large" />
          </Form.Item>

          <Form.Item
            name="color"
            label={t('specialties.color')}
            getValueFromEvent={(color: Color | string) =>
              typeof color === 'string' ? color : color.toHexString()
            }
          >
            <ColorPicker showText format="hex" />
          </Form.Item>

          <Form.Item className="addSpecialtyFormActions">
            <Space>
              <Button onClick={onClose}>{t('common.cancel')}</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {t('common.save')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
