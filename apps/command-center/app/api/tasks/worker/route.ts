import {NextResponse} from "next/server";
import {createClient} from "../../../lib/supabase/server";
import {createSupabaseRuntimeStoreFromEnv} from "../../../../../core/persistence";
import {createCompanyForgeRuntime} from "../../../../../core/runtime";
import {CompanyForgeWorker} from "../../../../../core/runtime/worker";

export async function POST(req:Request){
  const supabase=await createClient();
  const {data:claimsData}=await supabase.auth.getClaims();
  const userId=claimsData?.claims?.sub;
  if(!userId)return NextResponse.json({error:"Unauthorized"},{status:401});

  const body=await req.json().catch(()=>null);
  const limit=typeof body?.limit==="number"?Math.max(1,Math.min(10,Math.floor(body.limit))):1;
  const {data:company}=await supabase.from("companies").select("id").eq("owner_id",userId).limit(1).maybeSingle();
  if(!company)return NextResponse.json({error:"Company not found."},{status:404});

  try{
    const queue=createSupabaseRuntimeStoreFromEnv();
    const runtime=createCompanyForgeRuntime();
    const worker=new CompanyForgeWorker(runtime,queue);
    const results=await worker.processBatch(company.id,limit);
    return NextResponse.json({companyId:company.id,processed:results.filter(x=>x.claimed).length,results});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:String(error)},{status:503});
  }
}
