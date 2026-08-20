import posthog from 'posthog-js';

const apiKey = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let initialized = false;

export function initAnalytics() {
  if (!apiKey || initialized) return;

  posthog.init(apiKey, {
    api_host: apiHost,
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: false,
    persistence: 'localStorage',
  });

  initialized = true;
}

export function trackEvent(
  event: string,
  properties?: Record<string, unknown>,
) {
  if (!initialized) return;
  posthog.capture(event, properties);
}

export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.identify(userId, properties);
}

export function resetAnalytics() {
  if (!initialized) return;
  posthog.reset();
}

export const analyticsEvents = {
  userLoggedIn: 'user_logged_in',
  operationCreated: 'operation_created',
  operationUpdated: 'operation_updated',
  operationCompleted: 'operation_completed',
  patientCreated: 'patient_created',
  fileUploaded: 'file_uploaded',
  specialtySelected: 'specialty_selected',
  searchUsed: 'search_used',
} as const;
