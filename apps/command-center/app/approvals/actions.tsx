"use client";
import {useState} from "react";
export function ApprovalActions({approvalId}:{approvalId:string}){const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 async function decide(decision:"approved"|"rejected"){setBusy(true);setError("");const res=await fetch("/api/approvals",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({approvalId,decision})});if(!res.ok){const d=await res.json().catch(()=>({}));setError(d.error??"Could not update approval.");setBusy(false);return}location.reload()}
 return <div style={{display:"flex",gap:8,alignItems:"center"}}><button disabled={busy} onClick={()=>decide("approved")}>Approve</button><button disabled={busy} onClick={()=>decide("rejected")}>Reject</button>{error&&<span className="error">{error}</span>}</div>}
