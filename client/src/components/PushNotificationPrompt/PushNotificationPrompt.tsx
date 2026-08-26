import { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { BellOutlined, CheckCircleOutlined, CloseOutlined, MobileOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { pushService } from '@/services/push.service';
import './PushNotificationPrompt.scss';

type PromptReason = 'enable' | 'ios-install' | 'unsupported' | 'denied';

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export default function PushNotificationPrompt() {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState<PromptReason>('enable');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      const iosNeedsInstall = isIos() && !isStandalone();
      const supported = pushService.isSupported();

      if (iosNeedsInstall) {
        if (!cancelled) {
          setReason('ios-install');
          setVisible(true);
        }
        return;
      }

      if (!supported) {
        if (!cancelled) {
          setReason('unsupported');
          setVisible(true);
        }
        return;
      }

      if (Notification.permission === 'denied') {
        if (!cancelled) {
          setReason('denied');
          setVisible(true);
        }
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (!cancelled && !subscription) {
          setReason('enable');
          setVisible(true);
        }
      } catch {
        if (!cancelled) {
          setReason('enable');
          setVisible(true);
        }
      }
    };

    void sync();
    return () => { cancelled = true; };
  }, []);

  const enable = async () => {
    setLoading(true);
    setError('');
    try {
      await pushService.subscribe();
      setVisible(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : (isArabic ? 'تعذر تفعيل الإشعارات.' : 'Could not enable notifications.'));
    } finally {
      setLoading(false);
    }
  };

  const title = isArabic ? 'فعّل إشعارات MedAxis' : 'Enable MedAxis notifications';
  const body =
    reason === 'ios-install'
      ? (isArabic
        ? 'على iPhone وiPad يجب إضافة MedAxis إلى الشاشة الرئيسية أولًا. افتح قائمة المشاركة ثم اختر "إضافة إلى الشاشة الرئيسية"، وبعدها افتح MedAxis من الأيقونة الجديدة.'
        : 'On iPhone and iPad, web push requires MedAxis to be added to the Home Screen first. Use Share → Add to Home Screen, then open MedAxis from the new icon.')
      : reason === 'unsupported'
        ? (isArabic
          ? 'الإشعارات الفورية غير مدعومة في هذا المتصفح. جرّب Chrome أو Edge على الكمبيوتر، أو استخدم MedAxis كتطبيق ويب مثبت على iPhone/iPad.'
          : 'Push notifications are not supported by this browser. Try Chrome or Edge on desktop, or use MedAxis as an installed Home Screen web app on iPhone/iPad.')
        : reason === 'denied'
          ? (isArabic
            ? 'تم رفض صلاحية الإشعارات من المتصفح. فعّل إشعارات MedAxis من إعدادات الموقع ثم أعد فتح النظام.'
            : 'Notification permission is blocked by the browser. Allow notifications for MedAxis in the site settings, then reopen the app.')
          : (isArabic
            ? 'فعّل الإشعارات لتصلك العمليات والمتابعات والتنبيهات المهمة في وقتها.'
            : 'Enable notifications to receive important operation, follow-up, and practice alerts in real time.');

  const canEnable = reason === 'enable' && pushService.isSupported() && Notification.permission !== 'denied';

  return (
    <Modal
      open={visible}
      centered
      width={460}
      title={null}
      closable={false}
      maskClosable={false}
      keyboard={false}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <div style={{ padding: '8px 4px 2px', textAlign: isArabic ? 'right' : 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, display: 'grid', placeItems: 'center', background: '#EFF6FF', color: '#2563EB', fontSize: 22 }}>
            {reason === 'ios-install' ? <MobileOutlined /> : reason === 'denied' ? <SettingOutlined /> : <BellOutlined />}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{title}</div>
            <div style={{ marginTop: 3, color: '#64748B', fontSize: 13 }}>
              {isArabic ? 'تنبيهات MedAxis' : 'MedAxis alerts'}
            </div>
          </div>
        </div>

        <div style={{ color: '#475569', lineHeight: 1.7, fontSize: 14 }}>{body}</div>

        {error && (
          <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: '#FEF2F2', color: '#B91C1C', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: isArabic ? 'flex-start' : 'flex-end', gap: 8, marginTop: 22 }}>
          <Button icon={<CloseOutlined />} onClick={() => setVisible(false)}>
            {isArabic ? 'لاحقًا' : 'Later'}
          </Button>
          {canEnable ? (
            <Button type="primary" icon={<BellOutlined />} loading={loading} onClick={() => void enable()}>
              {isArabic ? 'تفعيل الإشعارات' : 'Enable notifications'}
            </Button>
          ) : (
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => setVisible(false)}>
              {isArabic ? 'حسنًا' : 'Got it'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
