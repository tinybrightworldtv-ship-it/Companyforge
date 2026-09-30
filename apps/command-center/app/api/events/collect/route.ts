import {NextResponse} from "next/server";
import {createClient as createSupabaseClient} from "@supabase/supabase-js";
import {validatePublicEvent} from "../../../../../../../core/growth/event-ingestion";

const allowedOrigins=()=>process.env.PUBLIC_EVENT_ALLOWED_ORIGINS?.split(",").map(v=>v.trim()).filter(Boolean)??[];

export async function POST(request:Request){
  try{
    const origin=request.headers.get("origin");
    const configured=allowedOrigins();
    if(configured.length && origin && !configured.includes(origin)) return NextResponse.json({error:"Origin not allowed"},{status:403});
    const event=validatePublicEvent(await request.json());
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key=process.env.SUPABASE_SECRET_KEY;
    if(!url||!key) return NextResponse.json({error:"Event ingestion is not configured"},{status:503});
    const supabase=createSupabaseClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
    const {error}=await supabase.from("acquisition_events").insert({
      company_id:event.companyId,event_type:event.eventType,channel:event.channel??"website",
      source:event.source,medium:event.medium,campaign:event.campaign,content:event.content,
      visitor_id:event.visitorId,metadata:event.metadata??{},occurred_at:event.occurredAt
    });
    if(error) return NextResponse.json({error:"Event could not be recorded"},{status:500});
    return NextResponse.json({ok:true});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"Invalid event"},{status:400});
  }
}
