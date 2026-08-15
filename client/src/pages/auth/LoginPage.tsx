import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, Checkbox, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import {
  parseApiValidationErrors,
  applyValidationErrorsToRHF,
} from '@/utils/apiValidationErrors';
import './LoginPage.scss';

const { Text, Link: AntLink } = Typography;

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    email: z
      .string()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail')),
    password: z.string().min(1, t('validation.required')),
    rememberMe: z.boolean().optional(),
  });

  type LoginFormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await authService.login({
        email: values.email,
        password: values.password,
      });
      login(res.data.data.token, res.data.data.user);
      message.success(t('auth.loginSuccess'));
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const issues = parseApiValidationErrors(err);
      if (applyValidationErrorsToRHF(setError, issues, t)) {
        message.error(t('validation.fixHighlightedFields'));
      } else {
        message.error(t('auth.loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page page">
      <div className="card">
        {/* ─── Logo & Header ──────────────────────── */}
        <div className="cardHeader">
          <div className="logoWrap">
            <div className="logoIcon">
              <MedicineBoxOutlined />
            </div>
          </div>
          <h1 className="title">{t('auth.welcomeBack')}</h1>
          <Text className="subtitle" type="secondary">
            {t('auth.loginDescription')}
          </Text>
        </div>

        {/* ─── Form ───────────────────────────────── */}
        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="field">
            <label className="label" htmlFor="login-email">
              {t('auth.email')}
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="login-email"
                  size="large"
                  prefix={<MailOutlined className="inputIcon" />}
                  placeholder={t('auth.email')}
                  status={errors.email ? 'error' : undefined}
                  {...field}
                />
              )}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="field">
            <label className="label" htmlFor="login-password">
              {t('auth.password')}
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  id="login-password"
                  size="large"
                  prefix={<LockOutlined className="inputIcon" />}
                  placeholder={t('auth.password')}
                  status={errors.password ? 'error' : undefined}
                  {...field}
                />
              )}
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="row">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                >
                  <span className="rememberText">{t('auth.rememberMe')}</span>
                </Checkbox>
              )}
            />
            <AntLink className="forgotLink">
              {t('auth.forgotPassword')}
            </AntLink>
          </div>

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            className="submitBtn"
          >
            {t('auth.loginButton')}
          </Button>
        </form>

        {/* ─── Footer Link ─────────────────────────── */}
        <div className="footer">
          <Text type="secondary">{t('auth.noAccount')}</Text>
          <Link to="/register" className="footerLink">
            {t('auth.signUp')}
          </Link>
        </div>
      </div>
    </div>
  );
}
