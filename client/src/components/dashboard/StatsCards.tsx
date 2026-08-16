import { Row, Col, Card, Skeleton, Tooltip } from "antd";
import {
  TeamOutlined,
  ScissorOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  BankOutlined,
  DollarOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { dashboardService } from "@/services/dashboard.service";
import { formatCurrency } from "@/utils/helpers";
import type { DashboardStats } from "@/types";
import "./StatsCards.scss";
type MetricKey =
  | "totalOperations"
  | "completedOperations"
  | "pendingOperations"
  | "totalPatients"
  | "totalDoctors"
  | "totalNurses"
  | "totalHospitals"
  | "revenue";
interface MetricConfig {
  key: MetricKey;
  icon: React.ReactNode;
  labelKey: string;
  iconBg: string;
  iconColor: string;
  accentClass: string;
  resolve: (stats: DashboardStats) => {
    available: boolean;
    display: string;
    reason?: string;
  };
}
export default function StatsCards() {
  const { t } = useTranslation();
  const currency = t("common.currency");
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardService.getStats(),
    select: (res) => res.data.data,
  });
  const metrics: MetricConfig[] = [
    {
      key: "totalOperations",
      icon: <ScissorOutlined />,
      labelKey: "dashboard.totalOperations",
      iconBg: "#ECFDF5",
      iconColor: "#16A34A",
      accentClass: "green",
      resolve: (s) => ({
        available: typeof s.totalOperations === "number",
        display: String(s.totalOperations ?? ""),
      }),
    },
    {
      key: "completedOperations",
      icon: <CheckCircleOutlined />,
      labelKey: "dashboard.completedOperations",
      iconBg: "#ECFEF8",
      iconColor: "#0F9F8C",
      accentClass: "teal",
      resolve: (s) => ({
        available: typeof s.completedOperations === "number",
        display: String(s.completedOperations ?? ""),
      }),
    },
    {
      key: "pendingOperations",
      icon: <ClockCircleOutlined />,
      labelKey: "dashboard.pendingOperations",
      iconBg: "#FFF7E6",
      iconColor: "#D97706",
      accentClass: "orange",
      resolve: (s) => ({
        available: typeof s.pendingOperations === "number",
        display: String(s.pendingOperations ?? ""),
      }),
    },
    {
      key: "totalPatients",
      icon: <TeamOutlined />,
      labelKey: "dashboard.totalPatients",
      iconBg: "#EFF6FF",
      iconColor: "#2563EB",
      accentClass: "blue",
      resolve: (s) => ({
        available: typeof s.totalPatients === "number",
        display: String(s.totalPatients ?? ""),
      }),
    },
    {
      key: "totalDoctors",
      icon: <UserOutlined />,
      labelKey: "dashboard.doctors",
      iconBg: "#F5F3FF",
      iconColor: "#7C3AED",
      accentClass: "purple",
      resolve: (s) => ({
        available: typeof s.totalDoctors === "number",
        display: String(s.totalDoctors ?? ""),
      }),
    },
    {
      key: "totalNurses",
      icon: <MedicineBoxOutlined />,
      labelKey: "dashboard.nurses",
      iconBg: "#FDF2F8",
      iconColor: "#DB2777",
      accentClass: "pink",
      resolve: (s) => ({
        available: typeof s.totalNurses === "number",
        display: String(s.totalNurses ?? ""),
      }),
    },
    {
      key: "totalHospitals",
      icon: <BankOutlined />,
      labelKey: "dashboard.hospitals",
      iconBg: "#EEF2FF",
      iconColor: "#4F46E5",
      accentClass: "indigo",
      resolve: (s) => ({
        available: typeof s.totalHospitals === "number",
        display: String(s.totalHospitals ?? ""),
      }),
    },
    {
      key: "revenue",
      icon: <DollarOutlined />,
      labelKey: "dashboard.totalRevenue",
      iconBg: "#ECFDF5",
      iconColor: "#059669",
      accentClass: "emerald",
      resolve: (s) => {
        if (s.revenue && typeof s.revenue.totalCost === "number") {
          return {
            available: true,
            display: formatCurrency(s.revenue.totalCost, currency),
          };
        }
        return {
          available: false,
          display: t("dashboard.notAvailable"),
          reason: t("dashboard.dataUnavailableTooltip"),
        };
      },
    },
  ];
  if (isLoading) {
    return (
      <div className="stats-cards">
        {" "}
        <Row gutter={[16, 16]}>
          {" "}
          {metrics.map((metric) => (
            <Col key={metric.key} xs={12} sm={12} lg={12} xl={6}>
              {" "}
              <Card bordered={false} className="stats-card stats-card--loading">
                {" "}
                <div className="stats-card__loading">
                  {" "}
                  <Skeleton.Avatar active size={48} shape="square" />{" "}
                  <div className="stats-card__loading-content">
                    {" "}
                    <Skeleton.Input active size="small" />{" "}
                    <Skeleton.Input active size="large" />{" "}
                  </div>{" "}
                </div>{" "}
              </Card>{" "}
            </Col>
          ))}{" "}
        </Row>{" "}
      </div>
    );
  }
  return (
    <div className="stats-cards">
      {" "}
      <Row gutter={[16, 16]}>
        {" "}
        {metrics.map((metric) => {
          const resolved = stats
            ? metric.resolve(stats)
            : {
                available: false,
                display: t("dashboard.notAvailable"),
                reason: t("dashboard.dataUnavailableTooltip"),
              };
          const value = resolved.available
            ? resolved.display
            : t("dashboard.notAvailable");
          const content = (
            <>
              {" "}
              <div className="stats-card__header">
                {" "}
                <div
                  className="stats-card__icon"
                  style={{
                    backgroundColor: metric.iconBg,
                    color: metric.iconColor,
                  }}
                >
                  {" "}
                  {metric.icon}{" "}
                </div>{" "}
                <span className="stats-card__trend">
                  {" "}
                  <ArrowUpOutlined />{" "}
                </span>{" "}
              </div>{" "}
              <div className="stats-card__content">
                {" "}
                <span className="stats-card__label">
                  {" "}
                  {t(metric.labelKey)}{" "}
                </span>{" "}
                <span
                  className={`stats-card__value stats-card__value--${metric.accentClass}`}
                >
                  {" "}
                  {value}{" "}
                </span>{" "}
                {!resolved.available && (
                  <span className="stats-card__availability">
                    {" "}
                    {t("dashboard.dataNotAvailable")}{" "}
                  </span>
                )}{" "}
              </div>{" "}
            </>
          );
          const card = (
            <Card
              bordered={false}
              className={`stats-card stats-card--${metric.accentClass}`}
              styles={{ body: { padding: 0 } }}
            >
              {" "}
              <div className="stats-card__inner"> {content} </div>{" "}
            </Card>
          );
          return (
            <Col key={metric.key} xs={12} sm={12} lg={12} xl={6}>
              {" "}
              {resolved.available ? (
                card
              ) : (
                <Tooltip
                  title={
                    resolved.reason ?? t("dashboard.dataUnavailableTooltip")
                  }
                  placement="top"
                >
                  {" "}
                  {card}{" "}
                </Tooltip>
              )}{" "}
            </Col>
          );
        })}{" "}
      </Row>{" "}
    </div>
  );
}
