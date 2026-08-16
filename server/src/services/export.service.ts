import { operationRepo } from '../repositories/operation.repo';
import { OperationStatus } from '../prisma';

class ExportService {
  async exportOperations(params: { format: 'json' | 'csv'; status?: OperationStatus; specialtyId?: string; hospitalId?: string; dateFrom?: string; dateTo?: string; createdBy: string }) {
    const { format, ...filters } = params;
    const operations = await operationRepo.exportData(filters);
    if (format === 'csv') return this.toJsonCsv(operations);
    return { format: 'json', data: operations, totalRecords: operations.length };
  }
  private toJsonCsv(operations: any[]) {
    if (operations.length === 0) return { format: 'csv', data: '', filename: 'operations.csv', totalRecords: 0 };
    const headers = ['Operation Name', 'Diagnosis', 'Date', 'Time', 'Duration (min)', 'Status', 'Patient', 'Age', 'Gender', 'Mobile', 'Hospital', 'Specialty', 'Primary Surgeon', 'Assistant Surgeon', 'Anesthesiologist', 'Total Cost', 'Paid Amount', 'Remaining', 'Payment Method', 'Payment Status', 'Notes'];
    const rows = operations.map((op) => [this.escapeCsv(op.name), this.escapeCsv(op.diagnosis ?? ''), op.operationDate?.toISOString().split('T')[0] || '', op.operationTime || '', op.duration?.toString() || '', op.status || '', this.escapeCsv(op.patient?.fullName || ''), op.patient?.age?.toString() || '', op.patient?.gender || '', op.patient?.mobile || '', this.escapeCsv(op.hospital?.name || ''), this.escapeCsv(op.specialty?.name || ''), this.escapeCsv(op.medicalTeam?.[0]?.primarySurgeon?.name || ''), this.escapeCsv(op.medicalTeam?.[0]?.assistantSurgeon?.name || ''), this.escapeCsv(op.medicalTeam?.[0]?.anesthesiologist?.name || ''), op.cost?.totalCost?.toString() || '0', op.cost?.paidAmount?.toString() || '0', op.cost?.remainingAmount?.toString() || '0', op.cost?.paymentMethod || '', op.cost?.paymentStatus || '', this.escapeCsv(op.notes || '')]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return { format: 'csv', data: csvContent, filename: `operations_${new Date().toISOString().split('T')[0]}.csv`, totalRecords: operations.length };
  }
  private escapeCsv(value: string): string {
    if (!value) return '';
    if (value.includes(',') || value.includes('"') || value.includes('\n')) return `"${value.replace(/"/g, '""')}"`;
    return value;
  }
}
export const exportService = new ExportService();
