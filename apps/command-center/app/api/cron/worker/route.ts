import {NextResponse} from "next/server";
import {createSupabaseRuntimeStoreFromEnv} from "../../../../../../core/persistence";
import {createCompanyForgeRuntime} from "../../../../../../core/runtime";
import {CompanyForgeWorker} from "../../../../../../core/runtime/worker";

export async function GET(req:Request){
  const expected=process.env.CRON_SECRET;
  const authorization=req.headers.get("authorization");
  if(!expected || authorization!==`Bearer ${expected}`) return NextResponse.json({error:"Unauthorized"},{status:401});

  try{
    const store=createSupabaseRuntimeStoreFromEnv();
    const runtime=createCompanyForgeRuntime();
    const worker=new CompanyForgeWorker(runtime,store);
    const response=await fetch(`${process.env.SUPABASE_URL!.replace(/\/$/,"")}/rest/v1/companies?select=id&limit=100`,{
      headers:{apikey:process.env.SUPABASE_SECRET_KEY!,Authorization:`Bearer ${process.env.SUPABASE_SECRET_KEY!}`}
    });
    if(!response.ok) throw new Error(`Company queue lookup failed: ${response.status}`);
    const companies=await response.json();
    const results=[];
    for(const company of companies){
      results.push({companyId:company.id,results:await worker.processBatch(company.id,5)});
    }
    return NextResponse.json({ok:true,companies:results.length,results});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:String(error)},{status:503});
  }
}
