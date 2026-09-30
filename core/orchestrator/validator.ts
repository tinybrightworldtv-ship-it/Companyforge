import { AgentDefinition } from "../agent-runtime/types";
import { OrchestrationPlan, PlannedTask } from "./types";
const priorities = new Set(["low","normal","high","critical"]);
export function validatePlan(plan: OrchestrationPlan, agents: AgentDefinition[]): void {
  if (!plan.company_id || !plan.objective || !Array.isArray(plan.tasks)) throw new Error("Invalid orchestration plan.");
  const allowed = new Set(agents.map(a => a.id)); const ids = new Set<string>();
  for (const task of plan.tasks) { validateTask(task, allowed, ids); ids.add(task.task_id); }
  for (const task of plan.tasks) for (const dep of task.dependencies) { if (!ids.has(dep)) throw new Error(`Unknown task dependency: ${dep}`); if (dep === task.task_id) throw new Error(`Task ${task.task_id} cannot depend on itself.`); }
}
function validateTask(task: PlannedTask, allowed: Set<string>, ids: Set<string>): void {
  if (!task.task_id || ids.has(task.task_id)) throw new Error(`Duplicate or missing task id: ${task.task_id}`);
  if (!allowed.has(task.assigned_agent)) throw new Error(`Unknown assigned agent: ${task.assigned_agent}`);
  if (!task.objective || !task.expected_outcome) throw new Error(`Task ${task.task_id} is missing objective or expected outcome.`);
  if (!priorities.has(task.priority)) throw new Error(`Invalid priority on ${task.task_id}.`);
  if (!Array.isArray(task.constraints) || !Array.isArray(task.dependencies)) throw new Error(`Invalid constraints/dependencies on ${task.task_id}.`);
}