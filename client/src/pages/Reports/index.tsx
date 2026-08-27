import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, DatePicker, Empty, Flex, Progress, Select, Skeleton, Statistic, Table, Tabs, Tag, Typography, message } from 'antd';
import { BarChartOutlined, CalendarOutlined, DownloadOutlined, FileDoneOutlined, ReloadOutlined, TeamOutlined, DollarOutlined, BankOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { reportsService, type ReportType } from '@/services/reports.service';
import { hospitalService } from '@/services/hospital.service';
import { specialtyService } from '@/services/specialty.service';
import './Reports.scss';

const REPORTS: Array<{ key: ReportType; en: string; ar: string; icon: React.ReactNode }> = [
  { key: 'operations', en: 'Operations', ar: 'العمليات', icon: <FileDoneOutlined /> },
  { key: 'patients', en: 'Patients', ar: 'المرضى', icon: <TeamOutlined /> },
  { key: 'follow-ups', en: 'Follow-ups', ar: 'المتابعات', icon: <CalendarOutlined /> },
  { key: 'financial', en: 'Financial', ar: 'المالية', icon: <DollarOutlined /> },
  { key: 'hospitals', en: 'Hospitals', ar: 'المستشفيات', icon: <BankOutlined /> },
  { key: 'procedures', en: 'Procedures & Specialties', ar: 'الإجراءات والتخصصات', icon: <MedicineBoxOutlined /> },
];

const STATUS_OPTIONS = [
  { value: 'SCHEDULED', label: 'Scheduled', labelAr: 'مجدولة' },
  { value: 'IN_PROGRESS', label: 'In progress', labelAr: 'قيد التنفيذ' },
  { value: 'COMPLETED', label: 'Completed', labelAr: 'مكتملة' },
  { value: 'CANCELLED', label: 'Cancelled', labelAr: 'ملغاة' },
];

const FOLLOW_UP_STATUS_OPTIONS = [
  { value: 'UPCOMING', label: 'Upcoming', labelAr: 'قادمة' },
  { value: 'OVERDUE', label: 'Overdue', labelAr: 'متأخرة' },
  { value: 'COMPLETED', label: 'Completed', labelAr: 'مكتملة' },
  { value: 'CANCELLED', label: 'Cancelled', labelAr: 'ملغاة' },
];

const DATE_KEYS = new Set(['date', 'scheduledAt', 'completedAt', 'createdAt']);
const MONEY_KEYS = new Set(['totalCost', 'paidAmount', 'remainingAmount', 'total', 'paid', 'remaining', 'revenue']);
const HIDDEN_KEYS = new Set(['id', 'hospitalAr', 'specialtyAr', 'operationId', 'nameAr', 'governorateAr']);

function money(value: number, isAr: boolean) {
  return new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(value);
}

function labelForKey(key: string, isAr: boolean) {
  const labels: Record<string, [string, string]> = {
    operation: ['Operation', 'العملية'],
    patient: ['Patient', 'المريض'],
    hospital: ['Hospital', 'المستشفى'],
    specialty: ['Specialty', 'التخصص'],
    procedure: ['Procedure', 'الإجراء'],
    status: ['Status', 'الحالة'],
    paymentStatus: ['Payment status', 'حالة الدفع'],
    date: ['Date', 'التاريخ'],
    scheduledAt: ['Scheduled', 'الموعد'],
    completedAt: ['Completed', 'تاريخ الإكمال'],
    createdAt: ['Created', 'تاريخ الإنشاء'],
    totalCost: ['Total cost', 'التكلفة الإجمالية'],
    paidAmount: ['Paid', 'المدفوع'],
    remainingAmount: ['Remaining', 'المتبقي'],
    revenue: ['Revenue', 'الإيرادات'],
    total: ['Total', 'الإجمالي'],
    paid: ['Paid', 'المدفوع'],
    remaining: ['Remaining', 'المتبقي'],
  };
  if (labels[key]) return isAr ? labels[key][1] : labels[key][0];
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase());
}

function formatValue(value: unknown, key: string, isAr: boolean) {
  if (value === null || value === undefined || value === '') return '—';
  if (DATE_KEYS.has(key)) return dayjs(String(value)).isValid() ? dayjs(String(value)).format('DD MMM YYYY · HH:mm') : '—';
  if (MONEY_KEYS.has(key)) return money(Number(value), isAr);
  if (key === 'status' || key === 'paymentStatus') return String(value).replaceAll('_', ' ');
  return String(value);
}

function exportCsv(report: any, type: ReportType) {
  const rows = Array.isArray(report?.rows) ? report.rows : [];
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csv = [keys.map(escape).join(','), ...rows.map((row: any) => keys.map((key) => escape(row[key])).join(','))].join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `medaxis-${type}-report-${dayjs().format('YYYY-MM-DD')}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function MobileReportList({ rows, isAr }: { rows: any[]; isAr: boolean }) {
  if (!rows.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={isAr ? 'لا توجد بيانات لهذا التقرير' : 'No data for this report'} />;

  return (
    <div className="mobile-report-list">
      {rows.map((row, index) => {
        const keys = Object.keys(row).filter((key) => !HIDDEN_KEYS.has(key));
        const primaryKey = keys[0];
        const secondaryKeys = keys.slice(1);
        return (
          <article className="mobile-report-card" key={row.id ?? `${primaryKey}-${index}`}>
            <div className="mobile-report-card-header">
              <div className="mobile-report-primary">
                <Typography.Text className="mobile-report-primary-label">{labelForKey(primaryKey, isAr)}</Typography.Text>
                <Typography.Text strong className="mobile-report-primary-value">{formatValue(row[primaryKey], primaryKey, isAr)}</Typography.Text>
              </div>
              {(row.status || row.paymentStatus) && (
                <Tag className="mobile-report-status">{formatValue(row.status ?? row.paymentStatus, row.status ? 'status' : 'paymentStatus', isAr)}</Tag>
              )}
            </div>
            <div className="mobile-report-details">
              {secondaryKeys.map((key) => (
                <div className="mobile-report-detail" key={key}>
                  <Typography.Text type="secondary">{labelForKey(key, isAr)}</Typography.Text>
                  <Typography.Text>{formatValue(row[key], key, isAr)}</Typography.Text>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function ReportsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const [active, setActive] = useState<ReportType>('operations');
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [hospitalId, setHospitalId] = useState<string>();
  const [specialtyId, setSpecialtyId] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [paymentStatus, setPaymentStatus] = useState<string>();
  const [messageApi, contextHolder] = message.useMessage();

  const filters = useMemo(() => ({
    ...(range[0] ? { dateFrom: range[0].startOf('day').toISOString() } : {}),
    ...(range[1] ? { dateTo: range[1].endOf('day').toISOString() } : {}),
    ...(hospitalId ? { hospitalId } : {}),
    ...(specialtyId ? { specialtyId } : {}),
    ...(status && (active === 'operations' || active === 'follow-ups') ? { status } : {}),
    ...(paymentStatus && active === 'financial' ? { paymentStatus } : {}),
  }), [active, hospitalId, paymentStatus, range, specialtyId, status]);

  const reportQuery = useQuery({
    queryKey: ['reports', active, filters],
    queryFn: async () => (await reportsService.get(active, filters)).data.data,
  });
  const hospitalsQuery = useQuery({ queryKey: ['reports-hospitals'], queryFn: async () => (await hospitalService.getActive()).data.data ?? [] });
  const specialtiesQuery = useQuery({ queryKey: ['reports-specialties'], queryFn: async () => (await specialtyService.getAll({ limit: 100 })).data.data ?? [] });

  const report: any = reportQuery.data;
  const rows = report?.rows ?? [];
  const selected = REPORTS.find((item) => item.key === active)!;

  const resetFilters = () => { setRange([null, null]); setHospitalId(undefined); setSpecialtyId(undefined); setStatus(undefined); setPaymentStatus(undefined); };

  const columns = useMemo(() => {
    if (!rows.length) return [];
    return Object.keys(rows[0]).filter((key) => !HIDDEN_KEYS.has(key)).map((key) => ({
      title: labelForKey(key, isAr),
      dataIndex: key,
      key,
      render: (value: any) => {
        if (DATE_KEYS.has(key)) return formatValue(value, key, isAr);
        if (MONEY_KEYS.has(key)) return money(Number(value), isAr);
        if (key === 'status' || key === 'paymentStatus') return <Tag>{formatValue(value, key, isAr)}</Tag>;
        return value ?? '—';
      },
    }));
  }, [isAr, rows]);

  const activeStatusOptions = active === 'follow-ups' ? FOLLOW_UP_STATUS_OPTIONS : STATUS_OPTIONS;
  const seriesMax = Math.max(1, ...(report?.series ?? []).map((item: any) => Number(item.value) || 0));

  return (
    <div className="reports-page page">
      {contextHolder}
      <div className="page-header reports-header">
        <div className="reports-header-copy">
          <Typography.Title level={2}>{isAr ? 'التقارير' : 'Reports'}</Typography.Title>
          <Typography.Text type="secondary">{isAr ? 'رؤية واضحة لأداء عيادتك وحالاتك' : 'Understand your practice, cases and financial activity at a glance'}</Typography.Text>
        </div>
        <Flex gap={8} wrap className="reports-header-actions">
          <Button icon={<ReloadOutlined />} loading={reportQuery.isFetching} onClick={() => reportQuery.refetch()}>{isAr ? 'تحديث' : 'Refresh'}</Button>
          <Button type="primary" icon={<DownloadOutlined />} disabled={!rows.length} onClick={() => { exportCsv(report, active); messageApi.success(isAr ? 'تم تصدير التقرير' : 'Report exported'); }}>{isAr ? 'تصدير CSV' : 'Export CSV'}</Button>
        </Flex>
      </div>

      <Card className="reports-filter-card" bordered={false}>
        <div className="reports-filter-grid">
          <DatePicker.RangePicker value={range} onChange={(value) => setRange(value as [Dayjs | null, Dayjs | null])} allowClear placeholder={[isAr ? 'من' : 'From', isAr ? 'إلى' : 'To']} />
          <Select allowClear showSearch optionFilterProp="label" value={hospitalId} onChange={setHospitalId} placeholder={isAr ? 'كل المستشفيات' : 'All hospitals'} options={hospitalsQuery.data?.map((item: any) => ({ value: item.id, label: isAr ? item.nameAr || item.name : item.name }))} />
          <Select allowClear showSearch optionFilterProp="label" value={specialtyId} onChange={setSpecialtyId} placeholder={isAr ? 'كل التخصصات' : 'All specialties'} options={specialtiesQuery.data?.map((item: any) => ({ value: item.id, label: isAr ? item.nameAr || item.name : item.name }))} />
          {(active === 'operations' || active === 'follow-ups') && <Select allowClear value={status} onChange={setStatus} placeholder={isAr ? 'كل الحالات' : 'All statuses'} options={activeStatusOptions.map((item) => ({ value: item.value, label: isAr ? item.labelAr : item.label }))} />}
          {active === 'financial' && <Select allowClear value={paymentStatus} onChange={setPaymentStatus} placeholder={isAr ? 'كل حالات الدفع' : 'All payment statuses'} options={[{ value: 'PAID', label: isAr ? 'مدفوع' : 'Paid' }, { value: 'PARTIAL', label: isAr ? 'جزئي' : 'Partial' }, { value: 'UNPAID', label: isAr ? 'غير مدفوع' : 'Unpaid' }]} />}
          <Button className="reports-clear-button" onClick={resetFilters}>{isAr ? 'مسح' : 'Clear'}</Button>
        </div>
      </Card>

      <Tabs className="reports-tabs" activeKey={active} onChange={(key) => { setActive(key as ReportType); setStatus(undefined); setPaymentStatus(undefined); }} items={REPORTS.map((item) => ({ key: item.key, label: <span className="report-tab-label">{item.icon}<span>{isAr ? item.ar : item.en}</span></span> }))} />

      {reportQuery.isLoading ? <Skeleton active paragraph={{ rows: 10 }} /> : report ? (
        <>
          <div className="report-summary-grid">
            {Object.entries(report.summary ?? {}).slice(0, 6).map(([key, value]) => (
              <Card bordered={false} className="report-summary-card" key={key}>
                <Statistic title={labelForKey(key, isAr)} value={typeof value === 'number' && MONEY_KEYS.has(key) ? money(value, isAr) : value as any} />
              </Card>
            ))}
          </div>

          {active === 'financial' && typeof report.summary?.collectionRate === 'number' && <Card bordered={false} className="report-progress-card"><Typography.Text strong>{isAr ? 'نسبة التحصيل' : 'Collection rate'}</Typography.Text><Progress percent={report.summary.collectionRate} status={report.summary.collectionRate >= 80 ? 'success' : 'active'} /></Card>}

          {report.series?.length ? <Card bordered={false} className="report-series-card"><Flex align="center" gap={8} className="report-section-title"><BarChartOutlined /><Typography.Text strong>{isAr ? 'النشاط عبر الوقت' : 'Activity over time'}</Typography.Text></Flex><div className="report-bars">{report.series.map((item: any) => <div className="report-bar-item" key={item.month || item.label}><div className="report-bar-value">{item.value}</div><div className="report-bar" style={{ height: `${Math.max(8, (Number(item.value) / seriesMax) * 100)}%` }} /><Typography.Text type="secondary">{item.month || item.label}</Typography.Text></div>)}</div></Card> : null}

          <Card bordered={false} className="report-table-card">
            <Flex justify="space-between" align="center" className="report-section-title"><div><Typography.Title level={4}>{isAr ? selected.ar : selected.en}</Typography.Title><Typography.Text type="secondary">{rows.length} {isAr ? 'سجل' : 'records'}</Typography.Text></div></Flex>
            <div className="desktop-report-table">{rows.length ? <Table rowKey="id" columns={columns as any} dataSource={rows} scroll={{ x: 900 }} pagination={{ pageSize: 15, showSizeChanger: true, responsive: true }} size="middle" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={isAr ? 'لا توجد بيانات لهذا التقرير' : 'No data for this report'} />}</div>
            <div className="mobile-report-table"><MobileReportList rows={rows} isAr={isAr} /></div>
          </Card>
        </>
      ) : <Empty description={isAr ? 'تعذر تحميل التقرير' : 'Unable to load report'} />}
    </div>
  );
}
