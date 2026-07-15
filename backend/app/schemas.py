from enum import Enum

from pydantic import BaseModel, Field


class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class SourceExcerpt(BaseModel):
    text: str
    page_number: str | None = None


class FindingEvidence(BaseModel):
    matched_document_text: str
    matched_regulation: str
    selection_reason: str
    retrieved_context: str
    source_excerpts: list[SourceExcerpt] = Field(default_factory=list)


class KeyInsight(FindingEvidence):
    title: str
    description: str
    severity: Severity
    confidence_score: int | None = Field(default=None, ge=0, le=100)


class FinancialRisk(KeyInsight):
    business_impact: str
    financial_exposure: str
    regulation: str


class ComplianceIssue(KeyInsight):
    regulation: str


class AuditFlag(KeyInsight):
    control: str


class Recommendation(FindingEvidence):
    title: str
    description: str
    priority: Severity
    timeline: str


class ComplianceReport(BaseModel):
    """Canonical report shape consumed by the existing frontend."""

    document_title: str
    analysis_type: str
    risk_score: int = Field(ge=0, le=100)
    risk_level: Severity
    confidence_score: int = Field(ge=0, le=100)
    executive_summary: str
    key_insights: list[KeyInsight] = Field(default_factory=list)
    financial_risks: list[FinancialRisk] = Field(default_factory=list)
    compliance_issues: list[ComplianceIssue] = Field(default_factory=list)
    audit_flags: list[AuditFlag] = Field(default_factory=list)
    recommendations: list[Recommendation] = Field(default_factory=list)


class CrewMetrics(BaseModel):
    crew_total_duration_seconds: float = Field(ge=0)
    average_agent_duration_seconds: float = Field(ge=0)
    slowest_agent: str
    fastest_agent: str
    total_findings: int = Field(ge=0)
    total_evidence: int = Field(ge=0)


class AgentTrace(BaseModel):
    """Execution metadata for one CrewAI agent task; durations are measured in seconds."""

    agent: str
    task: str = ""
    status: str
    started_at: str | None = None
    finished_at: str | None = None
    duration: float = Field(ge=0)
    duration_seconds: float = Field(default=0.0, ge=0)
    evidence_count: int = Field(default=0, ge=0)
    findings_count: int = Field(default=0, ge=0)
    summary: str


class AnalysisResponse(BaseModel):
    success: bool = True
    platform: str = "crewai"
    analysis_type: str
    report: ComplianceReport
    request_id: str
    agent_trace: list[AgentTrace] = Field(default_factory=list)
    crew_metrics: CrewMetrics | None = None
