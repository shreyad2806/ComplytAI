// src/types/index.ts

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SourceExcerpt = {
  text: string;
  page_number?: string;
};

export type FindingEvidence = {
  matched_document_text: string;
  matched_regulation: string;
  selection_reason: string;
  retrieved_context: string;
  source_excerpts: SourceExcerpt[];
};

export type KeyInsight = FindingEvidence & {
  title: string;
  description: string;
  severity: Severity;
  confidence_score?: number;
};

export type FinancialRisk = KeyInsight & {
  business_impact: string;
  financial_exposure: string;
  regulation: string;
};

export type ComplianceIssue = KeyInsight & {
  regulation: string;
};

export type AuditFlag = KeyInsight & {
  control: string;
};

export type Recommendation = FindingEvidence & {
  title: string;
  description: string;
  priority: Severity;
  timeline: string;
};

export interface ComplianceReport {
  document_title: string;
  analysis_type: string;
  risk_score: number;
  risk_level: Severity;
  confidence_score: number;
  executive_summary: string;
  key_insights: KeyInsight[];
  financial_risks: FinancialRisk[];
  compliance_issues: ComplianceIssue[];
  audit_flags: AuditFlag[];
  recommendations: Recommendation[];
}

export type AgentTrace = {
  agent: string;
  task?: string;
  status: string;
  started_at?: string | null;
  finished_at?: string | null;
  duration: number;
  duration_seconds?: number;
  evidence_count?: number;
  findings_count?: number;
  summary: string;
};

export interface CrewMetrics {
  crew_total_duration_seconds: number;
  average_agent_duration_seconds: number;
  slowest_agent: string;
  fastest_agent: string;
  total_findings: number;
  total_evidence: number;
}

export type RiskItem = FinancialRisk;

export interface AnalysisResponse {
  success: boolean;
  platform: string;
  analysis_type: string;
  report: ComplianceReport;
  request_id?: string;
  agent_trace?: AgentTrace[];
  crew_metrics?: CrewMetrics | null;
}

export interface AnalysisRequest {
  file: File;
  prompt: string;
  document_name: string;
}

  // The shape of our Zustand store
  export interface ComplytStore {
    // Transient UI during Copilot run
    isAnalyzing: boolean;
    analysisProgress: number | null;
    analysisComplete: boolean;
    currentDocumentName: string;
    error: string | null;
    reportId: string | null;

    startAnalysis: (params: {
      file?: File | null;
      prompt: string;
    }) => Promise<void>;
    clearReport: () => void;
    setError: (error: string | null) => void;
  }
