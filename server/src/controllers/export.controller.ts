import { Request, Response, NextFunction } from 'express';
import { exportService } from '../services/export.service';
import { exportQuerySchema } from '../validators/export.validator';
import { AppError } from '../utils/errors';

export class ExportController {
  async exportOperations(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = exportQuerySchema.safeParse(req.query);
      const params = parsed.success
        ? parsed.data
        : { format: 'json' as const };
      const userId = (req as any).user?.userId;
      const result = await exportService.exportOperations({
        ...params,
        status: params.status as any,
        createdBy: userId,
      });

      if (result.format === 'csv' && (result as any).data) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${(result as any).filename}"`,
        );
        return res.send((result as any).data);
      }

      return res.json({
        success: true,
        message: 'Export successful',
        data: (result as any).data,
        meta: { totalRecords: (result as any).totalRecords },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const exportController = new ExportController();
