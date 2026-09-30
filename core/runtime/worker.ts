import { AgentRuntime, AgentTask, AgentResult } from "../agent-runtime";
import { TaskQueueStore } from "../persistence/runtime-store";

export interface WorkerResult {
  claimed: boolean;
  taskId?: string;
  result?: AgentResult;
}

export class CompanyForgeWorker {
  constructor(private readonly runtime: AgentRuntime, private readonly queue: TaskQueueStore) {}

  async processNext(companyId: string): Promise<WorkerResult> {
    const queued = await this.queue.listQueuedTasks(companyId, 1);
    const candidate = queued[0];
    if (!candidate) return { claimed: false };

    const claimed = await this.queue.claimTask(candidate.task_id);
    if (!claimed) return { claimed: false };

    // The queue row is already atomically claimed. AgentRuntime receives a
    // queued execution copy and remains the single authority for execution,
    // governance, audit, and final persistence.
    const executionTask: AgentTask = { ...claimed, status: "queued" };
    const result = await this.runtime.run(executionTask, "WRITE", "worker", executionTask.priority === "critical" ? "high" : executionTask.priority === "high" ? "medium" : "low");
    return { claimed: true, taskId: executionTask.task_id, result };
  }

  async processBatch(companyId: string, maxTasks = 10): Promise<WorkerResult[]> {
    const results: WorkerResult[] = [];
    for (let i = 0; i < Math.max(1, Math.min(maxTasks, 50)); i++) {
      const result = await this.processNext(companyId);
      results.push(result);
      if (!result.claimed) break;
    }
    return results;
  }
}
