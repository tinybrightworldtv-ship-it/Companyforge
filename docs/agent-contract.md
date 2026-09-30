# CompanyForge Agent Contract v0.1

## Purpose

Every CompanyForge agent must operate through a common contract so agents can collaborate safely and predictably.

## Required identity

Each agent defines:
- id
- name
- role
- purpose
- version
- owner or supervising agent

## Required capabilities

Each agent declares:
- allowed tools
- allowed data sources
- allowed repositories or project scopes
- read permissions
- write permissions
- external-action permissions

## Required inputs

An agent receives a structured task containing:
- company_id
- task_id
- objective
- context
- constraints
- expected outcome
- approval state
- deadline or priority when applicable

## Required outputs

An agent returns:
- status
- summary
- evidence
- artifacts created or changed
- proposed next actions
- risks or blockers
- approval required
- audit metadata

## Permission levels

### READ
May inspect approved data and repositories.

### WRITE
May create or modify approved artifacts within its scope.

### EXECUTE
May trigger approved workflows or external actions.

### HIGH_IMPACT
Actions involving money, production changes, customer communication, credentials, destructive operations, or other consequential changes require explicit approval unless a narrowly defined autonomy policy authorizes them.

## Safety rules

1. Least privilege by default.
2. Never expose secrets in agent output, commits, logs, or prompts.
3. Never claim an action succeeded without tool evidence.
4. Preserve an audit trail for consequential actions.
5. Prefer reversible changes.
6. Escalate ambiguous or high-impact actions.
7. Agents must remain within their declared scope.
8. QA/Critic review should be used for changes where policy requires it.

## Collaboration

Agents communicate through structured tasks and artifacts rather than relying on hidden state.

The AI CEO/Orchestrator assigns work, tracks dependencies, resolves conflicts, and escalates decisions.

## Versioning

Changes to this contract require review because the contract defines the operating boundary for the agent workforce.
