"""Compact structured summaries for downstream agent prompts."""

from __future__ import annotations

from .agent_outputs import (
    AMLAnalysis,
    AuditAnalysis,
    ComplianceAnalysis,
    DocumentAnalysis,
    Evidence,
)


def _format_evidence(evidence: Evidence | None) -> str:
    if evidence is None:
        return "evidence: none"
    page = f"p.{evidence.page}" if evidence.page is not None else "p.?"
    return f'"{evidence.quote}" ({page})'


def compact_document_analysis(analysis: DocumentAnalysis | None) -> str:
    if analysis is None:
        return "DocumentAnalysis: (not available)"

    lines = ["DocumentAnalysis summary:"]
    for index, fact in enumerate(analysis.facts, start=1):
        lines.append(
            f"  Fact {index}: {fact.title} | {fact.description} | {_format_evidence(fact.evidence)}"
        )
    for index, control in enumerate(analysis.controls, start=1):
        lines.append(
            f"  Control {index}: {control.name} [{control.status}] | {_format_evidence(control.evidence)}"
        )
    if not analysis.facts and not analysis.controls:
        lines.append("  (no material facts or controls)")
    return "\n".join(lines)


def compact_aml_analysis(analysis: AMLAnalysis | None) -> str:
    if analysis is None or not analysis.findings:
        return "AMLAnalysis: (no material AML findings)"

    lines = ["AMLAnalysis findings:"]
    for index, finding in enumerate(analysis.findings, start=1):
        lines.append(
            f"  {index}. [{finding.risk_level}] {finding.title} — {finding.description} | "
            f"{_format_evidence(finding.evidence)}"
        )
    return "\n".join(lines)


def compact_compliance_analysis(analysis: ComplianceAnalysis | None) -> str:
    if analysis is None or not analysis.issues:
        return "ComplianceAnalysis: (no material compliance issues)"

    lines = ["ComplianceAnalysis issues:"]
    for index, issue in enumerate(analysis.issues, start=1):
        lines.append(
            f"  {index}. [{issue.severity}] {issue.title} — {issue.description} | "
            f"reg: {issue.regulation} | {_format_evidence(issue.evidence)}"
        )
    return "\n".join(lines)


def compact_audit_analysis(analysis: AuditAnalysis | None) -> str:
    if analysis is None:
        return "AuditAnalysis: (not available)"

    lines = ["AuditAnalysis summary:"]
    if analysis.financial_risks:
        lines.append("  Financial risks:")
        for index, risk in enumerate(analysis.financial_risks, start=1):
            lines.append(
                f"    {index}. [{risk.severity}] {risk.title} — {risk.description} | "
                f"{_format_evidence(risk.evidence)}"
            )
    if analysis.audit_flags:
        lines.append("  Audit flags:")
        for index, flag in enumerate(analysis.audit_flags, start=1):
            lines.append(
                f"    {index}. [{flag.severity}] {flag.title} — {flag.description} | "
                f"{_format_evidence(flag.evidence)}"
            )
    if analysis.recommendations:
        lines.append("  Recommendations:")
        for index, rec in enumerate(analysis.recommendations, start=1):
            lines.append(
                f"    {index}. [{rec.priority}] {rec.title} — {rec.description} | "
                f"{_format_evidence(rec.evidence)}"
            )
    if not analysis.financial_risks and not analysis.audit_flags and not analysis.recommendations:
        lines.append("  (no material audit findings)")
    return "\n".join(lines)
