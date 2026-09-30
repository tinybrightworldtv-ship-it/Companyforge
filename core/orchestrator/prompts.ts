import { CompanyGoal, OrchestratorAgentCatalog } from "./types";
export function buildPlanningPrompt(goal: CompanyGoal, agents: OrchestratorAgentCatalog[]): string {
  const catalog = agents.map(a => ({ id: a.id, purpose: a.purpose }));
  return [
    "You are CompanyForge AI CEO. Decompose the company objective into the smallest useful executable tasks.",
    "Use only agents from the supplied catalog. Never invent agents.",
    "Return JSON only with keys: rationale, tasks, risks, approvals_needed, evidence.",
    "Each task must contain: task_id, objective, assigned_agent, priority, inputs, constraints, dependencies, expected_outcome, approval_required.",
    "Dependencies must reference earlier task IDs.",
    "High-impact, external, irreversible, financial, customer-facing, deployment, or credential-changing work should require approval.",
    `GOAL:\n${JSON.stringify(goal)}`,
    `AGENT CATALOG:\n${JSON.stringify(catalog)}`
  ].join("\n\n");
}