import { randomUUID } from "node:crypto";
import { AgentTask, PermissionLevel } from "../agent-runtime/types";
import { ApprovalStore, CompanyAutonomyPolicy, ApprovalRequest, ActionRisk } from "./types";
import { defaultAutonomyPolicy, permissionAllowed, riskRequiresApproval } from "./policy";
export class GovernanceController {
 constructor(private readonly store:ApprovalStore,private readonly policies=new Map<string,CompanyAutonomyPolicy>()){}
 setPolicy(policy:CompanyAutonomyPolicy){this.policies.set(policy.company_id,policy);}
 getPolicy(companyId:string){return this.policies.get(companyId)??defaultAutonomyPolicy(companyId);}
 async authorize(task:AgentTask,agentId:string,permission:PermissionLevel,risk:ActionRisk){
  const policy=this.getPolicy(task.company_id);
  if(!permissionAllowed(policy,permission))return{allowed:false,approvalRequired:false,reason:"Company autonomy policy does not allow "+permission+"."};
  if(!riskRequiresApproval(policy,risk))return{allowed:true,approvalRequired:false};
  const approvalId=task.approval?.approval_id??randomUUID();
  const request:ApprovalRequest={approval_id:approvalId,company_id:task.company_id,task_id:task.task_id,agent_id:agentId,action:task.objective,permission_level:permission,risk,reason:"Company autonomy policy requires explicit approval.",status:"pending",requested_at:new Date().toISOString()};
  await this.store.save(request); return{allowed:false,approvalRequired:true,approvalId,reason:"Explicit approval required before execution."};
 }
}