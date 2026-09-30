import {AgentRuntime} from "../agent-runtime";
import {MultiProviderRouter} from "../llm";
import {AICEOPlanner} from "../orchestrator";
import {createSupabaseRuntimeStoreFromEnv} from "../persistence";
import {SupabaseMemoryStore} from "../memory/supabase-store";
import {SupabaseApprovalStore} from "../governance/supabase-store";
import {GovernanceController} from "../governance";
import type {AgentDefinition} from "../agent-runtime/types";
export function companyForgeAgentCatalog():AgentDefinition[]{return[
{id:"ceo",name:"AI CEO / Orchestrator",role:"orchestrator",status:"planned",purpose:"Own company goals, decompose objectives, delegate work, track dependencies, resolve conflicts, and escalate high-impact decisions."},
{id:"research",name:"Research Agent",role:"research",status:"planned",purpose:"Discover markets, customer problems, competitors, evidence, and opportunities."},
{id:"strategy",name:"Strategy Agent",role:"strategy",status:"planned",purpose:"Turn evidence into positioning, business models, priorities, and experiments."},
{id:"product",name:"Product Manager Agent",role:"product",status:"planned",purpose:"Create product requirements, user stories, acceptance criteria, and product priorities."},
{id:"builder",name:"Builder Agent",role:"builder",status:"planned",purpose:"Implement approved software and product changes within repository scope."},
{id:"qa",name:"QA / Critic Agent",role:"qa",status:"planned",purpose:"Challenge plans, inspect changes, find defects, and verify acceptance criteria."},
{id:"growth",name:"Growth Agent",role:"growth",status:"planned",purpose:"Design and run approved acquisition and growth experiments."},
{id:"customer_intelligence",name:"Customer Intelligence Agent",role:"customer_intelligence",status:"planned",purpose:"Turn customer feedback and behavior into insights and opportunities."},
{id:"operations",name:"Operations Agent",role:"operations",status:"planned",purpose:"Monitor recurring technical and business workflows and surface operational issues."},
{id:"analytics",name:"Analytics Agent",role:"analytics",status:"planned",purpose:"Measure performance, experiments, anomalies, and outcome trends."},
{id:"finance",name:"Finance / Revenue Agent",role:"finance",status:"planned",purpose:"Track revenue, costs, unit economics, budgets, and financial alerts."},
{id:"security",name:"Security & Governance Agent",role:"security",status:"planned",purpose:"Enforce permissions, audit requirements, secrets safety, and high-impact controls."}
]}
export function createCompanyForgeRuntime(){
 const runtimeStore=createSupabaseRuntimeStoreFromEnv(); const url=process.env.SUPABASE_URL!; const key=process.env.SUPABASE_SECRET_KEY??process.env.SUPABASE_PUBLISHABLE_KEY!;
 const approvalStore=new SupabaseApprovalStore(url,key); const governance=new GovernanceController(approvalStore); const memoryStore=new SupabaseMemoryStore({url,key}); const router=new MultiProviderRouter(); const catalog=companyForgeAgentCatalog(); const planner=new AICEOPlanner(router,catalog,runtimeStore,memoryStore); const runtime=new AgentRuntime(runtimeStore,governance);
 runtime.register(catalog[0],{allowed_levels:["READ","WRITE"],can_delegate:true},async({task})=>{const plan=await planner.plan({company_id:task.company_id,objective:task.objective,constraints:task.constraints,context:task.inputs});return{summary:"AI CEO produced a validated execution plan with "+plan.tasks.length+" tasks.",evidence:plan.evidence,artifacts:["orchestration_plan:"+JSON.stringify({plan_id:plan.plan_id,tasks:plan.tasks})],next_actions:["Execute validated child tasks through Agent Runtime."]}});
 return runtime;
}
