"use client";

import { useMemo } from "react";

import { AuditExposureChart } from "@/components/charts/audit-exposure-chart";
import { ComplianceTrendChart } from "@/components/charts/compliance-trend-chart";
import { OperationalRiskChart } from "@/components/charts/operational-risk-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import {
  selectAuditExposureBars,
  selectCategoryCounts,
  selectRiskDistribution,
  selectRiskTrend,
} from "@/lib/report-analytics";
import { useReportsStore } from "@/store/useReportsStore";

export function AnalyticsGrid() {
  const reports = useReportsStore((s) => s.reports);

  const pie = useMemo(() => selectRiskDistribution(reports), [reports]);
  const trend = useMemo(() => selectRiskTrend(reports), [reports]);
  const bars = useMemo(() => selectCategoryCounts(reports), [reports]);
  const audit = useMemo(() => selectAuditExposureBars(reports), [reports]);

  return (
    <section className="mt-5 grid gap-3 lg:grid-cols-2">
      <ComplianceTrendChart data={trend} />
      <RiskDistributionChart data={pie} />
      <OperationalRiskChart data={bars} />
      <AuditExposureChart items={audit} />
    </section>
  );
}
