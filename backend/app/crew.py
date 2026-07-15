import re
import json
from datetime import datetime
from crewai import Agent, Crew, LLM, Process, Task

from .config import Settings
from .schemas import AgentTrace, ComplianceReport, CrewMetrics
from .agent_outputs import (
    DocumentAnalysis,
    AMLAnalysis,
    ComplianceAnalysis,
    AuditAnalysis
)


def build_compliance_crew(
    *, document_title: str, document_text: str, prompt: str, related_reports: list[str], settings: Settings
) -> Crew:
    """Build the five-role crew and a final task that emits the frontend report schema."""

    llm = LLM(model=settings.crewai_model, temperature=settings.crewai_temperature)
    document_context = f"""
Document title: {document_title}
Requested analysis: {prompt}

Document text:
{document_text}
"""
    report_memory = "\n\n".join(
        f"Historical report {index + 1} (reference only):\n{report}"
        for index, report in enumerate(related_reports)
    ) or "No related historical reports were retrieved."

    # ---------------------------------------------------------
    # AGENTS
    # ---------------------------------------------------------
    document_analyst = Agent(
        role="Document Intelligence Analyst",
        goal="Extract material facts, entities, dates, controls, and document-grounded evidence.",
        backstory="You are a meticulous financial-document reviewer. Only extract information explicitly present in the document. Never infer. Never summarize. Never generate opinions. Return only structured output.",
        llm=llm,
        allow_delegation=False,
        verbose=False,
    )
    
    aml_specialist = Agent(
        role="AML Investigation Specialist",
        goal="Identify anti-money-laundering and sanctions red flags from the structured documented facts.",
        backstory="Consume ONLY the structured output from the Document Intelligence Analyst. Never reread the document unless absolutely required. Identify AML risks, KYC gaps, Sanctions failures, Suspicious transactions, Structuring, Money laundering indicators, Missing SAR filings, PEP issues, and High-risk jurisdictions. Every finding MUST contain evidence.",
        llm=llm,
        allow_delegation=False,
        verbose=False,
    )
    
    compliance_officer = Agent(
        role="Regulatory Compliance Officer",
        goal="Map evidence to applicable compliance obligations and identify gaps based on structured analysis.",
        backstory="Consume Document Analysis and AML Analysis. Identify Compliance issues, Regulatory gaps, Missing controls, Missing documentation, and Control weaknesses. Never invent regulations. If jurisdiction is uncertain, state uncertainty. Every issue must include supporting evidence.",
        llm=llm,
        allow_delegation=False,
        verbose=False,
    )
    
    risk_auditor = Agent(
        role="Financial Risk Auditor",
        goal="Assess control effectiveness, financial exposure, audit flags, and remediation priority based on previous analyses.",
        backstory="Consume Document Analysis, AML Analysis, and Compliance Analysis. Generate Financial risks, Audit flags, Operational risks, Business impact, and Recommendations. Every finding must include evidence.",
        llm=llm,
        allow_delegation=False,
        verbose=False,
    )
    
    manager = Agent(
        role="Compliance Review Manager",
        goal="Synthesize specialist findings into one validated, decision-ready compliance report.",
        backstory="The Manager MUST NOT analyze the document. The Manager ONLY receives Document Analysis, AML Analysis, Compliance Analysis, Audit Analysis, and Historical Report Memory. Responsibilities: Merge duplicate findings. Remove conflicting findings. Discard unsupported findings. Ensure every finding has evidence. Ensure every recommendation maps to an issue. Ensure every field of ComplianceReport is populated. Never invent facts. Never invent evidence. Never generate unsupported findings. Return ONLY a valid ComplianceReport.",
        llm=llm,
        allow_delegation=False,
        verbose=False,
    )

    # ---------------------------------------------------------
    # TASKS
    # ---------------------------------------------------------
    document_task = Task(
        description=f"""Review the source document below. Only extract information explicitly present in the document.
Extract ONLY:
- Financial controls
- Internal controls
- KYC information
- Customer Due Diligence
- Enhanced Due Diligence
- AML observations
- Transaction monitoring events
- High-value transactions
- Suspicious activities
- PEP references
- Sanctions references
- Access controls
- Approval workflows
- Audit observations
- Regulatory references
- Policy violations
- Supporting evidence
- Exact document excerpts
- Page numbers when available

Rules:
Never infer. Never summarize. Never generate opinions. Return only structured output.

Document context:
{document_context}""",
        expected_output="Document facts, entities, controls, and evidence excerpts relevant to compliance analysis.",
        agent=document_analyst,
        output_pydantic=DocumentAnalysis,
    )
    
    aml_task = Task(
        description="Consume ONLY the structured output from the Document Intelligence Analyst. Identify AML risks, KYC gaps, Sanctions failures, Suspicious transactions, Structuring, Money laundering indicators, Missing SAR filings, PEP issues, and High-risk jurisdictions. Every finding MUST contain evidence.",
        expected_output="Evidence-backed AML findings, risk levels, and recommended actions.",
        agent=aml_specialist,
        context=[document_task],
        output_pydantic=AMLAnalysis,
        async_execution=True,
    )
    
    compliance_task = Task(
        description="Consume Document Analysis and AML Analysis. Identify Compliance issues, Regulatory gaps, Missing controls, Missing documentation, and Control weaknesses. Never invent regulations. If jurisdiction is uncertain, state uncertainty. Every issue must include supporting evidence.",
        expected_output="Evidence-backed compliance issues and relevant regulations or control requirements.",
        agent=compliance_officer,
        context=[document_task],
        output_pydantic=ComplianceAnalysis,
        async_execution=True,
    )
    
    audit_task = Task(
        description="Consume Document Analysis, AML Analysis, and Compliance Analysis. Generate Financial risks, Audit flags, Operational risks, Business impact, and Recommendations. Every finding must include evidence.",
        expected_output="Audit flags, financial risks, confidence assessments, and prioritized remediation observations.",
        agent=risk_auditor,
        context=[document_task, aml_task, compliance_task],
        output_pydantic=AuditAnalysis,
    )
    
    report_task = Task(
        description=f"""Synthesize specialist findings into one validated, decision-ready compliance report.
        
Responsibilities:
- Merge duplicated findings.
- Remove conflicting findings.
- Discard unsupported findings.
- Ensure every finding has evidence.
- Ensure every recommendation maps to an issue.
- Ensure every field of ComplianceReport is populated.
- Never invent facts.
- Never invent evidence.
- Never generate unsupported findings.
- Return ONLY a valid ComplianceReport.

Rules:
- Set analysis_type to a concise description of the requested analysis.
- Scores must be whole numbers from 0 to 100.
- Use only LOW, MEDIUM, HIGH, or CRITICAL for severity and priority.
- Every finding and recommendation must include all evidence fields. Use 'Not Found' where the document does not support a value.
- Include only evidence-backed findings; empty arrays are valid.
- Return ONLY a valid ComplianceReport. Do not include Markdown or any text outside the structured report.

Historical report memory (optional):
{report_memory}
""",
        expected_output="A fully populated structured ComplianceReport JSON object.",
        agent=manager,
        context=[document_task, aml_task, compliance_task, audit_task],
        output_pydantic=ComplianceReport,
    )

    return Crew(
        agents=[document_analyst, aml_specialist, compliance_officer, risk_auditor, manager],
        tasks=[document_task, aml_task, compliance_task, audit_task, report_task],
        process=Process.sequential,
        verbose=False,
    )


def _count_findings_and_evidence(pydantic_obj: any) -> tuple[int, int]:
    """Dynamically count findings and nested evidence in the structured outputs."""
    findings_count = 0
    evidence_count = 0
    if not pydantic_obj:
        return 0, 0
    
    # Lists in intermediate Pydantic models
    for list_name in ["findings", "issues", "financial_risks", "audit_flags", "recommendations", "facts", "controls"]:
        items = getattr(pydantic_obj, list_name, [])
        findings_count += len(items)
        for item in items:
            evidence = getattr(item, "evidence", [])
            evidence_count += len(evidence)
            
    # Final compliance report lists
    for report_list in ["key_insights", "financial_risks", "compliance_issues", "audit_flags", "recommendations"]:
        items = getattr(pydantic_obj, report_list, [])
        if items and not getattr(pydantic_obj, "facts", None): # only count if it's the final report shape
            findings_count += len(items)
            for item in items:
                excerpts = getattr(item, "source_excerpts", [])
                evidence_count += len(excerpts)
            
    return findings_count, evidence_count


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
        
        if output is not None:
            if getattr(output, "pydantic", None) is not None:
                findings_count, evidence_count = _count_findings_and_evidence(output.pydantic)
        
        short_summary = f"Task completed in {duration}s. Identified {findings_count} entities/findings and {evidence_count} evidence items."
        
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
    
    sorted_by_duration = sorted(trace, key=lambda x: x.duration)
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


def run_compliance_crew(
    *, document_title: str, document_text: str, prompt: str, related_reports: list[str], settings: Settings
) -> tuple[ComplianceReport, list[AgentTrace], CrewMetrics]:
    crew = build_compliance_crew(
        document_title=document_title,
        document_text=document_text,
        prompt=prompt,
        related_reports=related_reports,
        settings=settings,
    )
    result = crew.kickoff()

    if isinstance(result.pydantic, ComplianceReport):
        report = result.pydantic
    else:
        report = ComplianceReport.model_validate_json(result.raw)
        
    trace = _build_agent_trace(crew)
    metrics = _build_crew_metrics(trace)
    return report, trace, metrics
