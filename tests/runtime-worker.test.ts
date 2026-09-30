import assert from "node:assert/strict";
import { InMemoryRuntimeStore } from "../core/persistence/runtime-store";
import { AgentRuntime } from "../core/agent-runtime";
import { CompanyForgeWorker } from "../core/runtime/worker";

async function main(){
  const store=new InMemoryRuntimeStore();
  const runtime=new AgentRuntime(store);
  runtime.register(
    {id:"worker-agent",name:"Worker Agent",role:"worker",status:"active",purpose:"test"},
    {allowed_levels:["WRITE"]},
    async({task})=>({summary:task.objective+" completed",evidence:["test-evidence"]})
  );

  await store.saveTask({task_id:"task-1",company_id:"company-1",objective:"first",assigned_agent:"worker-agent",inputs:{},expected_outcome:"done",status:"queued"});
  await store.saveTask({task_id:"task-2",company_id:"company-1",objective:"second",assigned_agent:"worker-agent",inputs:{},dependencies:["task-1"],expected_outcome:"done",status:"queued"});

  const worker=new CompanyForgeWorker(runtime,store);
  const first=await worker.processNext("company-1");
  assert.equal(first.claimed,true);
  assert.equal(first.taskId,"task-1");
  assert.equal(store.tasks.get("task-1")?.status,"completed");

  const second=await worker.processNext("company-1");
  assert.equal(second.claimed,true);
  assert.equal(second.taskId,"task-2");
  assert.equal(store.tasks.get("task-2")?.status,"completed");

  const empty=await worker.processNext("company-1");
  assert.equal(empty.claimed,false);
  console.log("Runtime worker tests passed.");
}
void main();
