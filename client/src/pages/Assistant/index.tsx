import { useEffect, useState } from 'react';
import { Alert, Button, Card, Empty, Skeleton, Tag } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarOutlined, MedicineBoxOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assistantService, type AssistantBrief } from '@/services/assistant.service';
import './Assistant.scss';

const formatDate = (value: string, locale: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, options).format(new Date(value));

export default function AssistantPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [daily, setDaily] = useState<AssistantBrief | null>(null);
  const [weekly, setWeekly] = useState<AssistantBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [dailyBrief, weeklyBrief] = await Promise.all([assistantService.getDailyBrief(), assistantService.getWeeklyBrief()]);
      setDaily(dailyBrief);
      setWeekly(weeklyBrief);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  if (loading) return <div className="assistant-page page"><Skeleton active paragraph={{ rows: 3 }} /><Skeleton active paragraph={{ rows: 5 }} /></div>;
  if (error || !daily || !weekly) return <div className="assistant-page page"><Alert type="error" message="Unable to load your MedAxis brief" action={<Button icon={<ReloadOutlined />} onClick={() => void load()}>Retry</Button>} /></div>;

  return (
    <div className="assistant-page page">
      <header className="assistantHero">
        <div>
          <span className="assistantEyebrow">MedAxis Assistant</span>
          <h1>Know what matters next.</h1>
          <p>Your daily and weekly practice brief, built from your actual operations, follow-ups and payments.</p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => void load()}>Refresh</Button>
      </header>

      <section className="assistantSummaryGrid">
        <Card><MedicineBoxOutlined /><strong>{daily.summary.operations}</strong><span>Tomorrow's operations</span></Card>
        <Card><ClockCircleOutlined /><strong>{daily.summary.followUps}</strong><span>Tomorrow's follow-ups</span></Card>
        <Card><WarningOutlined /><strong>{daily.summary.attention}</strong><span>Needs attention</span></Card>
        <Card><DollarOutlined /><strong>{weekly.summary.paymentDue}</strong><span>Outstanding payments</span></Card>
      </section>

      <div className="assistantGrid">
        <Card className="assistantPanel">
          <div className="assistantPanelHeader"><div><span className="assistantIcon assistantIcon--blue"><CalendarOutlined /></span><div><h2>Tomorrow</h2><p>{daily.summary.operations} operations · {daily.summary.followUps} follow-ups</p></div></div></div>
          {daily.operations.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No operations scheduled for tomorrow" /> : <div className="assistantList">{daily.operations.map((operation) => <button className="assistantItem" type="button" key={operation.id} onClick={() => navigate(`/operations/${operation.id}`)}><span className="assistantTime">{operation.operationTime || '—'}</span><span className="assistantItemBody"><strong>{operation.name}</strong><small>{operation.patient?.fullName || '—'} · {operation.hospital?.name || '—'}</small></span><Tag color={operation.status === 'COMPLETED' ? 'green' : 'blue'}>{operation.status.replace('_', ' ')}</Tag></button>)}</div>}
          {daily.followUps.length > 0 && <div className="assistantSubsection"><h3>Follow-ups</h3>{daily.followUps.map((item) => <button className="assistantFollowUp" type="button" key={item.id} onClick={() => navigate(`/operations/${item.operation.id}`)}><ClockCircleOutlined /><span><strong>{item.title}</strong><small>{item.operation.patient.fullName} · {formatDate(item.scheduledAt, locale, { month: 'short', day: 'numeric' })}</small></span><Tag color="purple">{item.status}</Tag></button>)}</div>}
        </Card>

        <Card className="assistantPanel">
          <div className="assistantPanelHeader"><div><span className="assistantIcon assistantIcon--green"><CalendarOutlined /></span><div><h2>Next 7 days</h2><p>{weekly.summary.operations} operations · {weekly.summary.followUps} follow-ups</p></div></div></div>
          <div className="assistantWeekStats"><div><strong>{weekly.summary.operations}</strong><span>Operations</span></div><div><strong>{weekly.summary.followUps}</strong><span>Follow-ups</span></div><div><strong>{weekly.summary.paymentDue}</strong><span>Payments due</span></div></div>
          <div className="assistantList">{weekly.operations.slice(0, 7).map((operation) => <button className="assistantItem" type="button" key={operation.id} onClick={() => navigate(`/operations/${operation.id}`)}><span className="assistantDate"><b>{formatDate(operation.operationDate, locale, { day: '2-digit' })}</b><small>{formatDate(operation.operationDate, locale, { weekday: 'short', month: 'short' })}</small></span><span className="assistantItemBody"><strong>{operation.name}</strong><small>{operation.patient?.fullName || '—'} · {operation.operationTime || '—'}</small></span></button>)}</div>
        </Card>

        <Card className="assistantPanel assistantPanel--attention">
          <div className="assistantPanelHeader"><div><span className="assistantIcon assistantIcon--orange"><WarningOutlined /></span><div><h2>Needs attention</h2><p>{weekly.summary.attention} items worth reviewing</p></div></div></div>
          {weekly.attention.missingInformation.map((item) => <button className="assistantAttention" type="button" key={`missing-${item.id}`} onClick={() => navigate(`/operations/${item.id}`)}><WarningOutlined /><span><strong>{item.title}</strong><small>{item.operationName} · {item.patientName}</small></span></button>)}
          {weekly.attention.overdueFollowUps.map((item) => <button className="assistantAttention" type="button" key={`follow-${item.id}`} onClick={() => navigate(`/operations/${item.operation.id}`)}><ClockCircleOutlined /><span><strong>Overdue follow-up</strong><small>{item.title} · {item.operation.patient.fullName}</small></span></button>)}
          {weekly.attention.paymentDue.map((item) => <button className="assistantAttention" type="button" key={`payment-${item.operationId}`} onClick={() => navigate(`/operations/${item.operationId}`)}><DollarOutlined /><span><strong>Payment due</strong><small>{item.operation.patient.fullName} · {item.remainingAmount}</small></span></button>)}
          {weekly.summary.attention === 0 && <div className="assistantClear"><CheckCircleOutlined /><strong>You're all clear.</strong><span>No urgent items found for the next 7 days.</span></div>}
        </Card>
      </div>
    </div>
  );
}
