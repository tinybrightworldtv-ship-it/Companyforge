import assert from "node:assert/strict";
import { InMemoryRuntimeStore } from "../core/persistence/runtime-store";
import { AgentRuntime } from "../core/agent-runtime";
import { CompanyForgeWorker } from "../core/runtime/worker";

const store=new InMemoryRuntimeStore();
const runtime=new AgentRuntime(store);
runtime.register(
  {id:"worker-agent",name:"Worker Agent",role:"worker",status:"active",purpose:"test"},
  {allowed_levels:["WRITE"]},
  async()=>({summary:"completed",evidence:["test-evidence"]})
);
await store.saveTask({task_id:"task-1",company_id:"company-1",objective:"run",assigned_agent:"worker-agent",inputs:{},expected_outcome:"done",status:"queued"});
const worker=new CompanyForgeWorker(runtime,store);
const result=await worker.processNext("company-1");
assert.equal(result.claimed,true);
assert.equal(result.result?.status,"completed");
assert.equal(store.tasks.get("task-1")?.status,"completed");
const empty=await worker.processNext("company-1");
assert.equal(empty.claimed,false);
console.log("Runtime worker tests passed.");
