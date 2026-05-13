import { historyRows } from "@/lib/mock/dashboard-data";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function severityToLevel(value: string): "critical" | "high" | "med" | "low" {
  const normalized = value.toLowerCase();
  if (normalized.includes("critical")) return "critical";
  if (normalized.includes("high")) return "high";
  if (normalized.includes("med")) return "med";
  return "low";
}

export function AnalysisHistoryTable() {
  return (
    <section className="mt-5 rounded-xl border border-white/10 bg-[#071225] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-geist text-lg text-zinc-100">Recent Analysis History</h3>
        <p className="text-xs text-zinc-500">28 documents</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-zinc-500">Document</TableHead>
            <TableHead className="text-zinc-500">Analysis Type</TableHead>
            <TableHead className="text-zinc-500">Compliance Score</TableHead>
            <TableHead className="text-zinc-500">Risk Level</TableHead>
            <TableHead className="text-zinc-500">Flags</TableHead>
            <TableHead className="text-zinc-500">Status</TableHead>
            <TableHead className="text-zinc-500">Analyzed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyRows.map((row) => (
            <TableRow key={row[0]} className="border-white/10 hover:bg-[#0a1730]">
              <TableCell className="text-zinc-200">{row[0]}</TableCell>
              <TableCell className="text-zinc-400">{row[1]}</TableCell>
              <TableCell className="text-cyan-300">{row[2]}</TableCell>
              <TableCell>
                <RiskBadge level={severityToLevel(row[3])} />
              </TableCell>
              <TableCell className="text-zinc-300">{row[4]}</TableCell>
              <TableCell className="text-zinc-300">{row[5]}</TableCell>
              <TableCell className="text-zinc-500">{row[6]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
