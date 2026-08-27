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

function money(value: number, isAr: boolean) {
  return new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(value);
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
    const hidden = new Set(['id', 'hospitalAr', 'specialtyAr', 'operationId', 'nameAr', 'governorateAr']);
    return Object.keys(rows[0]).filter((key) => !hidden.has(key)).map((key) => ({
      title: key.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase()),
      dataIndex: key,
      key,
      render: (value: any) => {
        if (DATE_KEYS.has(key)) return value ? dayjs(value).format('DD MMM YYYY · HH:mm') : '—';
        if (MONEY_KEYS.has(key)) return money(Number(value), isAr);
        if (key === 'status' || key === 'paymentStatus') return <Tag>{String(value).replace('_', ' ')}</Tag>;
        return value ?? '—';
      },
    }));
  }, [isAr, rows]);

  const activeStatusOptions = active === 'follow-ups' ? FOLLOW_UP_STATUS_OPTIONS : STATUS_OPTIONS;

  return (
    <div className="reports-page page">
      {contextHolder}
      <div className="page-header reports-header">
        <div>
          <Typography.Title level={2}>{isAr ? 'التقارير' : 'Reports'}</Typography.Title>
          <Typography.Text type="secondary">{isAr ? 'رؤية واضحة لأداء عيادتك وحالاتك' : 'Understand your practice, cases and financial activity at a glance'}</Typography.Text>
        </div>
        <Flex gap={8} wrap>
          <Button icon={<ReloadOutlined />} loading={reportQuery.isFetching} onClick={() => reportQuery.refetch()}>{isAr ? 'تحديث' : 'Refresh'}</Button>
          <Button type="primary" icon={<DownloadOutlined />} disabled={!rows.length} onClick={() => { exportCsv(report, active); messageApi.success(isAr ? 'تم تصدير التقرير' : 'Report exported'); }}>{isAr ? 'تصدير CSV' : 'Export CSV'}</Button>
        </Flex>
      </div>

      <Card className="reports-filter-card" bordered={false}>
        <Flex gap={10} wrap align="center">
          <DatePicker.RangePicker value={range} onChange={(value) => setRange(value as [Dayjs | null, Dayjs | null])} allowClear placeholder={[isAr ? 'من' : 'From', isAr ? 'إلى' : 'To']} />
          <Select allowClear showSearch optionFilterProp="label" value={hospitalId} onChange={setHospitalId} placeholder={isAr ? 'كل المستشفيات' : 'All hospitals'} options={hospitalsQuery.data?.map((item: any) => ({ value: item.id, label: isAr ? item.nameAr || item.name : item.name }))} />
          <Select allowClear showSearch optionFilterProp="label" value={specialtyId} onChange={setSpecialtyId} placeholder={isAr ? 'كل التخصصات' : 'All specialties'} options={specialtiesQuery.data?.map((item: any) => ({ value: item.id, label: isAr ? item.nameAr || item.name : item.name }))} />
          {(active === 'operations' || active === 'follow-ups') && <Select allowClear value={status} onChange={setStatus} placeholder={isAr ? 'كل الحالات' : 'All statuses'} options={activeStatusOptions.map((item) => ({ value: item.value, label: isAr ? item.labelAr : item.label }))} />}
          {active === 'financial' && <Select allowClear value={paymentStatus} onChange={setPaymentStatus} placeholder={isAr ? 'كل حالات الدفع' : 'All payment statuses'} options={[{ value: 'PAID', label: isAr ? 'مدفوع' : 'Paid' }, { value: 'PARTIAL', label: isAr ? 'جزئي' : 'Partial' }, { value: 'UNPAID', label: isAr ? 'غير مدفوع' : 'Unpaid' }]} />}
          <Button className="reports-clear-button" onClick={resetFilters}>{isAr ? 'مسح' : 'Clear'}</Button>
        </Flex>
      </Card>

      <Tabs activeKey={active} onChange={(key) => { setActive(key as ReportType); setStatus(undefined); setPaymentStatus(undefined); }} items={REPORTS.map((item) => ({ key: item.key, label: <span className="report-tab-label">{item.icon}<span>{isAr ? item.ar : item.en}</span></span> }))} />

      {reportQuery.isLoading ? <Skeleton active paragraph={{ rows: 10 }} /> : report ? (
        <>
          <div className="report-summary-grid">
            {Object.entries(report.summary ?? {}).slice(0, 6).map(([key, value]) => (
              <Card bordered={false} className="report-summary-card" key={key}>
                <Statistic title={key.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase())} value={typeof value === 'number' && MONEY_KEYS.has(key) ? money(value, isAr) : value as any} />
              </Card>
            ))}
          </div>

          {active === 'financial' && typeof report.summary?.collectionRate === 'number' && <Card bordered={false} className="report-progress-card"><Typography.Text strong>{isAr ? 'نسبة التحصيل' : 'Collection rate'}</Typography.Text><Progress percent={report.summary.collectionRate} status={report.summary.collectionRate >= 80 ? 'success' : 'active'} /></Card>}

          {report.series?.length ? <Card bordered={false} className="report-series-card"><Flex align="center" gap={8} className="report-section-title"><BarChartOutlined /><Typography.Text strong>{isAr ? 'النشاط عبر الوقت' : 'Activity over time'}</Typography.Text></Flex><div className="report-bars">{report.series.map((item: any) => <div className="report-bar-item" key={item.month || item.label}><div className="report-bar-value">{item.value}</div><div className="report-bar" style={{ height: `${Math.max(8, Math.min(100, Number(item.value) * 8))}%` }} /><Typography.Text type="secondary">{item.month || item.label}</Typography.Text></div>)}</div></Card> : null}

          <Card bordered={false} className="report-table-card">
            <Flex justify="space-between" align="center" className="report-section-title"><div><Typography.Title level={4}>{isAr ? selected.ar : selected.en}</Typography.Title><Typography.Text type="secondary">{rows.length} {isAr ? 'سجل' : 'records'}</Typography.Text></div></Flex>
            {rows.length ? <Table rowKey="id" columns={columns as any} dataSource={rows} scroll={{ x: 900 }} pagination={{ pageSize: 15, showSizeChanger: true, responsive: true }} size="middle" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={isAr ? 'لا توجد بيانات لهذا التقرير' : 'No data for this report'} />}
          </Card>
        </>
      ) : <Empty description={isAr ? 'تعذر تحميل التقرير' : 'Unable to load report'} />}
    </div>
  );
}
