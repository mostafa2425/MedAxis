import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, MedicineBoxOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import styles from './RegisterPage.module.scss';

const { Text } = Typography;

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const schema = z
    .object({
      fullName: z
        .string()
        .min(1, t('validation.required'))
        .min(3, t('validation.minLength', { min: 3 }))
        .max(100, t('validation.maxLength', { max: 100 })),
      email: z
        .string()
        .min(1, t('validation.required'))
        .email(t('validation.invalidEmail')),
      password: z
        .string()
        .min(1, t('validation.required'))
        .min(8, t('validation.minLength', { min: 8 })),
      confirmPassword: z.string().min(1, t('validation.required')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    });

  type RegisterFormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const res = await authService.register({
        name: values.fullName,
        email: values.email,
        password: values.password,
      });
      login(res.data.data.token, res.data.data.user);
      message.success(t('auth.registerSuccess'));
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      message.error(error.response?.data?.message || t('auth.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* ─── Logo & Header ──────────────────────── */}
        <div className={styles.cardHeader}>
          <div className={styles.logoWrap}>
            <div className={styles.logoIcon}>
              <MedicineBoxOutlined />
            </div>
          </div>
          <h1 className={styles.title}>{t('auth.register')}</h1>
          <Text className={styles.subtitle} type="secondary">
            {t('auth.registerDescription')}
          </Text>
        </div>

        {/* ─── Form ───────────────────────────────── */}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Full Name */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-name">
              {t('auth.fullName')}
            </label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  id="register-name"
                  size="large"
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder={t('auth.fullName')}
                  status={errors.fullName ? 'error' : undefined}
                  {...field}
                />
              )}
            />
            {errors.fullName && (
              <span className={styles.error}>{errors.fullName.message}</span>
            )}
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-email">
              {t('auth.email')}
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="register-email"
                  size="large"
                  prefix={<MailOutlined className={styles.inputIcon} />}
                  placeholder={t('auth.email')}
                  status={errors.email ? 'error' : undefined}
                  {...field}
                />
              )}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-password">
              {t('auth.password')}
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  id="register-password"
                  size="large"
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder={t('auth.password')}
                  status={errors.password ? 'error' : undefined}
                  {...field}
                />
              )}
            />
            {errors.password && (
              <span className={styles.error}>{errors.password.message}</span>
            )}
            <span className={styles.hint}>{t('auth.passwordRequirements')}</span>
          </div>

          {/* Confirm Password */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-confirm">
              {t('auth.confirmPassword')}
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input.Password
                  id="register-confirm"
                  size="large"
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder={t('auth.confirmPassword')}
                  status={errors.confirmPassword ? 'error' : undefined}
                  {...field}
                />
              )}
            />
            {errors.confirmPassword && (
              <span className={styles.error}>{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Terms */}
          <p className={styles.terms}>{t('auth.termsAgreement')}</p>

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            className={styles.submitBtn}
          >
            {t('auth.registerButton')}
          </Button>
        </form>

        {/* ─── Footer Link ─────────────────────────── */}
        <div className={styles.footer}>
          <Text type="secondary">{t('auth.hasAccount')}</Text>
          <Link to="/login" className={styles.footerLink}>
            {t('auth.signIn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
