import { randomUUID } from "node:crypto";
import { AgentRuntime } from "../agent-runtime/runtime";
import { AgentTask, AgentResult } from "../agent-runtime/types";
import { OrchestrationRun, TaskExecutionRecord } from "./types";

export type OrchestrationState={runId:string;companyId:string;pending:AgentTask[];records:TaskExecutionRecord[];status:"running"|"blocked"|"completed"|"failed"};

export class TaskOrchestrationEngine {
  constructor(private readonly runtime:AgentRuntime,private readonly maxRetries=2){}
  async run(companyId:string,tasks:AgentTask[]):Promise<OrchestrationRun>{
    const state:OrchestrationState={runId:randomUUID(),companyId,pending:[...tasks],records:[],status:"running"};
    await this.drain(state);
    return this.toRun(state);
  }
  async resumeApproved(state:OrchestrationState,task:AgentTask):Promise<OrchestrationRun>{
    if(task.status!=="awaiting_approval"||task.approval?.status!=="approved")throw new Error("Task is not approved for resumption.");
    state.pending=[...state.pending.filter(t=>t.task_id!==task.task_id),{...task,status:"queued"}];
    state.status="running";
    await this.drain(state);
    return this.toRun(state);
  }
  private async drain(state:OrchestrationState){
    while(state.pending.length){
      const ready=state.pending.filter(t=>t.company_id===state.companyId&&t.dependencies.every(d=>state.records.some(r=>r.taskId===d&&r.outcome==="completed")));
      if(!ready.length){
        const waiting=state.pending.some(t=>state.records.some(r=>r.taskId===t.task_id&&r.outcome==="awaiting_approval"));
        state.status=waiting?"blocked":"blocked";
        return;
      }
      for(const task of ready){
        const record=await this.executeWithRetry({...task,dependencies:[]});
        const existing=state.records.findIndex(r=>r.taskId===task.task_id);
        if(existing>=0)state.records[existing]=record; else state.records.push(record);
        if(record.outcome==="awaiting_approval"){
          state.status="blocked";
          continue;
        }
        state.pending=state.pending.filter(t=>t.task_id!==task.task_id);
        if(record.outcome==="failed"){
          for(const dependent of state.pending.filter(t=>t.dependencies.includes(task.task_id))){
            state.records.push({taskId:dependent.task_id,attempts:0,outcome:"blocked",error:"Dependency "+task.task_id+" failed."});
          }
          state.pending=state.pending.filter(t=>!t.dependencies.includes(task.task_id));
        }
      }
      if(state.records.some(r=>r.outcome==="failed")){state.status="failed";return}
      if(state.pending.some(t=>state.records.some(r=>r.taskId===t.task_id&&r.outcome==="awaiting_approval"))){state.status="blocked";return}
    }
    state.status="completed";
  }
  private toRun(state:OrchestrationState):OrchestrationRun{return{runId:state.runId,companyId:state.companyId,records:state.records,status:state.status==="running"?"blocked":state.status}}
  private async executeWithRetry(task:AgentTask):Promise<TaskExecutionRecord>{
    let attempts=0;let last:AgentResult|undefined;
    while(attempts<=this.maxRetries){
      attempts++;
      const risk=task.priority==="critical"?"high":task.priority==="high"?"medium":"low";
      last=await this.runtime.run({...task,dependencies:[]},"WRITE","orchestrated-task",risk);
      if(last.status==="completed")return{taskId:task.task_id,attempts,outcome:"completed",result:last};
      if(last.status==="blocked"||last.approval_required)return{taskId:task.task_id,attempts,outcome:"awaiting_approval",result:last};
    }
    return{taskId:task.task_id,attempts,outcome:"failed",result:last,error:last?.summary};
  }
}
