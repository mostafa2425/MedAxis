import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { pushService } from '@/services/push.service';
import './PushNotificationPrompt.scss';

const DISMISS_KEY = 'medaxis:push-prompt-dismissed-until';
const DISMISS_DAYS = 14;

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function wasRecentlyDismissed() {
  const value = Number(localStorage.getItem(DISMISS_KEY) || 0);
  return value > Date.now();
}

export default function PushNotificationPrompt() {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    // iOS Web Push is available to installed Home Screen web apps.
    if (isIos() && !isStandalone()) return;
    if (!pushService.isSupported() || Notification.permission === 'denied') return;

    const sync = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          if (Notification.permission === 'granted') await pushService.syncExistingPermission();
          return;
        }

        // A granted browser permission can survive after the PushSubscription
        // is removed (for example after clearing site data). This stale state
        // must show the enable action again.
        const permissionGrantedWithoutSubscription = Notification.permission === 'granted';
        if (!permissionGrantedWithoutSubscription && wasRecentlyDismissed()) return;

        window.setTimeout(() => setVisible(true), 900);
      } catch {
        // Keep the prompt silent when push is not configured yet.
      }
    };

    void sync();
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000));
    setVisible(false);
  };

  const enable = async () => {
    setLoading(true);
    setError(false);
    try {
      await pushService.subscribe();
      localStorage.removeItem(DISMISS_KEY);
      setVisible(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <aside className="push-notification-prompt" role="dialog" aria-label={isArabic ? 'تفعيل الإشعارات' : 'Enable notifications'}>
      <div className="push-notification-prompt__icon"><BellOutlined /></div>
      <div className="push-notification-prompt__content">
        <strong>{isArabic ? 'فعّل إشعارات MedAxis' : 'Turn on MedAxis notifications'}</strong>
        <span>
          {error
            ? (isArabic ? 'تعذر التفعيل الآن. تأكد من إعدادات الإشعارات وحاول مرة أخرى.' : 'Could not enable notifications. Check your browser settings and try again.')
            : (isArabic ? 'اعرف العمليات والمتابعات المهمة في وقتها بدون فتح النظام باستمرار.' : 'Get important operation and follow-up alerts without constantly opening the app.')}
        </span>
      </div>
      <div className="push-notification-prompt__actions">
        <Button type="primary" size="small" loading={loading} icon={<BellOutlined />} onClick={() => void enable()}>
          {isArabic ? 'تفعيل' : 'Enable'}
        </Button>
        <Button type="text" size="small" aria-label={isArabic ? 'لاحقًا' : 'Later'} icon={<CloseOutlined />} onClick={dismiss} />
      </div>
    </aside>
  );
}
