import { test, expect, request as playwrightRequest, APIRequestContext } from '@playwright/test';

const apiBaseUrl = process.env.E2E_API_BASE_URL;
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
function requireEnv() {
  test.skip(!apiBaseUrl || !email || !password, 'Set E2E_API_BASE_URL, E2E_EMAIL and E2E_PASSWORD.');
}

async function firstData(api: APIRequestContext, path: string, token: string) {
  const response = await api.get(path, { headers: { Authorization: `Bearer ${token}` } });
  expect(response.ok(), await response.text()).toBeTruthy();
  const body = await response.json();
  expect(body.success).toBeTruthy();
  const data = body.data?.data ?? body.data;
  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);
  return data[0];
}

async function login(api: APIRequestContext) {
  const response = await api.post('/api/auth/login', { data: { email, password } });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.success).toBeTruthy();
  expect(body.data?.token).toBeTruthy();
  return body.data.token as string;
}

test.describe('Operations business-flow E2E', () => {
  test('create operation with medical team and cost, then verify persistence', async () => {
    requireEnv();

    const api = await playwrightRequest.newContext({ baseURL: apiBaseUrl });
    const token = await login(api);
    const headers = { Authorization: `Bearer ${token}` };
    const meResponse = await api.get('/api/auth/me', { headers });
    expect(meResponse.ok()).toBeTruthy();
    const meBody = await meResponse.json();
    const doctorId = meBody.data?.doctorId;
    expect(doctorId).toBeTruthy();

    const patient = await firstData(api, '/api/patients?limit=1', token);
    const hospital = await firstData(api, '/api/hospitals?limit=1', token);
    const catalog = await firstData(api, '/api/operation-catalog?limit=1', token);

    const patientId = patient.id as string;
    const hospitalId = hospital.id as string;
    const operationCatalogId = catalog.id as string;

    const createResponse = await api.post('/api/operations', {
      headers,
      data: {
        operationIds: [operationCatalogId],
        operationId: operationCatalogId,
        diagnosis: 'E2E operation test',
        patientId,
        hospitalId,
        operationDate: '2030-01-15',
        operationTime: '10:30',
        status: 'SCHEDULED',
        medicalTeam: {
          doctorIds: [doctorId],
          nurseIds: [],
          primarySurgeonId: doctorId,
        },
        cost: {
          totalCost: 6000,
          paidAmount: 6000,
          paymentMethod: 'CASH',
          paymentStatus: 'PAID',
        },
      },
    });

    expect(createResponse.status(), await createResponse.text()).toBe(201);
    const createdBody = await createResponse.json();
    expect(createdBody.success).toBeTruthy();
    const operation = createdBody.data;
    expect(operation.id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(operation.patientId).toBe(patientId);
    expect(operation.hospitalId).toBe(hospitalId);
    expect(operation.status).toBe('SCHEDULED');
    expect(operation.cost?.totalCost).toBe(6000);
    expect(operation.teamMembers?.some((m: { doctorId?: string }) => m.doctorId === doctorId)).toBeTruthy();

    const getResponse = await api.get(`/api/operations/${operation.id}`, { headers });
    expect(getResponse.ok()).toBeTruthy();
    const getBody = await getResponse.json();
    expect(getBody.success).toBeTruthy();
    expect(getBody.data.id).toBe(operation.id);
    expect(getBody.data.procedures?.length).toBeGreaterThan(0);

    const timelineResponse = await api.get(`/api/operations/${operation.id}/timeline`, { headers });
    expect(timelineResponse.ok()).toBeTruthy();
    const timelineBody = await timelineResponse.json();
    expect(timelineBody.success).toBeTruthy();
    expect(timelineBody.data.some((entry: { action: string }) => entry.action === 'OPERATION_CREATED')).toBeTruthy();

    const statusResponse = await api.patch(`/api/operations/${operation.id}/status`, {
      headers,
      data: { status: 'COMPLETED' },
    });
    expect(statusResponse.ok(), await statusResponse.text()).toBeTruthy();

    const deleteResponse = await api.delete(`/api/operations/${operation.id}`, { headers });
    expect(deleteResponse.ok(), await deleteResponse.text()).toBeTruthy();

    await api.dispose();
  });

  test('rejects invalid operation payload before creating a record', async () => {
    requireEnv();

    const api = await playwrightRequest.newContext({ baseURL: apiBaseUrl });
    const token = await login(api);

    const response = await api.post('/api/operations', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        operationIds: ['not-a-uuid'],
        patientId,
        hospitalId,
        operationDate: '2030-01-15',
        operationTime: '10:30',
        status: 'SCHEDULED',
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
    await api.dispose();
  });
});
