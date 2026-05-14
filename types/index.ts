// src/types/index.ts

export interface ComplianceReport {
    risk_score: number;           // 0-100
    risk_level: "Low" | "Medium" | "High" | "Critical";
    executive_summary: string;
    financial_risks: RiskItem[];
    compliance_issues: ComplianceIssue[];
    audit_flags: AuditFlag[];
    recommendations: Recommendation[];
    key_insights: string[];
  }
  
  export interface RiskItem {
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    financial_exposure?: string;
  }
  
  export interface ComplianceIssue {
    issue: string;
    regulation?: string;          // e.g. "GDPR Article 17"
    status: "open" | "resolved" | "in_review";
    priority: "low" | "medium" | "high";
  }
  
  export interface AuditFlag {
    flag: string;
    category: string;
    details: string;
  }
  
  export interface Recommendation {
    action: string;
    priority: "immediate" | "short_term" | "long_term";
    impact: string;
  }
  
  export interface AnalysisResponse {
    success: boolean;
    platform: string;
    analysis_type: string;
    report: ComplianceReport;
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