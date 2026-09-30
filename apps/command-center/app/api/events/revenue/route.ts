import {NextResponse} from "next/server";
import {createClient as createSupabaseClient} from "@supabase/supabase-js";
import {validateRevenueEvent} from "../../../../../../core/growth/revenue-events";

export async function POST(request:Request){
  const expected=process.env.INTERNAL_EVENT_INGEST_SECRET;
  const supplied=request.headers.get("x-companyforge-event-secret");
  if(!expected || supplied!==expected) return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    const event=validateRevenueEvent(await request.json());
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key=process.env.SUPABASE_SECRET_KEY;
    if(!url||!key) return NextResponse.json({error:"Event ingestion is not configured"},{status:503});
    const supabase=createSupabaseClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
    if(event.externalEventId){
      const {data:existing}=await supabase.from("company_metric_events").select("id").eq("company_id",event.companyId).eq("source",event.source).contains("metadata",{external_event_id:event.externalEventId}).limit(1);
      if(existing?.length) return NextResponse.json({ok:true,deduplicated:true});
    }
    const {error}=await supabase.from("company_metric_events").insert({
      company_id:event.companyId,event_type:event.eventType,value:event.value,currency:event.currency,
      source:event.source,metadata:{...(event.metadata??{}),...(event.externalEventId?{external_event_id:event.externalEventId}:{}),...(event.customerId?{customer_id:event.customerId}:{})},
      occurred_at:event.occurredAt
    });
    if(error) return NextResponse.json({error:"Revenue event could not be recorded"},{status:500});
    return NextResponse.json({ok:true});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"Invalid revenue event"},{status:400});
  }
}
