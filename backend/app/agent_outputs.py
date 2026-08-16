from pydantic import BaseModel, Field, field_validator


class Evidence(BaseModel):
    quote: str = Field(..., description="Evidence excerpt (max 300 chars)")
    page: int | None = None

    @field_validator("quote")
    @classmethod
    def cap_quote_length(cls, v: str) -> str:
        if len(v) > 300:
            return v[:297] + "..."
        return v


class Fact(BaseModel):
    title: str
    description: str
    evidence: Evidence


class Control(BaseModel):
    name: str
    status: str
    evidence: Evidence


class DocumentAnalysis(BaseModel):
    facts: list[Fact] = Field(
        default_factory=list,
        max_length=10,
        description="Maximum 10 material facts from the document",
    )
    controls: list[Control] = Field(
        default_factory=list,
        max_length=10,
        description="Maximum 10 controls/policies mentioned in the document",
    )


class AMLFinding(BaseModel):
    title: str
    description: str
    risk_level: str
    evidence: Evidence


class AMLAnalysis(BaseModel):
    findings: list[AMLFinding] = Field(
        default_factory=list,
        max_length=5,
        description="Maximum 5 material AML/sanctions/KYC findings (empty list if none)",
    )


class ComplianceIssue(BaseModel):
    title: str
    description: str
    severity: str
    regulation: str
    evidence: Evidence


class ComplianceAnalysis(BaseModel):
    issues: list[ComplianceIssue] = Field(
        default_factory=list,
        max_length=5,
        description="Maximum 5 material compliance issues (empty list if none)",
    )


class AuditFinding(BaseModel):
    title: str
    description: str
    severity: str
    evidence: Evidence


class AuditRecommendation(BaseModel):
    title: str
    description: str
    priority: str
    evidence: Evidence


class AuditAnalysis(BaseModel):
    financial_risks: list[AuditFinding] = Field(
        default_factory=list,
        max_length=5,
        description="Maximum 5 material financial risks (empty list if none)",
    )
    audit_flags: list[AuditFinding] = Field(
        default_factory=list,
        max_length=5,
        description="Maximum 5 material audit flags (empty list if none)",
    )
    recommendations: list[AuditRecommendation] = Field(
        default_factory=list,
        max_length=5,
        description="Maximum 5 actionable recommendations (empty list if none)",
    )
