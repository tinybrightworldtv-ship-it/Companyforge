import { randomUUID } from "node:crypto";
import { AgentRuntime } from "../agent-runtime/runtime";
import { AgentTask, AgentResult } from "../agent-runtime/types";
import { OrchestrationRun, TaskExecutionRecord } from "./types";
export class TaskOrchestrationEngine {
  constructor(private readonly runtime: AgentRuntime, private readonly maxRetries = 2) {}
  async run(companyId: string, tasks: AgentTask[]): Promise<OrchestrationRun> {
    const runId = randomUUID(); const pending = new Map(tasks.map(t => [t.task_id, t])); const records: TaskExecutionRecord[] = [];
    while (pending.size) {
      const ready = [...pending.values()].filter(t => t.company_id === companyId && t.dependencies.every(d => records.some(r => r.taskId === d && r.outcome === "completed")));
      if (!ready.length) { for (const t of pending.values()) records.push({taskId:t.task_id,attempts:0,outcome:"blocked",error:"Unresolved task dependency or dependency failure."}); return {runId,companyId,records,status:"blocked"}; }
      for (const task of ready) {
        pending.delete(task.task_id); const record = await this.executeWithRetry(task); records.push(record);
        if (record.outcome === "failed") for (const dependent of [...pending.values()]) if (dependent.dependencies.includes(task.task_id)) { records.push({taskId:dependent.task_id,attempts:0,outcome:"blocked",error:"Dependency "+task.task_id+" failed."}); pending.delete(dependent.task_id); }
      }
    }
    const status = records.some(r=>r.outcome==="failed") ? "failed" : records.some(r=>r.outcome==="blocked"||r.outcome==="awaiting_approval") ? "blocked" : "completed";
    return {runId,companyId,records,status};
  }
  private async executeWithRetry(task: AgentTask): Promise<TaskExecutionRecord> {
    let attempts=0; let last: AgentResult|undefined;
    while(attempts<=this.maxRetries){ attempts++; last=await this.runtime.run(task,"WRITE","orchestrated-task"); if(last.status==="completed") return {taskId:task.task_id,attempts,outcome:"completed",result:last}; if(last.status==="blocked"||last.approval_required) return {taskId:task.task_id,attempts,outcome:"awaiting_approval",result:last}; }
    return {taskId:task.task_id,attempts,outcome:"failed",result:last,error:last?.summary};
  }
}