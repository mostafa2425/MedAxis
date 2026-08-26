import { Request, Response, NextFunction } from 'express';
import { reportsService, type ReportType } from '../services/reports.service';
import { sendSuccess } from '../utils/response';

const REPORT_TYPES = new Set<ReportType>(['operations', 'patients', 'follow-ups', 'financial', 'hospitals', 'procedures']);

function parseDate(value: unknown) {
  if (typeof value !== 'string' || !value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export class ReportsController {
  async getReport(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.params.type as ReportType;
      if (!REPORT_TYPES.has(type)) return res.status(400).json({ success: false, message: 'Invalid report type' });

      const createdBy = (req as any).user?.userId;
      if (!createdBy) return res.status(401).json({ success: false, message: 'Authentication required' });

      const data = await reportsService.getReport(type, {
        createdBy,
        dateFrom: parseDate(req.query.dateFrom),
        dateTo: parseDate(req.query.dateTo),
        hospitalId: typeof req.query.hospitalId === 'string' ? req.query.hospitalId : undefined,
        specialtyId: typeof req.query.specialtyId === 'string' ? req.query.specialtyId : undefined,
        status: typeof req.query.status === 'string' ? req.query.status : undefined,
        paymentStatus: typeof req.query.paymentStatus === 'string' ? req.query.paymentStatus : undefined,
      });

      return sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export const reportsController = new ReportsController();
