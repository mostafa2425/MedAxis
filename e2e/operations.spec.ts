import { test, expect, request as playwrightRequest, APIRequestContext } from '@playwright/test';

const apiBaseUrl = process.env.E2E_API_BASE_URL;
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
const patientId = process.env.E2E_PATIENT_ID;
const hospitalId = process.env.E2E_HOSPITAL_ID;
const operationCatalogId = process.env.E2E_OPERATION_CATALOG_ID;
const doctorId = process.env.E2E_DOCTOR_ID;

function requireEnv() {
  test.skip(
    !apiBaseUrl || !email || !password || !patientId || !hospitalId || !operationCatalogId || !doctorId,
    'Set E2E_API_BASE_URL, E2E_EMAIL, E2E_PASSWORD, E2E_PATIENT_ID, E2E_HOSPITAL_ID, E2E_OPERATION_CATALOG_ID and E2E_DOCTOR_ID.',
  );
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
