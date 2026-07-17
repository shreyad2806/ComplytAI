import { create } from "zustand";
import { ComplytStore } from "@/types";
import { analyzeDocument } from "@/lib/api";
import { buildPersistedReport } from "@/lib/normalize-report";
import { useReportsStore } from "@/store/useReportsStore";

function generateReportId(): string {
  return `RPT-${crypto.randomUUID()}`;
}

export const useComplytStore = create<ComplytStore>((set) => ({
  isAnalyzing: false,
  analysisProgress: null,
  analysisComplete: false,
  currentDocumentName: "",
  error: null,
  reportId: null,

  startAnalysis: async ({ file, prompt }) => {
    const trimmed = prompt.trim();
    const userPrompt = trimmed || "Perform a full compliance and risk analysis.";
    const promptForApi = `Return exactly one JSON object. Do not use markdown, code fences, commentary, or properties outside this schema. Every property is required. Use [] for unavailable list data and "Not Found" for unavailable strings. Do not invent facts. confidence_score must be an integer from 0 to 100 based on retrieved evidence, document completeness, and response consistency.\n\n{\n  "document_title":"",\n  "analysis_type":"",\n  "risk_score":0,\n  "risk_level":"LOW|MEDIUM|HIGH|CRITICAL",\n  "confidence_score":0,\n  "executive_summary":"",\n  "key_insights":[{"title":"","description":"","severity":"LOW|MEDIUM|HIGH|CRITICAL","matched_document_text":"","matched_regulation":"","selection_reason":"","retrieved_context":"","source_excerpts":[{"text":"","page_number":""}]}],\n  "financial_risks":[{"title":"","description":"","severity":"LOW|MEDIUM|HIGH|CRITICAL","business_impact":"","financial_exposure":"","regulation":"","confidence_score":null,"matched_document_text":"","matched_regulation":"","selection_reason":"","retrieved_context":"","source_excerpts":[{"text":"","page_number":""}]}],\n  "compliance_issues":[{"title":"","description":"","severity":"LOW|MEDIUM|HIGH|CRITICAL","regulation":"","confidence_score":null,"matched_document_text":"","matched_regulation":"","selection_reason":"","retrieved_context":"","source_excerpts":[{"text":"","page_number":""}]}],\n  "audit_flags":[{"title":"","description":"","severity":"LOW|MEDIUM|HIGH|CRITICAL","control":"","confidence_score":null,"matched_document_text":"","matched_regulation":"","selection_reason":"","retrieved_context":"","source_excerpts":[{"text":"","page_number":""}]}],\n  "recommendations":[{"title":"","description":"","priority":"LOW|MEDIUM|HIGH|CRITICAL","timeline":"","matched_document_text":"","matched_regulation":"","selection_reason":"","retrieved_context":"","source_excerpts":[{"text":"","page_number":""}]}]\n}\n\nAnalysis request: ${userPrompt}`;
    const documentName = file?.name ?? "";

    set({
      isAnalyzing: true,
      analysisProgress: 5,
      analysisComplete: false,
      error: null,
      currentDocumentName: documentName,
      reportId: null,
    });

    try {
      set({ analysisProgress: 15 });
      if (!file) {
        throw new Error("Please upload a document before starting analysis.");
      }
      set({ analysisProgress: 35 });

      const response = await analyzeDocument({
        file,
        prompt: promptForApi,
        document_name: documentName,
      });

      console.info("[copilot] analysis response received", {
        sections: {
          keyInsights: response.report.key_insights.length,
          financialRisks: response.report.financial_risks.length,
          complianceIssues: response.report.compliance_issues.length,
          auditFlags: response.report.audit_flags.length,
          recommendations: response.report.recommendations.length,
        },
      });
      set({ analysisProgress: 75 });

      const reportId = generateReportId();
      const persisted = buildPersistedReport(response, {
        id: reportId,
        prompt: trimmed || promptForApi,
        fileName: file?.name,
      });

      useReportsStore.getState().addReport(persisted);

      set({
        analysisProgress: 100,
        isAnalyzing: false,
        analysisComplete: true,
        reportId: persisted.id,
      });
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("[copilot] analysis failed", { message: rawMessage });
      const message =
        /invalid response from analysis service|unexpected payload|invalid json/i.test(rawMessage)
          ? "Analysis could not be generated."
          : rawMessage;
      set({
        isAnalyzing: false,
        analysisProgress: null,
        error: message,
      });
    }
  },

  clearReport: () => {
    set({
      analysisComplete: false,
      isAnalyzing: false,
      analysisProgress: null,
      error: null,
      reportId: null,
      currentDocumentName: "",
    });
  },

  setError: (error) => set({ error }),
}));
