export type PermissionLevel = "READ" | "WRITE" | "EXECUTE" | "HIGH_IMPACT";

export type TaskStatus =
  | "queued"
  | "running"
  | "blocked"
  | "awaiting_approval"
  | "completed"
  | "failed"
  | "cancelled";

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  status: string;
  purpose: string;
}

export interface AgentPolicy {
  allowed_levels: PermissionLevel[];
  can_delegate?: boolean;
  can_approve_high_impact?: boolean;
}

export interface AgentTask {
  task_id: string;
  company_id: string;
  parent_task_id?: string | null;
  objective: string;
  assigned_agent: string;
  priority?: "low" | "normal" | "high" | "critical";
  inputs: Record<string, unknown>;
  constraints?: string[];
  dependencies?: string[];
  expected_outcome: string;
  approval?: {
    required: boolean;
    status: "not_required" | "pending" | "approved" | "rejected";
    approval_id?: string;
  };
  status: TaskStatus;
}

export interface AgentContext {
  task: AgentTask;
  agent: AgentDefinition;
  policy: AgentPolicy;
}

export interface AgentResult {
  status: "completed" | "failed" | "blocked" | "awaiting_approval";
  summary: string;
  evidence: string[];
  artifacts: string[];
  next_actions: string[];
  risks: string[];
  approval_required: boolean;
  audit_event_id: string;
}

export interface AuditEvent {
  event_id: string;
  timestamp: string;
  company_id: string;
  agent_id: string;
  task_id: string;
  action: string;
  permission_level: PermissionLevel;
  scope: string;
  approval_id: string | null;
  result: "success" | "failure" | "blocked";
  evidence: string[];
  error: string | null;
}

export type AgentHandler = (context: AgentContext) => Promise<{
  summary: string;
  evidence?: string[];
  artifacts?: string[];
  next_actions?: string[];
  risks?: string[];
}>;
