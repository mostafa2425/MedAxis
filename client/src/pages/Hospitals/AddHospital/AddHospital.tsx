import { useEffect } from 'react';
import { Modal, Form, Input, Button, Space, Row, Col, message } from 'antd';
import {
  BankOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { hospitalService } from '@/services/hospital.service';
import {
  parseApiValidationErrors,
  applyValidationErrorsToAntdForm,
} from '@/utils/apiValidationErrors';
import type { Hospital } from '@/types';
import './AddHospital.scss';

interface HospitalFormValues {
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  notes?: string;
  nameAr?: string;
}

interface AddHospitalProps {
  open: boolean;
  hospital: Hospital | null;
  onClose: () => void;
}

export default function AddHospital({ open, hospital, onClose }: AddHospitalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<HospitalFormValues>();
  const isEdit = Boolean(hospital);

  useEffect(() => {
    if (!open) return;

    if (hospital) {
      form.setFieldsValue({
        name: hospital.name,
        address: hospital.address || undefined,
        city: hospital.city || undefined,
        phone: hospital.phone || undefined,
        notes: hospital.notes || undefined,
        nameAr: hospital.nameAr || undefined,
      });
    } else {
      form.resetFields();
    }
  }, [open, hospital, form]);

  const handleFormError = (error: unknown) => {
    const issues = parseApiValidationErrors(error);
    const applied = applyValidationErrorsToAntdForm(form, issues, t, {
      labelKeys: { name: 'hospitals.name' },
    });
    messageApi.error(applied ? t('validation.fixHighlightedFields') : t('common.operationFailed'));
  };

  const createMutation = useMutation({
    mutationFn: hospitalService.create,
    onSuccess: () => {
      messageApi.success(t('hospitals.hospitalCreated'));
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      onClose();
    },
    onError: handleFormError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HospitalFormValues> }) =>
      hospitalService.update(id, data),
    onSuccess: () => {
      messageApi.success(t('hospitals.hospitalUpdated'));
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      onClose();
    },
    onError: handleFormError,
  });

  const onFinish = (values: HospitalFormValues) => {
    const payload = {
      name: values.name,
      address: values.address || undefined,
      city: values.city || undefined,
      phone: values.phone || undefined,
      notes: values.notes || undefined,
      nameAr: values.nameAr || undefined,
    };

    if (hospital) {
      updateMutation.mutate({ id: hospital.id, data: payload });
    } else {
      createMutation.mutate(payload as Parameters<typeof hospitalService.create>[0]);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={isEdit ? t('hospitals.editHospital') : t('hospitals.addHospital')}
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnClose
        width={560}
        centered
        className="addHospitalModal"
      >
        <Form
          form={form}
          layout="vertical"
          className="addHospitalForm"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={t('hospitals.name')}
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Input
              prefix={<BankOutlined />}
              placeholder={t('hospitals.name')}
              size="large"
            />
          </Form.Item>

          <Form.Item name="nameAr" label={t('hospitals.nameAr')}>
            <Input placeholder={t('hospitals.nameAr')} size="large" />
          </Form.Item>

          <Form.Item name="address" label={t('hospitals.address')}>
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder={t('hospitals.address')}
              size="large"
            />
          </Form.Item>

          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Form.Item name="city" label={t('hospitals.city')}>
                <Input placeholder={t('hospitals.city')} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label={t('hospitals.phone')}>
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder={t('hospitals.phone')}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label={t('hospitals.notes')}>
            <Input.TextArea placeholder={t('hospitals.notes')} rows={3} />
          </Form.Item>

          <Form.Item className="addHospitalFormActions">
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
