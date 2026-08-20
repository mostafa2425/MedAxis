import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { CloseOutlined, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './PwaInstallPrompt.scss';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'medaxis:pwa-install-dismissed-until';
const DISMISS_DAYS = 30;

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function isMobile() {
  return window.matchMedia('(max-width: 767px)').matches &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function wasRecentlyDismissed() {
  const value = Number(localStorage.getItem(DISMISS_KEY) || 0);
  return value > Date.now();
}

export default function PwaInstallPrompt() {
  const { i18n } = useTranslation();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    if (!isMobile() || isStandalone() || wasRecentlyDismissed()) return;

    const showIosPrompt = isIos() && isSafari();
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (showIosPrompt) {
      const timer = window.setTimeout(() => setVisible(true), 1200);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000));
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) return;
    setInstalling(true);
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === 'accepted') setVisible(false);
      setInstallEvent(null);
    } finally {
      setInstalling(false);
    }
  };

  if (!visible) return null;

  const iosInstructions = isArabic
    ? 'اضغط مشاركة في المتصفح ثم اختر «إضافة إلى الشاشة الرئيسية».'
    : 'Tap Share in your browser, then choose “Add to Home Screen”.';

  return (
    <aside className="pwa-install-prompt" role="dialog" aria-label={isArabic ? 'تثبيت MedAxis' : 'Install MedAxis'}>
      <div className="pwa-install-prompt__icon"><DownloadOutlined /></div>
      <div className="pwa-install-prompt__content">
        <strong>{isArabic ? 'نزّل MedAxis على موبايلك' : 'Install MedAxis on your phone'}</strong>
        <span>
          {installEvent
            ? (isArabic ? 'افتح MedAxis كتطبيق أسرع وأسهل، واستقبل الإشعارات المهمة.' : 'Open MedAxis like an app and receive important notifications.')
            : iosInstructions}
        </span>
      </div>
      <div className="pwa-install-prompt__actions">
        {installEvent ? (
          <Button type="primary" size="small" loading={installing} icon={<DownloadOutlined />} onClick={() => void install()}>
            {isArabic ? 'تثبيت' : 'Install'}
          </Button>
        ) : (
          <span className="pwa-install-prompt__share"><ShareAltOutlined /> {isArabic ? 'مشاركة' : 'Share'}</span>
        )}
        <Button type="text" size="small" aria-label={isArabic ? 'إغلاق' : 'Close'} icon={<CloseOutlined />} onClick={dismiss} />
      </div>
    </aside>
  );
}
