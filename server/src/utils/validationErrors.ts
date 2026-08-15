export interface NormalizedValidationIssue {
  field: string;
  path: (string | number)[];
  code: string;
  message: string;
}

interface ZodLikeIssue {
  code: string;
  path: PropertyKey[];
  message: string;
}

function isZodLikeIssue(value: unknown): value is ZodLikeIssue {
  if (typeof value !== 'object' || value === null) return false;
  const issue = value as Record<string, unknown>;
  return (
    typeof issue.code === 'string' &&
    typeof issue.message === 'string' &&
    Array.isArray(issue.path)
  );
}

function toPathSegment(segment: PropertyKey): string | number {
  if (typeof segment === 'number') return segment;
  const asString = String(segment);
  if (/^\d+$/.test(asString)) return Number(asString);
  return asString;
}

export function normalizeZodIssues(issues: unknown): NormalizedValidationIssue[] | null {
  if (!Array.isArray(issues) || issues.length === 0) return null;
  if (!issues.every(isZodLikeIssue)) return null;

  return issues.map((issue) => {
    const path = issue.path.map(toPathSegment);
    return {
      field: path.join('.'),
      path,
      code: issue.code,
      message: issue.message,
    };
  });
}
