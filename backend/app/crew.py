import time
from datetime import datetime

from crewai import Agent, Crew, LLM, Process, Task

from .config import Settings
from .schemas import AgentTrace, ComplianceReport, CrewMetrics
from .agent_outputs import (
    DocumentAnalysis,
    AMLAnalysis,
    ComplianceAnalysis,
    AuditAnalysis,
)


def build_compliance_crew(
    *,
    document_title: str,
    prompt: str,
    related_reports: list[str],
    settings: Settings,
    document_analyst_context: str,
    compliance_officer_context: str,
) -> Crew:
    """Build the five-role crew and a final task that emits the frontend report schema."""
    # LiteLLM reads GOOGLE_API_KEY from the environment for Gemini.
    # Do not pass an Ollama base_url when using a hosted provider.
    llm = LLM(
        model=settings.crewai_model,
        temperature=settings.crewai_temperature,
    )

    report_memory = "\n\n".join(
        f"Historical report {index + 1} (reference only):\n{report}"
        for index, report in enumerate(related_reports)
    ) or "No related historical reports were retrieved."

    document_analyst = Agent(
        role="Document Analyst",
        goal="Extract material facts, entities, dates, controls, and document-grounded evidence.",
        backstory="You are a meticulous financial-document reviewer. Never invent text that is absent from the document.",
        llm=llm,
        allow_delegation=False,
        verbose=False,
    )

    aml_specialist = Agent(
        role="AML Specialist",
        goal="Identify anti-money-laundering and sanctions red flags from the structured documented facts.",
        backstory="You assess AML/KYC, sanctions, transaction-monitoring, and suspicious-activity concerns using only the structured facts and controls provided to you.",
        llm=llm,
        allow_delegation=False,
        verbose=False,
    )

    compliance_officer = Agent(
        role="Compliance Officer",
        goal="Identify material regulatory compliance gaps supported by documented evidence.",
        backstory="You write precise, evidence-backed regulatory assessments. You focus only on material compliance gaps and state uncertainty when jurisdiction is unclear. You rely on structured facts and retrieved compliance context.",
        llm=llm,
        allow_delegation=False,
        verbose=False,
    )

    risk_auditor = Agent(
        role="Risk Auditor",
        goal="Synthesize structured specialist findings into financial risks, audit flags, and recommendations.",
        backstory="You are an internal audit professional who ranks risk from documented evidence and avoids unsupported conclusions. You synthesize upstream findings; you do not re-analyze the source document.",
        llm=llm,
        allow_delegation=False,
        verbose=False,
    )

    manager = Agent(
        role="Manager",
        goal="Synthesize specialist findings into one validated, decision-ready compliance report.",
        backstory="You manage compliance reviews. You merge duplicated findings, remove conflicts, discard unsupported items, and ensure every finding has evidence. You consume only compact structured specialist outputs.",
        llm=llm,
        allow_delegation=False,
        verbose=False,
    )

    document_task = Task(
        description=f"""Review the retrieved document excerpts below. Extract ONLY material facts directly present in the excerpts.

CRITICAL CONSTRAINTS:
- Extract MAXIMUM 10 material facts (fewer if fewer material facts exist)
- Extract MAXIMUM 10 controls/policies (fewer if fewer controls exist)
- Focus on facts relevant to: compliance, risk, regulatory obligations, controls, financial exposure
- IGNORE ordinary administrative text (board composition, committee names, standard disclaimers, generic employment terms)
- IGNORE informational text that does not represent a material fact, obligation, or control
- Never infer facts not explicitly stated in the excerpts
- Never speculate or assume risks
- Each evidence quote must be ≤ 300 characters and directly quoted from the excerpts
- Include page number in evidence when available from [Page N] markers
- Return empty lists rather than inventing findings

Document title: {document_title}
Requested analysis: {prompt}

{document_analyst_context}

Output format: Return ONLY valid structured JSON matching the DocumentAnalysis schema.""",
        expected_output="A JSON object with 'facts' (max 10) and 'controls' (max 10), each with evidence. Empty lists if no material facts/controls found.",
        agent=document_analyst,
        output_pydantic=DocumentAnalysis,
    )

    aml_task = Task(
        description="""Assess the provided DocumentAnalysis for MATERIAL AML, KYC, sanctions, and suspicious-activity risks.

STRICT REQUIREMENTS:
- Identify ONLY material risks directly supported by facts/controls in the DocumentAnalysis
- Do NOT invent risks
- Do NOT reread the original document
- Return MAXIMUM 5 findings (return fewer if fewer material findings exist; return empty list [] if none)

EXCLUDE (these are NOT AML findings):
- Board composition, member names, or terms of office
- Generic employment provisions or benefits
- Standard legal disclaimers
- Administrative procedures
- Corporate governance boilerplate
- Routine compliance mentions without a material gap
- Committee membership details
- Standard regulatory language

INCLUDE (material AML findings):
- Missing or weak KYC procedures
- Gaps in customer due diligence
- Absence of AML/CFT policies
- Suspicious transaction patterns mentioned in facts
- Sanctions screening failures or gaps
- Inadequate beneficial ownership documentation
- Transaction monitoring deficiencies
- Correspondent banking risks
- PEP identification gaps
- Sanctions list matching issues

For each finding provide:
- title (concise)
- description (evidence-backed)
- risk_level: LOW, MEDIUM, HIGH, or CRITICAL
- evidence quote (max 300 chars) from DocumentAnalysis facts/controls with page when available

Output: JSON with 'findings' array. Return empty array if no material AML risks found.""",
        expected_output="JSON with maximum 5 material AML findings, or empty findings array if none found.",
        agent=aml_specialist,
        context=[document_task],
        output_pydantic=AMLAnalysis,
        async_execution=True,
    )

    compliance_task = Task(
        description=f"""Assess the DocumentAnalysis and retrieved compliance context for MATERIAL compliance gaps only.

STRICT REQUIREMENTS:
- Identify ONLY material compliance issues supported by evidence in DocumentAnalysis and retrieved context
- Do NOT invent regulations, page numbers, evidence, or risks
- Do NOT reread the full original document
- Return MAXIMUM 5 issues (return fewer if fewer material issues exist; return empty list [] if none)
- NEVER generate findings simply to reach the limit

FOCUS ON:
- regulatory compliance gaps
- missing controls
- policy failures
- regulatory violations
- material implementation weaknesses
- unsupported/missing compliance requirements

IGNORE:
- generic legal language
- administrative provisions
- board/committee composition unless directly relevant to compliance risk
- informational provisions
- duplicate findings
- low-value observations
- facts that do not represent a compliance gap

For each issue provide:
- title (concise)
- description (evidence-backed)
- severity: LOW, MEDIUM, HIGH, or CRITICAL
- regulation/reference ONLY when explicitly supported by the evidence (use "Uncertain" if jurisdiction/rule is unclear)
- evidence quote (max 300 chars) with page when available

{compliance_officer_context}

Output: JSON with 'issues' array. Return empty array if no material compliance issues found.""",
        expected_output="JSON with maximum 5 material compliance issues, or empty issues array if none found.",
        agent=compliance_officer,
        context=[document_task],
        output_pydantic=ComplianceAnalysis,
        async_execution=True,
    )

    audit_task = Task(
        description="""Synthesize the AMLAnalysis and ComplianceAnalysis into material audit outputs.

PURPOSE: Synthesis only. Do NOT re-read or re-analyze the source document.

STRICT REQUIREMENTS:
- Use ONLY the structured findings in AMLAnalysis and ComplianceAnalysis
- Return MAXIMUM 5 financial_risks, MAXIMUM 5 audit_flags, MAXIMUM 5 recommendations
- Return fewer items when fewer material items exist; empty arrays are valid
- Prioritize CRITICAL > HIGH > MEDIUM > LOW
- Do NOT create findings from trivial observations
- Every item must trace to upstream evidence quotes
- Recommendations must be concise and actionable

For each financial_risk and audit_flag provide:
- title, description, severity (LOW/MEDIUM/HIGH/CRITICAL), evidence (quote + page from upstream findings)

For each recommendation provide:
- title, description, priority (LOW/MEDIUM/HIGH/CRITICAL), evidence (quote + page from upstream findings)

Output: JSON matching AuditAnalysis schema.""",
        expected_output="JSON with up to 5 financial risks, 5 audit flags, and 5 recommendations, all evidence-backed.",
        agent=risk_auditor,
        context=[aml_task, compliance_task],
        output_pydantic=AuditAnalysis,
    )

    report_task = Task(
        description=f"""Create the final report for '{document_title}' by synthesizing compact specialist outputs only.

You receive AMLAnalysis, ComplianceAnalysis, and AuditAnalysis. Do NOT perform another full document analysis.

Responsibilities:
- Executive Summary (concise)
- Overall Risk Score (0-100) and risk_level
- Key Insights (MAXIMUM 8, prioritize CRITICAL/HIGH)
- Financial Risks (from AuditAnalysis, prioritized)
- Compliance Issues (from ComplianceAnalysis, prioritized)
- Audit Flags (from AuditAnalysis)
- Recommendations (from AuditAnalysis)
- Evidence/Citations for every item

Rules:
- key_insights: MAXIMUM 8 (prioritize CRITICAL/HIGH)
- financial_risks: MAXIMUM 5
- compliance_issues: MAXIMUM 5
- audit_flags: MAXIMUM 5
- recommendations: MAXIMUM 5
- Do NOT exceed these limits; prefer highest-severity items
- Remove conflicting or unsupported findings
- Prefer evidence-backed findings when specialists disagree
- Set analysis_type to a concise description of: {prompt}
- Scores must be whole numbers from 0 to 100
- Use only LOW, MEDIUM, HIGH, or CRITICAL for severity and priority
- Avoid repeating the same evidence multiple times
- Avoid long explanations
- Use 'Not Found' where the document does not support a value
- Empty arrays are valid when no material findings exist
- Return ONLY a valid ComplianceReport JSON object

Related historical reports are reference material only:
{report_memory}""",
        expected_output="A fully populated structured ComplianceReport JSON object.",
        agent=manager,
        context=[aml_task, compliance_task, audit_task],
        output_pydantic=ComplianceReport,
    )

    return Crew(
        agents=[document_analyst, aml_specialist, compliance_officer, risk_auditor, manager],
        tasks=[document_task, aml_task, compliance_task, audit_task, report_task],
        process=Process.sequential,
        verbose=True,
    )


def _count_findings_and_evidence(pydantic_obj: object) -> tuple[int, int]:
    """Dynamically count findings and nested evidence in the structured outputs."""
    findings_count = 0
    evidence_count = 0
    if not pydantic_obj:
        return 0, 0

    for list_name in ["findings", "issues", "financial_risks", "audit_flags", "recommendations", "facts", "controls"]:
        items = getattr(pydantic_obj, list_name, [])
        findings_count += len(items)
        for item in items:
            item_evidence = getattr(item, "evidence", None)
            if item_evidence is not None:
                evidence_count += 1

    for report_list in ["key_insights", "financial_risks", "compliance_issues", "audit_flags", "recommendations"]:
        items = getattr(pydantic_obj, report_list, [])
        if items and not getattr(pydantic_obj, "facts", None):
            findings_count += len(items)
            for item in items:
                excerpts = getattr(item, "source_excerpts", [])
                evidence_count += len(excerpts)

    return findings_count, evidence_count


def _agent_perf_key(agent_role: str) -> str:
    mapping = {
        "Document Analyst": "document_analyst",
        "AML Specialist": "aml_specialist",
        "Compliance Officer": "compliance_officer",
        "Risk Auditor": "risk_auditor",
        "Manager": "manager",
    }
    return mapping.get(agent_role, agent_role.lower().replace(" ", "_"))


def _build_agent_trace(crew: Crew) -> list[AgentTrace]:
    """Map CrewAI task lifecycle timestamps and outputs to the public trace contract."""

    trace: list[AgentTrace] = []
    for task in crew.tasks:
        started = task.start_time
        finished = task.end_time
        duration = 0.0
        started_at = None
        finished_at = None

        if started is not None:
            started_at = started.isoformat()
        if finished is not None:
            finished_at = finished.isoformat()

        if started is not None and finished is not None:
            duration = max(0.0, round((finished - started).total_seconds(), 3))

        output = task.output
        evidence_count = 0
        findings_count = 0

        if output is not None and getattr(output, "pydantic", None) is not None:
            findings_count, evidence_count = _count_findings_and_evidence(output.pydantic)

        short_summary = (
            f"Task completed in {duration}s. "
            f"Identified {findings_count} entities/findings and {evidence_count} evidence items."
        )

        trace.append(
            AgentTrace(
                agent=getattr(task.agent, "role", "Unknown agent"),
                task=getattr(task, "description", "").split(".")[0][:100],
                status="completed" if output is not None else "failed",
                started_at=started_at,
                finished_at=finished_at,
                duration=duration,
                duration_seconds=duration,
                evidence_count=evidence_count,
                findings_count=findings_count,
                summary=short_summary,
            )
        )
    return trace


def _build_crew_metrics(trace: list[AgentTrace]) -> CrewMetrics:
    if not trace:
        return CrewMetrics(
            crew_total_duration_seconds=0.0,
            average_agent_duration_seconds=0.0,
            slowest_agent="N/A",
            fastest_agent="N/A",
            total_findings=0,
            total_evidence=0,
        )

    durations = [t.duration for t in trace]
    total_findings = sum(t.findings_count for t in trace)
    total_evidence = sum(t.evidence_count for t in trace)

    try:
        start_times = [datetime.fromisoformat(t.started_at) for t in trace if t.started_at]
        end_times = [datetime.fromisoformat(t.finished_at) for t in trace if t.finished_at]
        if start_times and end_times:
            total_duration = (max(end_times) - min(start_times)).total_seconds()
        else:
            total_duration = sum(durations)
    except Exception:
        total_duration = sum(durations)

    avg_duration = sum(durations) / len(durations) if durations else 0.0

    sorted_by_duration = sorted(trace, key=lambda item: item.duration)
    fastest = sorted_by_duration[0].agent if sorted_by_duration else "N/A"
    slowest = sorted_by_duration[-1].agent if sorted_by_duration else "N/A"

    return CrewMetrics(
        crew_total_duration_seconds=round(max(0.0, total_duration), 3),
        average_agent_duration_seconds=round(max(0.0, avg_duration), 3),
        slowest_agent=slowest,
        fastest_agent=fastest,
        total_findings=total_findings,
        total_evidence=total_evidence,
    )


def _log_output_metrics(report: ComplianceReport, document_analysis: DocumentAnalysis | None) -> None:
    document_facts = len(document_analysis.facts) if document_analysis else 0
    document_controls = len(document_analysis.controls) if document_analysis else 0
    print(
        "[METRICS] "
        f"document_facts={document_facts} "
        f"document_controls={document_controls} "
        f"key_insights={len(report.key_insights)} "
        f"financial_risks={len(report.financial_risks)} "
        f"compliance_issues={len(report.compliance_issues)} "
        f"audit_flags={len(report.audit_flags)} "
        f"recommendations={len(report.recommendations)}"
    )


async def run_compliance_crew(
    *,
    document_title: str,
    prompt: str,
    related_reports: list[str],
    settings: Settings,
    document_analyst_context: str,
    compliance_officer_context: str,
) -> tuple[ComplianceReport, list[AgentTrace], CrewMetrics]:
    workflow_start = time.perf_counter()

    crew = build_compliance_crew(
        document_title=document_title,
        prompt=prompt,
        related_reports=related_reports,
        settings=settings,
        document_analyst_context=document_analyst_context,
        compliance_officer_context=compliance_officer_context,
    )

    try:
        await crew.kickoff_async()
    except Exception:
        import traceback

        traceback.print_exc()
        raise

    report_task = crew.tasks[-1]
    if getattr(report_task.output, "pydantic", None) is not None:
        report = report_task.output.pydantic
    else:
        report = ComplianceReport.model_validate_json(report_task.output.raw)

    trace = _build_agent_trace(crew)
    metrics = _build_crew_metrics(trace)

    document_analysis: DocumentAnalysis | None = None
    if getattr(crew.tasks[0].output, "pydantic", None) is not None:
        document_analysis = crew.tasks[0].output.pydantic

    for entry in trace:
        print(f"[PERF] {_agent_perf_key(entry.agent)}={entry.duration:.3f}s")

    total_seconds = time.perf_counter() - workflow_start
    print(f"[PERF] total={total_seconds:.3f}s")
    _log_output_metrics(report, document_analysis)

    return report, trace, metrics
