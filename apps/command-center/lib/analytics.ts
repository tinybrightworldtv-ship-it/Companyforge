import {createClient} from "./supabase/server";

export interface AnalyticsSummary{visitors:number;uniqueVisitors:number;leads:number;customers:number;earnings:number;currency:string;conversionRate:number;byChannel:Array<{channel:string;visitors:number;leads:number;customers:number;earnings:number}>;}

export async function getAnalyticsSummary(days=30):Promise<AnalyticsSummary|null>{
 const supabase=await createClient(); const {data:claims}=await supabase.auth.getClaims(); const userId=claims?.claims?.sub; if(!userId)return null;
 const {data:company}=await supabase.from("companies").select("id").eq("owner_id",userId).order("created_at",{ascending:true}).limit(1).maybeSingle(); if(!company)return null;
 const since=new Date(Date.now()-days*86400000).toISOString();
 const [{data:events},{data:metrics}]=await Promise.all([
  supabase.from("acquisition_events").select("event_type,visitor_id,channel,value,currency").eq("company_id",company.id).gte("occurred_at",since),
  supabase.from("company_metric_events").select("event_type,value,currency,source").eq("company_id",company.id).gte("occurred_at",since)
 ]);
 type EventRow={event_type:string;visitor_id?:string|null;channel?:string|null;value?:number|null;currency?:string|null};
 const eventRows=(events??[]) as EventRow[];
 const metricRows=(metrics??[]) as EventRow[];
 const all:EventRow[]=[...eventRows,...metricRows];
 const visitors=all.filter(e=>e.event_type==="page_view").length;
 const uniqueVisitors=new Set(all.filter(e=>e.event_type==="page_view"&&e.visitor_id).map(e=>e.visitor_id)).size;
 const leads=all.filter(e=>["lead","qualified_lead"].includes(e.event_type)).length;
 const customers=all.filter(e=>["purchase","subscription"].includes(e.event_type)).length;
 const earningRows=all.filter(e=>["purchase","subscription","revenue"].includes(e.event_type)&&typeof e.value==="number");
 const earnings=earningRows.reduce((sum,e)=>sum+Number(e.value??0),0);
 const currency=earningRows.find(e=>e.currency)?.currency??"USD";
 const map=new Map<string,{visitors:number;leads:number;customers:number;earnings:number}>();
 for(const e of eventRows){const ch=e.channel??"unknown";const row=map.get(ch)??{visitors:0,leads:0,customers:0,earnings:0};if(e.event_type==="page_view")row.visitors++;if(["lead","qualified_lead"].includes(e.event_type))row.leads++;if(["purchase","subscription"].includes(e.event_type))row.customers++;if(["purchase","subscription","revenue"].includes(e.event_type))row.earnings+=Number(e.value??0);map.set(ch,row);}
 return {visitors,uniqueVisitors,leads,customers,earnings,currency,conversionRate:visitors?customers/visitors:0,byChannel:[...map.entries()].map(([channel,v])=>({channel,...v})).sort((a,b)=>b.visitors-a.visitors)};
}
