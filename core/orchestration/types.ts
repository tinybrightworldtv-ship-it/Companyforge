import { AgentTask, AgentResult } from "../agent-runtime/types";
export type ExecutionOutcome = "completed" | "failed" | "blocked" | "awaiting_approval";
export interface TaskExecutionRecord { taskId: string; attempts: number; outcome: ExecutionOutcome; result?: AgentResult; error?: string; }
export interface OrchestrationRun { runId: string; companyId: string; rootTaskId?: string; records: TaskExecutionRecord[]; status: "completed" | "failed" | "blocked"; }
