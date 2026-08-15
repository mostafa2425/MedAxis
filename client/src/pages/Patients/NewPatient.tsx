import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  notification,
  Spin,
  Row,
  Col,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { patientService } from '@/services/patient.service';
import {
  parseApiValidationErrors,
  applyValidationErrorsToAntdForm,
} from '@/utils/apiValidationErrors';
import { Gender, type CreatePatientPayload, type UpdatePatientPayload } from '@/types';
import './PatientForm.scss';

interface PatientFormValues {
  fullName: string;
  age: number;
  gender: Gender;
  mobile?: string;
  notes?: string;
}

export default function PatientFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<PatientFormValues>();

  const editId = searchParams.get('edit');
  const isEditMode = Boolean(editId);

  const { data: patientData, isLoading: isLoadingPatient } = useQuery({
    queryKey: ['patient', editId],
    queryFn: () => patientService.getById(editId!),
    enabled: isEditMode,
  });

  const existingPatient = patientData?.data?.data ?? null;

  useEffect(() => {
    if (existingPatient) {
      form.setFieldsValue({
        fullName: existingPatient.fullName ?? '',
        age: existingPatient.age,
        gender: existingPatient.gender ?? Gender.Male,
        mobile: existingPatient.mobile || undefined,
        notes: existingPatient.notes || undefined,
      });
    }
  }, [existingPatient, form]);

  const handleFormError = (error: unknown) => {
    const issues = parseApiValidationErrors(error);
    const applied = applyValidationErrorsToAntdForm(form, issues, t, {
      labelKeys: {
        fullName: 'patients.fullName',
        age: 'common.age',
      },
    });
    notification.error({
      message: t('common.error'),
      description: applied ? t('validation.fixHighlightedFields') : t('common.operationFailed'),
      placement: 'topRight',
    });
  };

  const createMutation = useMutation({
    mutationFn: (values: PatientFormValues) => {
      const payload: CreatePatientPayload = {
        fullName: values.fullName,
        age: values.age,
        gender: values.gender,
        mobile: values.mobile || undefined,
        notes: values.notes || undefined,
      };
      return patientService.create(payload);
    },
    onSuccess: (response) => {
      const newPatient = response.data.data;
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      notification.success({
        message: t('common.success'),
        description: t('patients.patientCreated'),
        placement: 'topRight',
      });
      navigate(newPatient?.id ? `/patients/${newPatient.id}` : '/patients');
    },
    onError: handleFormError,
  });

  const updateMutation = useMutation({
    mutationFn: (values: PatientFormValues) => {
      const payload: UpdatePatientPayload = {
        fullName: values.fullName,
        age: values.age,
        gender: values.gender,
        mobile: values.mobile || undefined,
        notes: values.notes || undefined,
      };
      return patientService.update(editId!, payload);
    },
    onSuccess: (response) => {
      const updatedPatient = response.data.data;
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', editId] });
      notification.success({
        message: t('common.success'),
        description: t('patients.patientUpdated'),
        placement: 'topRight',
      });
      navigate(updatedPatient?.id ? `/patients/${updatedPatient.id}` : '/patients');
    },
    onError: handleFormError,
  });

  const onFinish = (values: PatientFormValues) => {
    if (isEditMode) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isLoadingPatient) {
    return (
      <div className="loadingWrapper">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="patient-form-page page">
      <div className="pageHeader">
        <div className="headerLeft">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            type="text"
            className="backButton"
          >
            {t('common.back')}
          </Button>
          <h1 className="pageTitle">
            {isEditMode ? t('patients.editPatient') : t('patients.addPatient')}
          </h1>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        className="form"
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{ gender: Gender.Male }}
      >
        <div className="formCard">
          <div className="sectionLabel">{t('patients.patientInfo')}</div>

          <Form.Item
            name="fullName"
            label={t('patients.fullName')}
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Input size="large" placeholder={t('patients.fullName')} autoFocus />
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
                  size="large"
                  min={1}
                  max={150}
                  placeholder={t('common.age')}
                  style={{ width: '100%' }}
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
                  className="genderRadio"
                >
                  <Radio.Button value={Gender.Male}>{t('patients.male')}</Radio.Button>
                  <Radio.Button value={Gender.Female}>{t('patients.female')}</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="mobile" label={t('patients.mobile')}>
            <Input size="large" placeholder={t('patients.mobile')} inputMode="tel" allowClear />
          </Form.Item>

          <Form.Item name="notes" label={t('patients.notes')} className="formGroupSecondary">
            <Input.TextArea
              rows={3}
              placeholder={t('patients.notes')}
              allowClear
              maxLength={1000}
            />
          </Form.Item>
        </div>

        <div className="formActionsDesktop">
          <Button onClick={() => navigate(-1)} className="cancelBtn">
            {t('common.cancel')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSaving}
            className="submitBtn"
          >
            {t('common.save')}
          </Button>
        </div>

        <div className="formActionsMobile">
          <Button onClick={() => navigate(-1)} block className="cancelBtn">
            {t('common.cancel')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSaving}
            block
          >
            {t('common.save')}
          </Button>
        </div>
      </Form>
    </div>
  );
}
