import { AuditExposureChart } from "@/components/charts/audit-exposure-chart";
import { ComplianceTrendChart } from "@/components/charts/compliance-trend-chart";
import { OperationalRiskChart } from "@/components/charts/operational-risk-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";

export function AnalyticsGrid() {
  return (
    <section className="mt-5 grid gap-3 lg:grid-cols-2">
      <ComplianceTrendChart />
      <RiskDistributionChart />
      <OperationalRiskChart />
      <AuditExposureChart />
    </section>
  );
}
