export interface NormalizedValidationIssue {
    field: string;
    path: (string | number)[];
    code: string;
    message: string;
}
export declare function normalizeZodIssues(issues: unknown): NormalizedValidationIssue[] | null;
//# sourceMappingURL=validationErrors.d.ts.map