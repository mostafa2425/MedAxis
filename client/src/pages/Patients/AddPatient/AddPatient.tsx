import { useEffect } from 'react';
import {
  Modal,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Button,
  Space,
  Row,
  Col,
  message,
} from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useIsMobile';
import { patientService } from '@/services/patient.service';
import {
  parseApiValidationErrors,
  applyValidationErrorsToAntdForm,
} from '@/utils/apiValidationErrors';
import { Gender, type CreatePatientPayload, type Patient } from '@/types';
import './AddPatient.scss';

interface PatientFormValues {
  fullName: string;
  age: number;
  gender: Gender;
  mobile?: string;
  notes?: string;
}

interface AddPatientProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (patient: Patient) => void;
}

export default function AddPatient({ open, onClose, onCreated }: AddPatientProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<PatientFormValues>();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue({ gender: Gender.Male });
  }, [open, form]);

  const handleFormError = (error: unknown) => {
    const issues = parseApiValidationErrors(error);
    const applied = applyValidationErrorsToAntdForm(form, issues, t, {
      labelKeys: {
        fullName: 'patients.fullName',
        age: 'common.age',
        gender: 'patients.gender',
        mobile: 'patients.mobile',
      },
    });
    messageApi.error(applied ? t('validation.fixHighlightedFields') : t('common.operationFailed'));
  };

  const createMutation = useMutation({
    mutationFn: (values: PatientFormValues) => {
      const payload: CreatePatientPayload = {
        fullName: values.fullName.trim(),
        age: values.age,
        gender: values.gender,
        mobile: values.mobile?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
      };
      return patientService.create(payload);
    },
    onSuccess: (response) => {
      const created = response.data.data;
      messageApi.success(t('patients.patientCreated'));
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient-search'] });
      onClose();
      if (created) onCreated?.(created);
    },
    onError: handleFormError,
  });

  const isSaving = createMutation.isPending;

  const onFinish = (values: PatientFormValues) => {
    if (isSaving) return;
    createMutation.mutate(values);
  };

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      className="entityForm"
      onFinish={onFinish}
      requiredMark
      initialValues={{ gender: Gender.Male }}
    >
      <Form.Item
        name="fullName"
        label={t('patients.fullName')}
        rules={[{ required: true, message: t('validation.required') }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder={t('patients.fullName')}
          size="large"
          autoFocus={!isMobile}
        />
      </Form.Item>

      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="age"
            label={t('common.age')}
            rules={[
              { required: true, message: t('validation.required') },
              { type: 'number', min: 1, message: t('validation.mustBePositive') },
            ]}
          >
            <InputNumber
              className="entityFormFullWidth"
              size="large"
              min={1}
              max={150}
              placeholder={t('common.age')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="gender"
            label={t('patients.gender')}
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Radio.Group
              size="large"
              optionType="button"
              buttonStyle="solid"
              className="entityFormGenderRadio"
            >
              <Radio.Button value={Gender.Male}>{t('patients.male')}</Radio.Button>
              <Radio.Button value={Gender.Female}>{t('patients.female')}</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="mobile" label={t('patients.mobile')}>
        <Input
          prefix={<PhoneOutlined />}
          placeholder={t('patients.mobile')}
          size="large"
          inputMode="tel"
          allowClear
        />
      </Form.Item>

      <Form.Item name="notes" label={t('patients.notes')}>
        <Input.TextArea
          rows={3}
          placeholder={t('patients.notes')}
          allowClear
          maxLength={1000}
        />
      </Form.Item>

      <Form.Item className="entityFormActions">
        <Space>
          <Button onClick={onClose} disabled={isSaving}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" htmlType="submit" loading={isSaving}>
            {t('common.add')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const title = t('patients.addPatient');

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
