import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Result, Spin, Typography, Input, message } from 'antd';
import { MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { authService } from '@/services/auth.service';
import './VerifyEmailPage.scss';

const { Text, Paragraph } = Typography;

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(token ? 'loading' : 'error');
  const [error, setError] = useState('This verification link is invalid or missing.');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!token) return;
    let active = true;
    authService.verifyEmail(token)
      .then(() => { if (active) setStatus('success'); })
      .catch((err: any) => {
        if (!active) return;
        setStatus('error');
        setError(err?.response?.data?.message || 'This verification link is invalid or has expired.');
      });
    return () => { active = false; };
  }, [token]);

  const title = useMemo(() => status === 'success' ? 'Email verified' : 'Verify your email', [status]);

  const resend = async () => {
    if (!email.trim()) {
      messageApi.warning('Enter the email you used to register.');
      return;
    }
    setSending(true);
    try {
      await authService.resendVerification(email.trim());
      messageApi.success('If the account exists and is not verified, a new email has been sent.');
    } catch (err: any) {
      messageApi.error(err?.response?.data?.message || 'Unable to send another verification email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="verify-email-page">
      {contextHolder}
      <div className="verify-email-card">
        <div className="verify-email-brand">MedAxis</div>
        {status === 'loading' && (
          <div className="verify-email-state">
            <Spin size="large" />
            <Typography.Title level={2}>Verifying your email...</Typography.Title>
            <Text type="secondary">Please wait a moment.</Text>
          </div>
        )}
        {status === 'success' && (
          <Result
            icon={<CheckCircleOutlined />}
            title="Email verified successfully"
            subTitle="Your MedAxis account is now active. You can sign in and start using the platform."
            extra={<Button type="primary" size="large" href="/login">Go to Login</Button>}
          />
        )}
        {status === 'error' && (
          <div className="verify-email-state">
            <div className="verify-email-icon"><MailOutlined /></div>
            <Typography.Title level={2}>{title}</Typography.Title>
            <Paragraph type="secondary">{error}</Paragraph>
            <div className="resend-box">
              <Text strong>Need a new verification email?</Text>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" type="email" size="large" />
              <Button type="primary" size="large" loading={sending} onClick={resend}>Resend verification email</Button>
            </div>
            <Link to="/login">Back to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
