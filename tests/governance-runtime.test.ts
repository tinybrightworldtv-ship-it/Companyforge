import { strict as assert } from "node:assert";
import { AgentRuntime } from "../core/agent-runtime/runtime";
import { InMemoryApprovalStore } from "../core/governance/store";
import { GovernanceController } from "../core/governance/controller";

const store = new InMemoryApprovalStore();
const governance = new GovernanceController(store);
const runtime = new AgentRuntime(undefined, governance);

runtime.register(
  { id:"builder", name:"Builder", role:"builder", status:"active", purpose:"Build software" },
  { allowed_levels:["READ","WRITE","EXECUTE"], can_delegate:false, can_approve_high_impact:false },
  async () => ({ summary:"built", evidence:["test-evidence"] }),
);

const task:any = {
  task_id:"gov-runtime-1", company_id:"c1", objective:"Deploy production",
  assigned_agent:"builder", priority:"high", inputs:{}, constraints:[],
  dependencies:[], expected_outcome:"deployment",
  approval:{required:false,status:"not_required"}, status:"queued"
};

const result = await runtime.run(task,"EXECUTE","test");
assert.equal(result.status,"blocked");
assert.equal(result.approval_required,true);
assert.equal(task.status,"awaiting_approval");
assert.ok(task.approval.approval_id);
console.log("Governance runtime enforcement test passed.");