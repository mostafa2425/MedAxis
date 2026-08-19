declare module 'web-push' {
  export interface PushSubscription {
    endpoint: string;
    expirationTime?: number | null;
    keys: Record<string, string>;
  }

  export interface SendResult {
    statusCode: number;
    headers: Record<string, string | string[] | undefined>;
    body: string;
  }

  export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
  export function sendNotification(subscription: PushSubscription, payload?: string | Buffer, options?: Record<string, unknown>): Promise<SendResult>;

  const webpush: {
    setVapidDetails: typeof setVapidDetails;
    sendNotification: typeof sendNotification;
  };

  export default webpush;
}
