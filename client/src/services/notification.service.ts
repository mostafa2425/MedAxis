import api from './api';

export interface SmartNotification {
  id: string;
  kind: 'DAILY_BRIEF' | 'WEEKLY_BRIEF' | string;
  title: string;
  message: string;
  priority: 'normal' | 'important' | string;
  scheduled_for: string;
  read_at: string | null;
  created_at: string;
}

function base64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(normalized);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

export const notificationService = {
  async list(limit = 20) {
    const response = await api.get<{ data: SmartNotification[] }>('/assistant/notifications', { params: { limit } });
    return response.data.data;
  },
  async markRead(id: string) {
    await api.patch(`/assistant/notifications/${id}/read`);
  },
  async enablePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      throw new Error('Push notifications are not supported by this browser');
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new Error('Notification permission was not granted');

    const registration = await navigator.serviceWorker.ready;
    const keyResponse = await api.get<{ data: { publicKey: string | null } }>('/push/public-key');
    const publicKey = keyResponse.data.data.publicKey;
    if (!publicKey) throw new Error('Push notifications are not configured on the server');

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(publicKey),
      });
    }

    await api.post('/push/subscribe', { subscription: subscription.toJSON() });
    return subscription;
  },
  async disablePush() {
    if (!('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;
    await api.post('/push/unsubscribe', { endpoint: subscription.endpoint });
    await subscription.unsubscribe();
  },
};
