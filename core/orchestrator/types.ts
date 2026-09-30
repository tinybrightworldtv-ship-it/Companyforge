import { AgentTask } from "../agent-runtime/types";

export interface CompanyGoal { company_id: string; objective: string; constraints?: string[]; context?: Record<string, unknown>; }
export interface PlannedTask { task_id: string; parent_task_id?: string | null; objective: string; assigned_agent: string; priority: "low"|"normal"|"high"|"critical"; inputs: Record<string, unknown>; constraints: string[]; dependencies: string[]; expected_outcome: string; approval_required: boolean; }
export interface OrchestrationPlan { plan_id: string; company_id: string; objective: string; rationale: string; tasks: PlannedTask[]; risks: string[]; approvals_needed: string[]; evidence: string[]; }
export interface OrchestratorAgentCatalog { id: string; purpose: string; }
export interface Orchestrator { plan(goal: CompanyGoal): Promise<OrchestrationPlan>; }
export function plannedTaskToAgentTask(task: PlannedTask, companyId: string): AgentTask {
  return { task_id: task.task_id, company_id: companyId, parent_task_id: task.parent_task_id ?? null, objective: task.objective, assigned_agent: task.assigned_agent, priority: task.priority, inputs: task.inputs, constraints: task.constraints, dependencies: task.dependencies, expected_outcome: task.expected_outcome, approval: { required: task.approval_required, status: task.approval_required ? "pending" : "not_required" }, status: "queued" };
}