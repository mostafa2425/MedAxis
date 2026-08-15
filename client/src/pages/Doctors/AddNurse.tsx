import { useEffect } from 'react';
import { Modal, Drawer, Form, Input, Button, Space, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { nurseService, type CreateNursePayload } from '@/services/nurse.service';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  parseApiValidationErrors,
  applyValidationErrorsToAntdForm,
} from '@/utils/apiValidationErrors';
import type { Nurse } from '@/types';

interface NurseFormValues {
  name: string;
  phone?: string;
  email?: string;
}

interface AddNurseProps {
  open: boolean;
  nurse: Nurse | null;
  onClose: () => void;
}

export default function AddNurse({ open, nurse, onClose }: AddNurseProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<NurseFormValues>();
  const isMobile = useIsMobile();
  const isEdit = Boolean(nurse);

  useEffect(() => {
    if (!open) return;
    if (nurse) {
      form.setFieldsValue({
        name: nurse.name,
        phone: nurse.phone || undefined,
        email: nurse.email || undefined,
      });
    } else {
      form.resetFields();
    }
  }, [open, nurse, form]);

  const handleFormError = (error: unknown) => {
    const issues = parseApiValidationErrors(error);
    const applied = applyValidationErrorsToAntdForm(form, issues, t, {
      labelKeys: { name: 'nurses.name', phone: 'nurses.phone', email: 'nurses.email' },
    });
    messageApi.error(applied ? t('validation.fixHighlightedFields') : t('common.operationFailed'));
  };

  const createMutation = useMutation({
    mutationFn: nurseService.create,
    onSuccess: () => {
      messageApi.success(t('nurses.nurseCreated'));
      queryClient.invalidateQueries({ queryKey: ['nurses'] });
      queryClient.invalidateQueries({ queryKey: ['nurses-active'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: handleFormError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateNursePayload> }) =>
      nurseService.update(id, data),
    onSuccess: () => {
      messageApi.success(t('nurses.nurseUpdated'));
      queryClient.invalidateQueries({ queryKey: ['nurses'] });
      queryClient.invalidateQueries({ queryKey: ['nurses-active'] });
      onClose();
    },
    onError: handleFormError,
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const onFinish = (values: NurseFormValues) => {
    const payload: CreateNursePayload = {
      name: values.name.trim(),
      phone: values.phone?.trim() || undefined,
      email: values.email?.trim() || undefined,
    };
    if (nurse) updateMutation.mutate({ id: nurse.id, data: payload });
    else createMutation.mutate(payload);
  };

  const formContent = (
    <Form form={form} layout="vertical" className="entityForm" onFinish={onFinish} requiredMark>
      <Form.Item name="name" label={t('nurses.name')} rules={[{ required: true, message: t('validation.required') }]}>
        <Input prefix={<UserOutlined />} placeholder={t('nurses.name')} size="large" autoFocus={!isMobile} />
      </Form.Item>
      <Form.Item name="phone" label={t('nurses.phone')}>
        <Input prefix={<PhoneOutlined />} placeholder={t('nurses.phone')} size="large" inputMode="tel" allowClear />
      </Form.Item>
      <Form.Item name="email" label={t('nurses.email')} rules={[{ type: 'email', message: t('validation.invalidEmail') }]}>
        <Input prefix={<MailOutlined />} placeholder={t('nurses.email')} size="large" inputMode="email" allowClear />
      </Form.Item>
      <Form.Item className="entityFormActions">
        <Space>
          <Button onClick={onClose} disabled={isSaving}>{t('common.cancel')}</Button>
          <Button type="primary" htmlType="submit" loading={isSaving}>
            {isEdit ? t('common.save') : t('common.add')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const title = isEdit ? t('nurses.editNurse') : t('nurses.addNurse');

  return (
    <>
      {contextHolder}
      {isMobile ? (
        <Drawer title={title} open={open} onClose={onClose} destroyOnClose placement="bottom" height="92%">
          {formContent}
        </Drawer>
      ) : (
        <Modal title={title} open={open} onCancel={onClose} footer={null} destroyOnClose width={520} centered>
          {formContent}
        </Modal>
      )}
    </>
  );
}
