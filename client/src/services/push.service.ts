import api from './api';

interface PushPublicKeyResponse { data?: { publicKey?: string } }
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
function isSupported(): boolean { return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window; }
async function getPublicKey(): Promise<string> {
  const response = await api.get<PushPublicKeyResponse>('/push/public-key');
  const publicKey = response.data?.data?.publicKey;
  if (!publicKey) throw new Error('Push notifications are not configured');
  return publicKey;
}
async function subscribe(): Promise<PushSubscription> {
  if (!isSupported()) throw new Error('Push notifications are not supported by this browser');
  const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notification permission was not granted');
  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  if (existing) { await api.post('/push/subscribe', { subscription: existing.toJSON() }); return existing; }
  const publicKey = await getPublicKey();
  const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
  await api.post('/push/subscribe', { subscription: subscription.toJSON() });
  return subscription;
}
async function unsubscribe(): Promise<void> {
  if (!isSupported()) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;
  await api.post('/push/unsubscribe', { endpoint: subscription.endpoint });
  await subscription.unsubscribe();
}
async function syncExistingPermission(): Promise<void> {
  if (!isSupported() || Notification.permission !== 'granted') return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) await api.post('/push/subscribe', { subscription: subscription.toJSON() });
}
async function sendTestNotification() { return api.post('/push/test'); }
export const pushService = { isSupported, getPublicKey, subscribe, unsubscribe, syncExistingPermission, sendTestNotification };
