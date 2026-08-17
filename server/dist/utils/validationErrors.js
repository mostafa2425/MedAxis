"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeZodIssues = normalizeZodIssues;
function isZodLikeIssue(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const issue = value;
    return (typeof issue.code === 'string' &&
        typeof issue.message === 'string' &&
        Array.isArray(issue.path));
}
function toPathSegment(segment) {
    if (typeof segment === 'number')
        return segment;
    const asString = String(segment);
    if (/^\d+$/.test(asString))
        return Number(asString);
    return asString;
}
function normalizeZodIssues(issues) {
    if (!Array.isArray(issues) || issues.length === 0)
        return null;
    if (!issues.every(isZodLikeIssue))
        return null;
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
//# sourceMappingURL=validationErrors.js.map