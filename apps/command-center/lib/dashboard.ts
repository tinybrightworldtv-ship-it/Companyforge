import { createClient } from "./supabase/server";
import { DashboardSummary } from "./types";

export async function getDashboardSummary(): Promise<DashboardSummary | null> {
  const supabase=await createClient();
  const {data:claimsData}=await supabase.auth.getClaims();
  const userId=claimsData?.claims?.sub;
  if(!userId)return null;

  const {data:company}=await supabase.from("companies").select("id,name,status").eq("owner_id",userId).order("created_at",{ascending:true}).limit(1).maybeSingle();
  if(!company)return null;

  const [{count:activeAgents},{count:runningTasks},{count:pendingApprovals},{count:failedTasks},{data:recentTasks}]=await Promise.all([
    supabase.from("agents").select("id",{count:"exact",head:true}).eq("company_id",company.id).neq("status","paused"),
    supabase.from("runtime_tasks").select("id",{count:"exact",head:true}).eq("company_id",company.id).eq("status","running"),
    supabase.from("approval_requests").select("id",{count:"exact",head:true}).eq("company_id",company.id).eq("status","pending"),
    supabase.from("runtime_tasks").select("id",{count:"exact",head:true}).eq("company_id",company.id).eq("status","failed"),
    supabase.from("runtime_tasks").select("id,objective,assigned_agent,status").eq("company_id",company.id).order("created_at",{ascending:false}).limit(8)
  ]);

  return {
    companyId:company.id,
    companyName:company.name,
    autonomy:"supervised",
    status:company.status,
    activeAgents:activeAgents??0,
    runningTasks:runningTasks??0,
    pendingApprovals:pendingApprovals??0,
    failedTasks:failedTasks??0,
    recentTasks:(recentTasks??[]).map((t)=>({id:t.id,objective:t.objective,agent:t.assigned_agent,status:t.status}))
  };
}