// src/types/index.ts

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type KeyInsight = {
  title: string;
  description: string;
  severity: Severity;
};

export type FinancialRisk = KeyInsight & {
  business_impact: string;
  financial_exposure: string;
};

export type ComplianceIssue = KeyInsight & {
  regulation: string;
};

export type AuditFlag = KeyInsight;

export type Recommendation = {
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

export type RiskItem = FinancialRisk;

export interface AnalysisResponse {
  success: boolean;
  platform: string;
  analysis_type: string;
  report: ComplianceReport;
  request_id?: string;
}

export interface AnalysisRequest {
  prompt: string;
  document_text: string;
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