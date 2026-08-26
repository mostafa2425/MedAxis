import { useEffect, useMemo, useState } from "react";
import { Button, Divider, Drawer, Empty, Skeleton, Tag } from "antd";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  assistantService,
  type AssistantBrief,
} from "@/services/assistant.service";
import type { SmartNotification } from "@/services/notification.service";
import "./PracticeBriefDrawer.scss";
import "./NotificationCenter.scss";

interface PracticeBriefDrawerProps {
  notification: SmartNotification | null;
  open: boolean;
  onClose: () => void;
}

const isWeekly = (notification: SmartNotification | null) =>
  notification?.kind === "WEEKLY_BRIEF";

const formatDate = (value: string, locale: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale, options).format(new Date(value));

const formatAmount = (value: string | number) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function PracticeBriefDrawer({
  notification,
  open,
  onClose,
}: PracticeBriefDrawerProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [brief, setBrief] = useState<AssistantBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [placement, setPlacement] = useState<"right" | "bottom">(
    typeof window !== "undefined" && window.innerWidth < 768 ? "bottom" : "right",
  );
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const weekly = isWeekly(notification);

  useEffect(() => {
    const onResize = () => setPlacement(window.innerWidth < 768 ? "bottom" : "right");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open || !notification) return;
    let active = true;
    setLoading(true);
    setError(false);
    const load = async () => {
      try {
        const data = weekly
          ? await assistantService.getWeeklyBrief()
          : await assistantService.getDailyBrief();
        if (active) setBrief(data);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [open, notification?.id, weekly]);

  const title = useMemo(() => {
    if (notification?.title) return notification.title;
    return weekly ? "Weekly Practice Brief" : "Tomorrow's Practice Brief";
  }, [notification?.title, weekly]);

  const rangeLabel = brief
    ? weekly
      ? `${formatDate(brief.range.from, locale, { month: "short", day: "numeric" })} – ${formatDate(brief.range.to, locale, { month: "short", day: "numeric" })}`
      : formatDate(brief.range.from, locale, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
    : "";

  const goToOperation = (id: string) => {
    onClose();
    navigate(`/operations/${id}`);
  };

  return (
    <Drawer
      title={null}
      placement={placement}
      open={open}
      onClose={onClose}
      width={520}
      height="88vh"
      className="practiceBriefDrawer"
      destroyOnClose
    >
      <div className={`practiceBrief ${weekly ? "practiceBrief--weekly" : "practiceBrief--daily"}`}>
        <div className="practiceBriefHero">
          <div className="practiceBriefHeroIcon">
            {weekly ? <CalendarOutlined /> : <MedicineBoxOutlined />}
          </div>
          <div className="practiceBriefHeroCopy">
            <div className="practiceBriefEyebrow">
              <span className="practiceBriefType">{weekly ? "WEEKLY" : "DAILY"}</span>
              <span>{rangeLabel}</span>
            </div>
            <h2>{title}</h2>
            <p>
              {weekly
                ? "A focused view of the next 7 days, with priorities worth reviewing."
                : "Everything you should know before tomorrow starts."}
            </p>
          </div>
          <div className="practiceBriefUnreadMark" />
        </div>

        {loading ? (
          <div className="practiceBriefLoading">
            <Skeleton active paragraph={{ rows: 4 }} />
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        ) : error || !brief ? (
          <div className="practiceBriefError">
            <WarningOutlined />
            <strong>Unable to load brief details</strong>
            <span>Try opening the notification again or refresh the Assistant.</span>
          </div>
        ) : (
          <div className="practiceBriefContent">
            <div className="practiceBriefStats">
              <div className="practiceBriefStat practiceBriefStat--blue">
                <MedicineBoxOutlined />
                <strong>{brief.summary.operations}</strong>
                <span>{weekly ? "Operations" : "Tomorrow's operations"}</span>
              </div>
              <div className="practiceBriefStat practiceBriefStat--purple">
                <ClockCircleOutlined />
                <strong>{brief.summary.followUps}</strong>
                <span>Follow-ups</span>
              </div>
              <div className="practiceBriefStat practiceBriefStat--orange">
                <WarningOutlined />
                <strong>{brief.summary.attention}</strong>
                <span>Needs attention</span>
              </div>
              <div className="practiceBriefStat practiceBriefStat--green">
                <DollarOutlined />
                <strong>{formatAmount(brief.summary.paymentDue)}</strong>
                <span>Outstanding</span>
              </div>
            </div>

            <section className="practiceBriefSection">
              <div className="practiceBriefSectionHeader">
                <div>
                  <span className="practiceBriefSectionIcon practiceBriefSectionIcon--blue"><CalendarOutlined /></span>
                  <div>
                    <h3>{weekly ? "Upcoming operations" : "Tomorrow's operations"}</h3>
                    <p>{brief.operations.length} scheduled</p>
                  </div>
                </div>
              </div>
              {brief.operations.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No operations scheduled" />
              ) : (
                <div className="practiceBriefList">
                  {brief.operations.map((operation) => (
                    <button
                      type="button"
                      className="practiceBriefOperation"
                      key={operation.id}
                      onClick={() => goToOperation(operation.id)}
                    >
                      <span className="practiceBriefOperationDate">
                        <strong>{formatDate(operation.operationDate, locale, { day: "2-digit" })}</strong>
                        <small>{formatDate(operation.operationDate, locale, { weekday: "short", month: "short" })}</small>
                      </span>
                      <span className="practiceBriefOperationBody">
                        <strong>{operation.name}</strong>
                        <span>{operation.patient?.fullName || "Patient not specified"}</span>
                        <small>
                          {operation.operationTime || "Time not set"}
                          {operation.operationRoom ? ` · Room ${operation.operationRoom}` : ""}
                          {operation.hospital?.name ? ` · ${operation.hospital.name}` : ""}
                        </small>
                      </span>
                      <Tag color={operation.status === "COMPLETED" ? "green" : "blue"}>
                        {operation.status.replaceAll("_", " ")}
                      </Tag>
                      <ArrowRightOutlined className="practiceBriefArrow" />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="practiceBriefSection">
              <div className="practiceBriefSectionHeader">
                <div>
                  <span className="practiceBriefSectionIcon practiceBriefSectionIcon--purple"><ClockCircleOutlined /></span>
                  <div>
                    <h3>Follow-ups</h3>
                    <p>{brief.summary.followUps} upcoming · {brief.summary.overdueFollowUps} overdue</p>
                  </div>
                </div>
              </div>
              {brief.followUps.length === 0 ? (
                <div className="practiceBriefClear"><CheckCircleOutlined /><span>No follow-ups need your attention in this period.</span></div>
              ) : (
                <div className="practiceBriefList">
                  {brief.followUps.map((item) => (
                    <button type="button" className="practiceBriefSimpleItem" key={item.id} onClick={() => goToOperation(item.operation.id)}>
                      <span className="practiceBriefSimpleIcon"><ClockCircleOutlined /></span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.operation.patient.fullName} · {formatDate(item.scheduledAt, locale, { weekday: "short", month: "short", day: "numeric" })}</small>
                      </span>
                      <Tag color={item.status === "OVERDUE" ? "red" : "purple"}>{item.status.replaceAll("_", " ")}</Tag>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {(brief.attention.missingInformation.length > 0 || brief.attention.overdueFollowUps.length > 0) && (
              <section className="practiceBriefSection practiceBriefSection--attention">
                <div className="practiceBriefSectionHeader">
                  <div>
                    <span className="practiceBriefSectionIcon practiceBriefSectionIcon--orange"><WarningOutlined /></span>
                    <div>
                      <h3>Needs attention</h3>
                      <p>{brief.summary.attention} priority items</p>
                    </div>
                  </div>
                </div>
                <div className="practiceBriefList">
                  {brief.attention.missingInformation.map((item) => (
                    <button type="button" className="practiceBriefSimpleItem" key={`missing-${item.id}`} onClick={() => goToOperation(item.id)}>
                      <span className="practiceBriefSimpleIcon practiceBriefSimpleIcon--orange"><WarningOutlined /></span>
                      <span><strong>{item.title}</strong><small>{item.operationName} · {item.patientName}</small></span>
                      <ArrowRightOutlined className="practiceBriefArrow" />
                    </button>
                  ))}
                  {brief.attention.overdueFollowUps.map((item) => (
                    <button type="button" className="practiceBriefSimpleItem" key={`overdue-${item.id}`} onClick={() => goToOperation(item.operation.id)}>
                      <span className="practiceBriefSimpleIcon practiceBriefSimpleIcon--red"><ClockCircleOutlined /></span>
                      <span><strong>Overdue follow-up</strong><small>{item.title} · {item.operation.patient.fullName}</small></span>
                      <Tag color="red">Overdue</Tag>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {brief.attention.paymentDue.length > 0 && (
              <section className="practiceBriefSection">
                <div className="practiceBriefSectionHeader">
                  <div>
                    <span className="practiceBriefSectionIcon practiceBriefSectionIcon--green"><DollarOutlined /></span>
                    <div>
                      <h3>Outstanding payments</h3>
                      <p>{brief.attention.paymentDue.length} payment items</p>
                    </div>
                  </div>
                </div>
                <div className="practiceBriefPaymentList">
                  {brief.attention.paymentDue.map((item) => (
                    <button type="button" className="practiceBriefPayment" key={item.operationId} onClick={() => goToOperation(item.operationId)}>
                      <span><strong>{item.operation.patient.fullName}</strong><small>{item.operation.name}</small></span>
                      <strong>{formatAmount(item.remainingAmount)}</strong>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {brief.summary.attention === 0 && brief.summary.followUps === 0 && (
              <div className="practiceBriefAllClear">
                <CheckCircleOutlined />
                <div>
                  <strong>You're all clear</strong>
                  <span>No urgent items were found for this period.</span>
                </div>
              </div>
            )}

            <Divider />
            <Button
              type="primary"
              block
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => {
                onClose();
                navigate("/assistant");
              }}
            >
              Open MedAxis Assistant
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
