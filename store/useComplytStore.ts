import { create } from "zustand";
import { ComplytStore } from "@/types";
import { analyzeDocument } from "@/lib/api";
import { buildPersistedReport } from "@/lib/normalize-report";
import { useReportsStore } from "@/store/useReportsStore";

function generateReportId(): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `RPT-${year}-${seq}`;
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
    const promptForApi =
      trimmed || "Perform a full compliance and risk analysis.";
    const documentName = file?.name ?? "Analysis request (no attachment)";

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
      const document_text = file ? await extractTextFromFile(file) : "";
      set({ analysisProgress: 35 });

      const response = await analyzeDocument({
        prompt: promptForApi,
        document_text,
        document_name: documentName,
      });

      set({ analysisProgress: 75 });

      if (!response.success) {
        throw new Error("Analysis failed. Please try again.");
      }

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
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
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

async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    return await file.text();
  }

  if (file.type === "application/pdf") {
    return await file.text();
  }

  return await file.text();
}
