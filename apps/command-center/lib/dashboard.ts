import { createClient } from "./supabase/server";
import { DashboardSummary } from "./types";

export async function getDashboardSummary(): Promise<DashboardSummary | null> {
  const supabase=await createClient();
  const {data:claimsData}=await supabase.auth.getClaims();
  const userId=claimsData?.claims?.sub;
  if(!userId)return null;
  const {data:company}=await supabase.from("companies").select("id,name,status").eq("owner_id",userId).order("created_at",{ascending:true}).limit(1).maybeSingle();
  if(!company)return null;
  const [{count:activeAgents},{count:runningTasks},{count:pendingApprovals},{count:failedTasks},{data:recentTasks},{data:events},{data:metricEvents}]=await Promise.all([
    supabase.from("agents").select("id",{count:"exact",head:true}).eq("company_id",company.id).neq("status","paused"),
    supabase.from("runtime_tasks").select("id",{count:"exact",head:true}).eq("company_id",company.id).eq("status","running"),
    supabase.from("approval_requests").select("id",{count:"exact",head:true}).eq("company_id",company.id).eq("status","pending"),
    supabase.from("runtime_tasks").select("id",{count:"exact",head:true}).eq("company_id",company.id).eq("status","failed"),
    supabase.from("runtime_tasks").select("id,objective,assigned_agent,status").eq("company_id",company.id).order("created_at",{ascending:false}).limit(8),
    supabase.from("acquisition_events").select("event_type,visitor_id,value,currency").eq("company_id",company.id),
    supabase.from("company_metric_events").select("event_type,value,currency").eq("company_id",company.id)
  ]);
  const all=[...(events??[]),...(metricEvents??[])];
  const visitors=all.filter(e=>e.event_type==="page_view").length;
  const unique=new Set(all.filter(e=>e.event_type==="page_view"&&e.visitor_id).map(e=>e.visitor_id)).size;
  const leads=all.filter(e=>["lead","qualified_lead"].includes(e.event_type)).length;
  const customers=all.filter(e=>["purchase","subscription"].includes(e.event_type)).length;
  const earningRows=all.filter(e=>["purchase","subscription","revenue"].includes(e.event_type)&&typeof e.value==="number");
  const earnings=earningRows.reduce((sum,e)=>sum+Number(e.value??0),0);
  const currency=earningRows.find(e=>e.currency)?.currency??"USD";
  return {companyId:company.id,companyName:company.name,autonomy:"supervised",status:company.status,activeAgents:activeAgents??0,runningTasks:runningTasks??0,pendingApprovals:pendingApprovals??0,failedTasks:failedTasks??0,recentTasks:(recentTasks??[]).map(t=>({id:t.id,objective:t.objective,agent:t.assigned_agent,status:t.status})),metrics:{visitors,uniqueVisitors:unique,leads,customers,earnings,currency,conversionRate:visitors?customers/visitors:0}};
}