import {NextResponse} from "next/server";
import {createClient} from "../../../lib/supabase/server";
import {createCompanyForgeRuntime} from "../../../../../core/runtime";

export async function POST(req:Request){
 const supabase=await createClient(); const {data:claimsData}=await supabase.auth.getClaims(); const userId=claimsData?.claims?.sub;
 if(!userId)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await req.json().catch(()=>null); const taskId=typeof body?.taskId==="string"?body.taskId:"";
 if(!taskId)return NextResponse.json({error:"taskId is required."},{status:400});
 const {data:company}=await supabase.from("companies").select("id").eq("owner_id",userId).limit(1).maybeSingle();
 if(!company)return NextResponse.json({error:"Company not found."},{status:404});
 const {data:row,error}=await supabase.from("runtime_tasks").select("*").eq("id",taskId).eq("company_id",company.id).maybeSingle();
 if(error)return NextResponse.json({error:error.message},{status:400}); if(!row)return NextResponse.json({error:"Task not found."},{status:404}); if(row.status!=="queued")return NextResponse.json({error:"Task is not queued.",status:row.status},{status:409});
 try{
  const runtime=createCompanyForgeRuntime();
  const result=await runtime.run({task_id:row.id,company_id:row.company_id,parent_task_id:row.parent_task_id??null,objective:row.objective,assigned_agent:row.assigned_agent,priority:row.priority,inputs:row.inputs??{},constraints:row.constraints??[],dependencies:row.dependencies??[],expected_outcome:row.expected_outcome,approval:{required:row.approval_required??false,status:row.approval_status??"not_required",approval_id:row.approval_id??undefined},status:"queued"},"WRITE","company-command-center","low");
  return NextResponse.json(result,{status:result.status==="completed"?200:result.status==="awaiting_approval"?202:400});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:String(error)},{status:503})}
}
