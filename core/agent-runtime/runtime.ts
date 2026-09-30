import { randomUUID } from "node:crypto";
import { AgentDefinition, AgentHandler, AgentPolicy, AgentResult, AgentTask, AuditEvent, PermissionLevel } from "./types";
import { RuntimeStore } from "../persistence/runtime-store";
import { GovernanceController, ActionRisk } from "../governance";
export class AgentRuntime {
 private readonly agents=new Map<string,AgentDefinition>(); private readonly policies=new Map<string,AgentPolicy>(); private readonly handlers=new Map<string,AgentHandler>(); private readonly auditEvents:AuditEvent[]=[];
 constructor(private readonly store?:RuntimeStore,private readonly governance?:GovernanceController){}
 register(agent:AgentDefinition,policy:AgentPolicy,handler:AgentHandler){if(!agent.id||!agent.name||!agent.role)throw new Error("Invalid agent definition.");if(!policy.allowed_levels.length)throw new Error("Agent "+agent.id+" has no allowed permission levels.");this.agents.set(agent.id,agent);this.policies.set(agent.id,policy);this.handlers.set(agent.id,handler);}
 getAgent(id:string){const a=this.agents.get(id);if(!a)throw new Error("Unknown agent: "+id);return a;}
 getPolicy(id:string){const p=this.policies.get(id);if(!p)throw new Error("No policy registered for agent: "+id);return p;}
 authorize(agentId:string,level:PermissionLevel,task:AgentTask){const p=this.getPolicy(agentId);if(!p.allowed_levels.includes(level))throw new Error("Permission denied: agent "+agentId+" cannot use "+level+".");if(level==="HIGH_IMPACT"&&(!task.approval||task.approval.required!==true||task.approval.status!=="approved"))throw new Error("High-impact action requires explicit approval.");}
 private async persistTask(task:AgentTask,result?:AgentResult){if(!this.store)return;await this.store.saveTask(task,result?{status:result.status,summary:result.summary,evidence:result.evidence,artifacts:result.artifacts,next_actions:result.next_actions,risks:result.risks,approval_required:result.approval_required,audit_event_id:result.audit_event_id}:undefined);}
 private async persistAuditEvent(e:AuditEvent){if(this.store)await this.store.saveAuditEvent(e);}
 async run(task:AgentTask,permissionLevel:PermissionLevel="READ",scope="task",risk:ActionRisk="low"):Promise<AgentResult>{
  if(task.status!=="queued")throw new Error("Task "+task.task_id+" cannot run from status "+task.status+".");
  const agent=this.getAgent(task.assigned_agent); const policy=this.getPolicy(task.assigned_agent); const handler=this.handlers.get(task.assigned_agent); if(!handler)throw new Error("No handler registered for agent: "+agent.id);
  const auditBase={event_id:randomUUID(),timestamp:new Date().toISOString(),company_id:task.company_id,agent_id:agent.id,task_id:task.task_id,action:"agent.run",permission_level:permissionLevel,scope,approval_id:task.approval?.approval_id??null};
  try {
   this.authorize(agent.id,permissionLevel,task);
   if(task.dependencies?.length)throw new Error("Task dependencies must be resolved before execution.");
   if(this.governance){const g=await this.governance.authorize(task,agent.id,permissionLevel,risk);if(!g.allowed){if(g.approvalRequired){task.status="awaiting_approval";task.approval={required:true,status:"pending",approval_id:g.approvalId};const result:AgentResult={status:"awaiting_approval",summary:g.reason??"Approval required.",evidence:[],artifacts:[],next_actions:["Approve or reject the pending approval request."],risks:[],approval_required:true,audit_event_id:auditBase.event_id};const event:AuditEvent={...auditBase,result:"blocked",evidence:[],error:g.reason??"Approval required."};this.auditEvents.push(event);await this.persistTask(task,result);await this.persistAuditEvent(event);return result;}throw new Error(g.reason??"Governance denied execution.");}}
   task.status="running"; await this.persistTask(task); const output=await handler({task,agent,policy}); task.status="completed";
   const event:AuditEvent={...auditBase,result:"success",evidence:output.evidence??[],error:null};this.auditEvents.push(event);
   const result:AgentResult={status:"completed",summary:output.summary,evidence:output.evidence??[],artifacts:output.artifacts??[],next_actions:output.next_actions??[],risks:output.risks??[],approval_required:false,audit_event_id:event.event_id};await this.persistTask(task,result);await this.persistAuditEvent(event);return result;
  } catch(error){const message=error instanceof Error?error.message:String(error);const blocked=message.startsWith("Permission denied")||message.includes("requires explicit approval")||message.includes("dependencies")||message.includes("Governance denied");task.status=blocked?"blocked":"failed";const event:AuditEvent={...auditBase,result:blocked?"blocked":"failure",evidence:[],error:message};this.auditEvents.push(event);const result:AgentResult={status:blocked?"blocked":"failed",summary:message,evidence:[],artifacts:[],next_actions:blocked?["Resolve the permission, approval, or dependency blocker."]:["Inspect the failure evidence and retry only if safe."],risks:blocked?[]:["Agent execution did not complete successfully."],approval_required:message.includes("approval"),audit_event_id:event.event_id};await this.persistTask(task,result);await this.persistAuditEvent(event);return result;}
 }
 getAuditEvents(){return this.auditEvents;}
}