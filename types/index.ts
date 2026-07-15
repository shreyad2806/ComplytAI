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
  status: string;
  duration: number;
  summary: string;
};

export type RiskItem = FinancialRisk;

export interface AnalysisResponse {
  success: boolean;
  platform: string;
  analysis_type: string;
  report: ComplianceReport;
  request_id?: string;
  agent_trace?: AgentTrace[];
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
