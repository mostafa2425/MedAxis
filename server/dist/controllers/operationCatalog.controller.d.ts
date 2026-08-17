import { Request, Response, NextFunction } from 'express';
export declare class OperationCatalogController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const operationCatalogController: OperationCatalogController;
//# sourceMappingURL=operationCatalog.controller.d.ts.map