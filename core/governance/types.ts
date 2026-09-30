import { PermissionLevel } from "../agent-runtime/types";
export type AutonomyLevel = "manual"|"assisted"|"supervised"|"autonomous";
export type ApprovalStatus = "pending"|"approved"|"rejected"|"expired"|"cancelled";
export type ActionRisk = "low"|"medium"|"high"|"critical";
export interface CompanyAutonomyPolicy { company_id:string; level:AutonomyLevel; allowed_permission_levels:PermissionLevel[]; auto_approve_low_risk:boolean; require_approval_for:ActionRisk[]; }
export interface ApprovalRequest { approval_id:string; company_id:string; task_id:string; agent_id:string; action:string; permission_level:PermissionLevel; risk:ActionRisk; reason:string; status:ApprovalStatus; requested_at:string; decided_at?:string; decided_by?:string; decision_note?:string; }
export interface ApprovalDecision { approval_id:string; status:"approved"|"rejected"; decided_by:string; note?:string; }
export interface ApprovalStore { save(request:ApprovalRequest):Promise<void>; get(approvalId:string):Promise<ApprovalRequest|null>; decide(decision:ApprovalDecision):Promise<ApprovalRequest>; }