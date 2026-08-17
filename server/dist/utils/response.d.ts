import { Response } from 'express';
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: ApiResponse<T>['meta']): Response<any, Record<string, any>>;
export declare function sendError(res: Response, message: string, statusCode?: number, errors?: unknown): Response<any, Record<string, any>>;
export declare function sendPaginated<T>(res: Response, data: T[], page: number, limit: number, total: number, message?: string): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map