import {NextResponse} from "next/server";
import {createClient as createSupabaseClient} from "@supabase/supabase-js";
import {detectIncidents,type ServiceSignal} from "../../../../../../core/operations";

export async function POST(request:Request){
 const expected=process.env.INTERNAL_EVENT_INGEST_SECRET;
 if(!expected||request.headers.get("x-companyforge-event-secret")!==expected)return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
  const body=await request.json();
  if(typeof body.companyId!=="string"||typeof body.service!=="string"||!["healthy","degraded","down"].includes(body.status))return NextResponse.json({error:"Invalid service signal"},{status:400});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.SUPABASE_SECRET_KEY;
  if(!url||!key)return NextResponse.json({error:"Operations ingestion is not configured"},{status:503});
  const supabase=createSupabaseClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
  const signal={companyId:body.companyId,service:String(body.service).slice(0,100),status:body.status,latencyMs:typeof body.latencyMs==="number"?Math.max(0,Math.round(body.latencyMs)):undefined,timestamp:typeof body.observedAt==="string"?body.observedAt:new Date().toISOString()} satisfies ServiceSignal & {companyId:string};
  const {data:row,error}=await supabase.from("service_signals").insert({company_id:signal.companyId,service:signal.service,status:signal.status,latency_ms:signal.latencyMs,metadata:body.metadata&&typeof body.metadata==="object"?body.metadata:{},observed_at:signal.timestamp}).select("id").single();
  if(error)throw error;
  const incidents=detectIncidents(signal.companyId,[signal]);
  if(incidents.length){
   await supabase.from("incidents").insert(incidents.map(i=>({company_id:i.companyId,service:i.service,severity:i.severity,summary:i.summary,recommended_action:i.recommendedAction,signal_id:row.id,status:i.status})));
  }
  return NextResponse.json({ok:true,incidentCount:incidents.length});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Invalid signal"},{status:400});}
}
