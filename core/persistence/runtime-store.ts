import { AgentTask, AuditEvent } from "../agent-runtime/types";

export interface RuntimeStore {
  saveTask(task: AgentTask, result?: Record<string, unknown>): Promise<void>;
  saveAuditEvent(event: AuditEvent): Promise<void>;
}

export class InMemoryRuntimeStore implements RuntimeStore {
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
}
