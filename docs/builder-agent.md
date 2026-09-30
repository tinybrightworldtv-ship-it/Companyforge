# Builder Agent

The Builder Agent converts an approved WebsiteSpec into a Next.js App Router build plan and project artifacts.

## Guardrails
- It cannot claim deployment from code generation.
- It cannot mark generated images or 3D assets ready without provider evidence.
- It must preserve the approved website acceptance criteria.
- Secrets stay server-side.
- High-impact production actions remain subject to CompanyForge governance.

## Pipeline
WebsiteSpec → BuildPlan → generated files → real build/test → preview → QA/Critic → approval → deployment.