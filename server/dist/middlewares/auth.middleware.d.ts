import { Request, Response, NextFunction } from 'express';
import { type JwtPayload } from '../utils/auth';
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export declare function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map