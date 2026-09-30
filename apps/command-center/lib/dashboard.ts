import { createClient } from "./supabase/server";
import { DashboardSummary } from "./types";

export async function getDashboardSummary(): Promise<DashboardSummary | null> {
  const supabase=await createClient();
  const {data:claimsData}=await supabase.auth.getClaims();
  const userId=claimsData?.claims?.sub;
  if(!userId)return null;
  const {data:company}=await supabase.from("companies").select("id,name,status").eq("owner_id",userId).order("created_at",{ascending:true}).limit(1).maybeSingle();
  if(!company)return null;
  const [{data:profile},{count:activeAgents},{count:runningTasks},{count:pendingApprovals},{count:failedTasks},{count:openIncidents},{data:recentTasks},{data:events},{data:metricEvents}]=await Promise.all([
    supabase.from("company_profiles").select("desired_outcome,target_customer,autonomy_level").eq("company_id",company.id).maybeSingle(),
    supabase.from("agents").select("id",{count:"exact",head:true}).eq("company_id",company.id).neq("status","paused"),
    supabase.from("runtime_tasks").select("id",{count:"exact",head:true}).eq("company_id",company.id).eq("status","running"),
    supabase.from("approval_requests").select("id",{count:"exact",head:true}).eq("company_id",company.id).eq("status","pending"),
    supabase.from("runtime_tasks").select("id",{count:"exact",head:true}).eq("company_id",company.id).eq("status","failed"),
    supabase.from("incidents").select("id",{count:"exact",head:true}).eq("company_id",company.id).eq("status","open"),
    supabase.from("runtime_tasks").select("id,objective,assigned_agent,status").eq("company_id",company.id).order("created_at",{ascending:false}).limit(8),
    supabase.from("acquisition_events").select("event_type,visitor_id,value,currency").eq("company_id",company.id),
    supabase.from("company_metric_events").select("event_type,value,currency").eq("company_id",company.id)
  ]);
  type MetricRow={event_type:string;visitor_id?:string|null;value?:number|null;currency?:string|null};
  const eventRows=(events??[]) as MetricRow[];
  const metricRows=(metricEvents??[]) as MetricRow[];
  const all:MetricRow[]=[...eventRows,...metricRows];
  const visitors=all.filter(e=>e.event_type==="page_view").length;
  const unique=new Set(all.filter(e=>e.event_type==="page_view"&&e.visitor_id).map(e=>e.visitor_id)).size;
  const leads=all.filter(e=>["lead","qualified_lead"].includes(e.event_type)).length;
  const customers=all.filter(e=>["purchase","subscription"].includes(e.event_type)).length;
  const earningRows=all.filter(e=>["purchase","subscription","revenue"].includes(e.event_type)&&typeof e.value==="number");
  const earnings=earningRows.reduce((sum,e)=>sum+Number(e.value??0),0);
  const currency=earningRows.find(e=>e.currency)?.currency??"USD";
  return {companyId:company.id,companyName:company.name,autonomy:profile?.autonomy_level??"supervised",status:company.status,goal:profile?.desired_outcome??"No goal recorded",targetCustomer:profile?.target_customer??"No target customer recorded",activeAgents:activeAgents??0,runningTasks:runningTasks??0,pendingApprovals:pendingApprovals??0,failedTasks:failedTasks??0,openIncidents:openIncidents??0,recentTasks:(recentTasks??[]).map(t=>({id:t.id,objective:t.objective,agent:t.assigned_agent,status:t.status})),metrics:{visitors,uniqueVisitors:unique,leads,customers,earnings,currency,conversionRate:visitors?customers/visitors:0}};
}