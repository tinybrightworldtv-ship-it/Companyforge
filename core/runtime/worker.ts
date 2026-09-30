import { AgentRuntime, AgentTask, AgentResult } from "../agent-runtime";
import { TaskQueueStore } from "../persistence/runtime-store";

export interface WorkerResult {
  claimed: boolean;
  taskId?: string;
  result?: AgentResult;
  reason?: string;
}

export class CompanyForgeWorker {
  constructor(private readonly runtime: AgentRuntime, private readonly queue: TaskQueueStore) {}

  async processNext(companyId: string): Promise<WorkerResult> {
    const candidates = await this.queue.listQueuedTasks(companyId, 10);
    for (const candidate of candidates) {
      const dependencies = candidate.dependencies ?? [];
      let dependenciesReady = true;
      for (const dependencyId of dependencies) {
        const dependency = await this.queue.getTask(dependencyId);
        if (!dependency || dependency.status !== "completed") {
          dependenciesReady = false;
          break;
        }
      }
      if (!dependenciesReady) continue;

      const claimed = await this.queue.claimTask(candidate.task_id);
      if (!claimed) continue;

      const executionTask: AgentTask = { ...claimed, status: "queued" };
      const risk = executionTask.priority === "critical" ? "high" : executionTask.priority === "high" ? "medium" : "low";
      const result = await this.runtime.run(executionTask, "WRITE", "worker", risk);
      return { claimed: true, taskId: executionTask.task_id, result };
    }
    return {
      claimed: false,
      reason: candidates.length ? "Queued tasks are waiting on unresolved dependencies." : "No queued tasks available."
    };
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
