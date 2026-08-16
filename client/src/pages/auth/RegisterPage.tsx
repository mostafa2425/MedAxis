import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, MedicineBoxOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth.service';
import { specialtyService } from '@/services/specialty.service';
import { useAuth } from '@/hooks/useAuth';
import {
  parseApiValidationErrors,
  applyValidationErrorsToAntdForm,
} from '@/utils/apiValidationErrors';
import SpecialtyFields from '@/components/SpecialtyFields/SpecialtyFields';
import type { Specialty } from '@/types';
import './RegisterPage.scss';

const { Text } = Typography;

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  specialtyIds: string[];
  subspecialtyIds?: string[];
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm<RegisterFormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: specialtiesData, isLoading: specialtiesLoading } = useQuery({
    queryKey: ['specialties-public'],
    queryFn: () => specialtyService.getAll({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const specialties: Specialty[] = Array.isArray(specialtiesData?.data?.data)
    ? specialtiesData.data.data
    : [];

  const onFinish = async (values: RegisterFormValues) => {
    try {
      const res = await authService.register({
        name: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        specialtyIds: values.specialtyIds,
        subspecialtyIds: values.subspecialtyIds ?? [],
      });
      login(res.data.data.token, res.data.data.user);
      messageApi.success(t('auth.registerSuccess'));
      navigate('/calendar', { replace: true });
    } catch (err: unknown) {
      const issues = parseApiValidationErrors(err);
      const applied = applyValidationErrorsToAntdForm(form, issues, t, {
        aliases: { name: 'fullName' },
        labelKeys: {
          specialtyIds: 'auth.specialties',
          subspecialtyIds: 'auth.areasOfExpertise',
          fullName: 'auth.fullName',
          email: 'auth.email',
          password: 'auth.password',
        },
      });
      messageApi.error(applied ? t('validation.fixHighlightedFields') : t('auth.registerFailed'));
    }
  };

  return (
    <div className="register-page page">
      {contextHolder}
      <div className="card">
        <div className="cardHeader">
          <div className="logoWrap">
            <div className="logoIcon">
              <MedicineBoxOutlined />
            </div>
          </div>
          <h1 className="title">{t('auth.register')}</h1>
          <Text className="subtitle" type="secondary">
            {t('auth.registerDescription')}
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          className="form"
          onFinish={onFinish}
          requiredMark
        >
          <Form.Item
            name="fullName"
            label={t('auth.fullName')}
            rules={[
              { required: true, message: t('validation.required') },
              { min: 3, message: t('validation.minLength', { min: 3 }) },
              { max: 100, message: t('validation.maxLength', { max: 100 }) },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="inputIcon" />}
              placeholder={t('auth.fullName')}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('auth.email')}
            rules={[
              { required: true, message: t('validation.required') },
              { type: 'email', message: t('validation.invalidEmail') },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="inputIcon" />}
              placeholder={t('auth.email')}
              inputMode="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('auth.password')}
            extra={t('auth.passwordRequirements')}
            rules={[
              { required: true, message: t('validation.required') },
              { min: 8, message: t('validation.minLength', { min: 8 }) },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="inputIcon" />}
              placeholder={t('auth.password')}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={t('auth.confirmPassword')}
            dependencies={['password']}
            rules={[
              { required: true, message: t('validation.required') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('validation.passwordMismatch')));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="inputIcon" />}
              placeholder={t('auth.confirmPassword')}
            />
          </Form.Item>

          <div className="sectionHeading">{t('auth.professionalInformation')}</div>

          <SpecialtyFields specialties={specialties} loading={specialtiesLoading} />

          <p className="terms">{t('auth.termsAgreement')}</p>

          <Form.Item className="submitItem">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="submitBtn"
            >
              {t('auth.registerButton')}
            </Button>
          </Form.Item>
        </Form>

        <div className="footer">
          <Text type="secondary">{t('auth.hasAccount')}</Text>
          <Link to="/login" className="footerLink">
            {t('auth.signIn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
