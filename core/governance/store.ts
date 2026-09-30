import { ApprovalDecision, ApprovalRequest, ApprovalStore, CompanyAutonomyPolicy } from "./types";
export class InMemoryApprovalStore implements ApprovalStore {
 readonly requests=new Map<string,ApprovalRequest>(); readonly policies=new Map<string,CompanyAutonomyPolicy>();
 async save(request:ApprovalRequest){this.requests.set(request.approval_id,{...request});}
 async get(id:string){return this.requests.get(id)??null;}
 async decide(decision:ApprovalDecision){const r=this.requests.get(decision.approval_id); if(!r) throw new Error("Approval request not found."); if(r.status!=="pending") throw new Error("Approval request is no longer pending."); r.status=decision.status; r.decided_at=new Date().toISOString(); r.decided_by=decision.decided_by; r.decision_note=decision.note; this.requests.set(r.approval_id,r); return r;}
}