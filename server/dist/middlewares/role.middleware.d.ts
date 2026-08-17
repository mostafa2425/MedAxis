import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
export declare function requireRole(...roles: string[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map