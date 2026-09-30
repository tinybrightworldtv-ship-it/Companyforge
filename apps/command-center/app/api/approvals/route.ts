import {NextResponse} from "next/server";
import {createClient} from "../../../lib/supabase/server";
export async function POST(req:Request){
 const supabase=await createClient(); const {data:claimsData}=await supabase.auth.getClaims(); const userId=claimsData?.claims?.sub;
 if(!userId)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await req.json().catch(()=>null); const approvalId=typeof body?.approvalId==="string"?body.approvalId:""; const decision=body?.decision==="approved"||body?.decision==="rejected"?body.decision:null;
 if(!approvalId||!decision)return NextResponse.json({error:"approvalId and decision are required."},{status:400});
 const {data,error}=await supabase.from("approval_requests").update({status:decision,decided_at:new Date().toISOString(),decided_by:userId,decision_note:typeof body?.note==="string"?body.note:null}).eq("approval_id",approvalId).eq("status","pending").select("approval_id,status").maybeSingle();
 if(error)return NextResponse.json({error:error.message},{status:400}); if(!data)return NextResponse.json({error:"Approval not found or already decided."},{status:409});
 return NextResponse.json(data);
}
