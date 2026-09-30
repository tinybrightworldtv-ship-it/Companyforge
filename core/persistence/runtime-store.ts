import { AgentTask, AuditEvent } from "../agent-runtime/types";

export interface RuntimeStore {
  saveTask(task: AgentTask, result?: Record<string, unknown>): Promise<void>;
  saveAuditEvent(event: AuditEvent): Promise<void>;
}

export interface TaskQueueStore extends RuntimeStore {
  listQueuedTasks(companyId: string, limit?: number): Promise<AgentTask[]>;
  claimTask(taskId: string): Promise<AgentTask | null>;
}

export class InMemoryRuntimeStore implements TaskQueueStore {
  readonly tasks = new Map<string, AgentTask>();
  readonly auditEvents: AuditEvent[] = [];

  async saveTask(task: AgentTask, result?: Record<string, unknown>): Promise<void> {
    this.tasks.set(task.task_id, {
      ...task,
      ...(result ? { inputs: { ...task.inputs, runtime_result: result } } : {}),
    });
  }

  async saveAuditEvent(event: AuditEvent): Promise<void> {
    this.auditEvents.push(event);
  }

  async listQueuedTasks(companyId: string, limit = 10): Promise<AgentTask[]> {
    return [...this.tasks.values()]
      .filter(t => t.company_id === companyId && t.status === "queued")
      .slice(0, limit);
  }

  async claimTask(taskId: string): Promise<AgentTask | null> {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== "queued") return null;
    this.tasks.set(taskId, { ...task, status: "running" });
    return { ...task, status: "queued" };
  }
}
