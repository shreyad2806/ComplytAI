import { AIRecommendationsSection } from "@/components/report/ai-recommendations";
import { AnalyticsSection } from "@/components/report/analytics-section";
import { AuditFlagsSection } from "@/components/report/audit-flags";
import { ComplianceScoreSection } from "@/components/report/compliance-score";
import { ExecutiveSummary } from "@/components/report/executive-summary";
import { ReportFooter } from "@/components/report/report-footer";
import { ReportHeader } from "@/components/report/report-header";
import { ReportHero } from "@/components/report/report-hero";
import { RiskAnalysisSection } from "@/components/report/risk-analysis";
import { StrategicIntelligenceSection } from "@/components/report/strategic-intelligence";
import { getReportMeta } from "@/lib/mock/report-data";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const meta = getReportMeta(decodeURIComponent(id));
  return {
    title: `${meta.reportId} — Intelligence Report | Complyt AI`,
    description: `AI compliance intelligence analysis for ${meta.clientName}.`,
  };
}

export default async function IntelligenceReportPage({ params }: PageProps) {
  const { id } = await params;
  const meta = getReportMeta(decodeURIComponent(id));

  return (
    <div
      className="min-h-full bg-[#09090b] text-zinc-100 [background-image:linear-gradient(to_right,rgba(39,39,42,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(39,39,42,0.09)_1px,transparent_1px)] [background-size:28px_28px]"
    >
      <ReportHeader reportId={meta.reportId} />
      <ReportHero meta={meta} />
      <ExecutiveSummary />
      <ComplianceScoreSection />
      <RiskAnalysisSection />
      <AuditFlagsSection />
      <AIRecommendationsSection />
      <AnalyticsSection />
      <StrategicIntelligenceSection />
      <ReportFooter meta={meta} />
    </div>
  );
}
