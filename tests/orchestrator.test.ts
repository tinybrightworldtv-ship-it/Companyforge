import { strict as assert } from "node:assert";
import { AICEOPlanner } from "../core/orchestrator/planner";
import { InMemoryRuntimeStore } from "../core/persistence/runtime-store";
import { LLMRouter, LLMRequest, LLMResponse } from "../core/llm/types";
import { AgentDefinition } from "../core/agent-runtime/types";
class MockRouter implements LLMRouter { async generate(_request: LLMRequest): Promise<LLMResponse> { return { provider:"openai", model:"mock", text: JSON.stringify({ rationale:"Research first, then validate.", tasks:[{task_id:"task-1",objective:"Research the target market.",assigned_agent:"research",priority:"high",inputs:{},constraints:[],dependencies:[],expected_outcome:"Market findings with evidence.",approval_required:false},{task_id:"task-2",objective:"Validate the opportunity using the research.",assigned_agent:"strategy",priority:"normal",inputs:{},constraints:[],dependencies:["task-1"],expected_outcome:"A validated opportunity assessment.",approval_required:false}],risks:[],approvals_needed:[],evidence:[]}) }; } }
const agents: AgentDefinition[]=[{id:"research",name:"Research Agent",role:"research",status:"planned",purpose:"Research markets and evidence."},{id:"strategy",name:"Strategy Agent",role:"strategy",status:"planned",purpose:"Evaluate strategy and opportunities."}];
async function main(){const store=new InMemoryRuntimeStore();const planner=new AICEOPlanner(new MockRouter(),agents,store);const plan=await planner.plan({company_id:"company-1",objective:"Find and validate a profitable online business opportunity."});assert.equal(plan.tasks.length,2);assert.equal(plan.tasks[1].dependencies[0],"task-1");assert.equal(store.tasks.size,2);console.log("Orchestrator tests passed.");}
void main();
