from pydantic import BaseModel, Field

# ---------------------------------------------------------
# Base Data Contracts
# These models define the standard structures passed
# between agents in the pipeline to avoid free-form text.
# ---------------------------------------------------------

class Evidence(BaseModel):
    """Specific excerpts and locations supporting a finding."""
    quote: str = Field(description="Exact quote from the document.")
    page: str | None = Field(default=None, description="Page number or section if available.")

class Fact(BaseModel):
    """Material fact extracted from the document."""
    title: str = Field(description="Short title for the fact.")
    description: str = Field(description="Detailed description of the fact.")
    evidence: list[Evidence] = Field(default_factory=list, description="Evidence supporting this fact.")

class Control(BaseModel):
    """Security, operational, or financial control identified in the document."""
    name: str = Field(description="Name or title of the control.")
    status: str = Field(description="Status of the control (e.g., active, missing, ineffective).")
    evidence: list[Evidence] = Field(default_factory=list, description="Evidence supporting the control and status.")

# ---------------------------------------------------------
# Agent Output Models
# Each model corresponds to the strictly validated output
# produced by a specific agent.
# ---------------------------------------------------------

class DocumentAnalysis(BaseModel):
    """Output from the Document Analyst containing only grounded facts and controls."""
    facts: list[Fact] = Field(default_factory=list, description="All material facts present in the document.")
    controls: list[Control] = Field(default_factory=list, description="All controls identified in the document.")

class AMLFinding(BaseModel):
    """Anti-money laundering or sanctions red flag."""
    title: str = Field(description="Title of the AML finding.")
    severity: str = Field(description="Severity of the finding (LOW, MEDIUM, HIGH, CRITICAL).")
    description: str = Field(description="Detailed explanation of the risk.")
    evidence: list[Evidence] = Field(default_factory=list, description="Evidence supporting this AML finding.")

class AMLAnalysis(BaseModel):
    """Output from the AML Specialist."""
    findings: list[AMLFinding] = Field(default_factory=list, description="AML, KYC, and sanctions findings.")

class ComplianceIssue(BaseModel):
    """Compliance gap or violation mapped to regulations."""
    title: str = Field(description="Title of the compliance issue.")
    severity: str = Field(description="Severity of the issue (LOW, MEDIUM, HIGH, CRITICAL).")
    regulation: str = Field(description="The specific regulation or rule violated. State uncertainty if unknown.")
    description: str = Field(description="Detailed explanation of the compliance gap.")
    evidence: list[Evidence] = Field(default_factory=list, description="Evidence supporting this compliance issue.")

class ComplianceAnalysis(BaseModel):
    """Output from the Compliance Officer."""
    issues: list[ComplianceIssue] = Field(default_factory=list, description="Evidence-backed compliance issues.")

class AuditFlag(BaseModel):
    """Control failure or audit concern."""
    title: str = Field(description="Title of the audit flag.")
    severity: str = Field(description="Severity (LOW, MEDIUM, HIGH, CRITICAL).")
    description: str = Field(description="Detailed explanation of the control failure or concern.")
    evidence: list[Evidence] = Field(default_factory=list, description="Evidence supporting this audit flag.")

class FinancialRisk(BaseModel):
    """Financial exposure or business risk."""
    title: str = Field(description="Title of the financial risk.")
    severity: str = Field(description="Severity (LOW, MEDIUM, HIGH, CRITICAL).")
    impact: str = Field(description="Description of the business or financial impact.")
    evidence: list[Evidence] = Field(default_factory=list, description="Evidence supporting this financial risk.")

class Recommendation(BaseModel):
    """Proposed remediation action."""
    title: str = Field(description="Title of the recommendation.")
    priority: str = Field(description="Priority for remediation (LOW, MEDIUM, HIGH, CRITICAL).")
    description: str = Field(description="Detailed steps for remediation.")
    related_issue: str = Field(description="The finding or issue this recommendation addresses.")

class AuditAnalysis(BaseModel):
    """Output from the Risk Auditor."""
    financial_risks: list[FinancialRisk] = Field(default_factory=list, description="Identified financial risks.")
    audit_flags: list[AuditFlag] = Field(default_factory=list, description="Identified audit flags.")
    recommendations: list[Recommendation] = Field(default_factory=list, description="Prioritized recommendations.")
