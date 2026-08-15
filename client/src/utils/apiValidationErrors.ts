import type { FormInstance } from 'antd';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export interface ParsedValidationError {
  field: string;
  path: (string | number)[];
  leaf: string;
  code: string;
  message: string;
}

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

const FIELD_ALIASES: Record<string, string> = {
  nurse: 'nurseId',
};

export const DEFAULT_FIELD_LABEL_KEYS: Record<string, string> = {
  operationId: 'validation.fields.operationId',
  name: 'validation.fields.name',
  patientId: 'validation.fields.patientId',
  hospitalId: 'validation.fields.hospitalId',
  specialtyId: 'validation.fields.specialtyId',
  specialtyIds: 'validation.fields.specialtyIds',
  subspecialtyIds: 'validation.fields.subspecialtyIds',
  file: 'validation.fields.file',
  fileType: 'validation.fields.fileType',
  operationDate: 'validation.fields.operationDate',
  operationTime: 'validation.fields.operationTime',
  operationRoom: 'validation.fields.operationRoom',
  duration: 'validation.fields.duration',
  diagnosis: 'validation.fields.diagnosis',
  status: 'validation.fields.status',
  notes: 'validation.fields.notes',
  paymentMethod: 'validation.fields.paymentMethod',
  paymentStatus: 'validation.fields.paymentStatus',
  paymentNotes: 'validation.fields.paymentNotes',
  totalCost: 'validation.fields.totalCost',
  paidAmount: 'validation.fields.paidAmount',
  remainingAmount: 'validation.fields.remainingAmount',
  primarySurgeonId: 'validation.fields.primarySurgeonId',
  assistantSurgeonId: 'validation.fields.assistantSurgeonId',
  anesthesiologistId: 'validation.fields.anesthesiologistId',
  assistantAnesthesiaId: 'validation.fields.assistantAnesthesiaId',
  nurseId: 'validation.fields.nurseId',
  nurse: 'validation.fields.nurseId',
  email: 'validation.fields.email',
  password: 'validation.fields.password',
  fullName: 'validation.fields.fullName',
  age: 'validation.fields.age',
  mobile: 'validation.fields.mobile',
  phone: 'validation.fields.phone',
};

const DATE_FIELDS = new Set(['operationDate', 'dateFrom', 'dateTo', 'dateOfBirth']);
const TIME_FIELDS = new Set(['operationTime']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractIssuesArray(error: unknown): unknown[] {
  if (Array.isArray(error)) return error;
  if (!isRecord(error)) return [];

  const axiosPayload = isRecord(error.response) ? error.response.data : undefined;
  if (isRecord(axiosPayload) && Array.isArray(axiosPayload.data)) {
    return axiosPayload.data;
  }

  if (Array.isArray(error.data)) return error.data;
  return [];
}

function toPath(value: unknown): (string | number)[] {
  if (Array.isArray(value)) {
    return value.filter(
      (segment): segment is string | number =>
        typeof segment === 'string' || typeof segment === 'number',
    );
  }
  if (typeof value === 'string' && value.length > 0) {
    return value.split('.').map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
  }
  return [];
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isRecord(error) && isRecord(error.response) && isRecord(error.response.data)) {
    const message = error.response.data.message;
    if (typeof message === 'string' && message.trim() && message !== 'Internal server error') {
      return message;
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function parseApiValidationErrors(error: unknown): ParsedValidationError[] {
  return extractIssuesArray(error).flatMap((item) => {
    if (!isRecord(item)) return [];

    const path = toPath(item.path ?? item.field);
    if (path.length === 0 && typeof item.field !== 'string') return [];

    const field =
      path.length > 0
        ? path.join('.')
        : String(item.field);
    const leaf = String(path[path.length - 1] ?? field.split('.').pop() ?? field);

    return [
      {
        field,
        path: path.length > 0 ? path : [field],
        leaf,
        code: typeof item.code === 'string' ? item.code : 'invalid_type',
        message: typeof item.message === 'string' ? item.message : '',
      },
    ];
  });
}

export function toFormFieldName(
  issue: ParsedValidationError,
  aliases: Record<string, string> = {},
): string {
  const leaf = issue.leaf;
  return aliases[issue.field] || aliases[leaf] || FIELD_ALIASES[leaf] || leaf;
}

export function getFieldLabel(
  t: TranslateFn,
  field: string,
  labelKeys: Record<string, string> = {},
): string {
  const leaf = field.split('.').pop() || field;
  const key =
    labelKeys[field] ||
    labelKeys[leaf] ||
    DEFAULT_FIELD_LABEL_KEYS[leaf] ||
    DEFAULT_FIELD_LABEL_KEYS[field];
  return key ? t(key) : leaf;
}

function isMissingValue(issue: ParsedValidationError): boolean {
  if (issue.code === 'too_small') {
    return /string|character/.test(issue.message.toLowerCase());
  }
  if (issue.code !== 'invalid_type') return false;
  return /undefined|null/.test(issue.message.toLowerCase());
}

export function getValidationMessage(
  t: TranslateFn,
  issue: ParsedValidationError,
  labelKeys: Record<string, string> = {},
): string {
  const label = getFieldLabel(t, toFormFieldName(issue), labelKeys);
  const leaf = issue.leaf;

  if (isMissingValue(issue)) {
    return t('validation.fieldRequired', { field: label });
  }
  if (DATE_FIELDS.has(leaf) || /date/.test(issue.message.toLowerCase())) {
    return t('validation.fieldInvalidDate', { field: label });
  }
  if (TIME_FIELDS.has(leaf) || /time/.test(issue.message.toLowerCase())) {
    return t('validation.fieldInvalidTime', { field: label });
  }
  if (issue.code === 'too_big' || issue.code === 'too_small') {
    return t('validation.fieldInvalidNumber', { field: label });
  }
  return t('validation.fieldInvalid', { field: label });
}

export function toFieldErrorMap(
  issues: ParsedValidationError[],
  t: TranslateFn,
  options?: {
    aliases?: Record<string, string>;
    labelKeys?: Record<string, string>;
  },
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const field = toFormFieldName(issue, options?.aliases);
    if (!fieldErrors[field]) {
      fieldErrors[field] = getValidationMessage(t, issue, options?.labelKeys);
    }
  }
  return fieldErrors;
}

export function applyValidationErrorsToAntdForm(
  form: FormInstance,
  issues: ParsedValidationError[],
  t: TranslateFn,
  options?: {
    aliases?: Record<string, string>;
    labelKeys?: Record<string, string>;
  },
): boolean {
  if (issues.length === 0) return false;

  form.setFields(
    issues.map((issue) => ({
      name: issue.path.length > 1 ? issue.path : toFormFieldName(issue, options?.aliases),
      errors: [getValidationMessage(t, issue, options?.labelKeys)],
    })),
  );

  const first = issues[0];
  const firstName = first.path.length > 1 ? first.path : toFormFieldName(first, options?.aliases);
  form.scrollToField(firstName);
  return true;
}

export function applyValidationErrorsToRHF<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  issues: ParsedValidationError[],
  t: TranslateFn,
  options?: {
    aliases?: Record<string, string>;
    labelKeys?: Record<string, string>;
  },
): boolean {
  if (issues.length === 0) return false;

  for (const issue of issues) {
    const field = toFormFieldName(issue, options?.aliases) as Path<TFieldValues>;
    setError(field, {
      type: 'server',
      message: getValidationMessage(t, issue, options?.labelKeys),
    });
  }
  return true;
}

export function notifyValidationFailure(
  error: unknown,
  t: TranslateFn,
  notify: (message: string) => void,
): ParsedValidationError[] {
  const issues = parseApiValidationErrors(error);
  notify(
    issues.length > 0 ? t('validation.fixHighlightedFields') : t('common.operationFailed'),
  );
  return issues;
}

export function scrollToField(field: string): void {
  const selector = `[data-field="${CSS.escape(field)}"]`;
  const el = document.querySelector(selector);
  if (!(el instanceof HTMLElement)) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const focusable = el.querySelector<HTMLElement>(
    'input, textarea, select, .ant-select-selection-search-input, .ant-picker-input input',
  );
  focusable?.focus({ preventScroll: true });
}
