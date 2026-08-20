import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockCapture = vi.fn();
const mockIdentify = vi.fn();
const mockReset = vi.fn();
const mockInit = vi.fn();

vi.mock('posthog-js', () => ({
  default: {
    init: mockInit,
    capture: mockCapture,
    identify: mockIdentify,
    reset: mockReset,
  },
}));

describe('PostHog analytics wrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not send events when analytics is not configured', async () => {
    const analytics = await import('./posthog');

    analytics.trackEvent('test_event');

    expect(mockCapture).not.toHaveBeenCalled();
  });

  it('exposes the supported MedAxis event names', async () => {
    const { analyticsEvents } = await import('./posthog');

    expect(analyticsEvents.operationCreated).toBe('operation_created');
    expect(analyticsEvents.fileUploaded).toBe('file_uploaded');
    expect(analyticsEvents.searchUsed).toBe('search_used');
  });
});
