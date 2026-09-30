"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CompanyCreationInput } from "../../../lib/company-creation";

const steps=[
  {title:"What are you building?",key:"description",placeholder:"Tell me the problem, idea or opportunity in your own words.",hint:"You don't need a business plan. CompanyForge will help shape it."},
  {title:"Who is it for?",key:"targetCustomer",placeholder:"Who has this problem and would pay for a solution?",hint:"Be specific if you can. You can also say "I'm not sure"."},
  {title:"What would success look like?",key:"desiredOutcome",placeholder:"For example: build a profitable SaaS, reach $10k MRR, automate a service, or launch globally.",hint:"Your goal becomes the company's north star."},
  {title:"What should we call it?",key:"name",placeholder:"Give it a name, or use a working name.",hint:"You can change the brand later."},
  {title:"How much freedom should CompanyForge have?",key:"autonomyLevel",placeholder:"",hint:"You stay in control of consequential actions."},
] as const;

export default function NewCompanyPage(){
 const router=useRouter();
 const [step,setStep]=useState(0);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [form,setForm]=useState<CompanyCreationInput>({name:"",description:"",targetCustomer:"",desiredOutcome:"",revenueGoal:"",constraints:"",autonomyLevel:"supervised",siteType:"saas",include3D:true});
 const current=steps[step];
 const value=form[current.key];
 const set=(key:keyof CompanyCreationInput,value:CompanyCreationInput[keyof CompanyCreationInput])=>setForm(x=>({...x,[key]:value}));

 function next(){
   if(current.key!=="autonomyLevel" && !String(value).trim()){setError("Give me a little more so I can build the right company.");return;}
   setError(""); if(step<steps.length-1){setStep(step+1);return;} submit();
 }
 async function submit(){
   setBusy(true);setError("");
   const res=await fetch("/api/companies",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(form)});
   const data=await res.json();
   if(!res.ok){setError(data.error||"Could not create your company.");setBusy(false);return;}
   if(data.taskId) await fetch("/api/tasks/run",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({taskId:data.taskId})});
   router.push("/");
 }
 return <main className="forge-onboarding">
   <header className="forge-top"><div className="auth-brand"><div className="auth-mark">C</div><span>CompanyForge</span></div><div className="forge-step">{step+1} / {steps.length}</div></header>
   <div className="forge-progress"><span style={{width:`${((step+1)/steps.length)*100}%`}}/></div>
   <section className="forge-stage">
    <div className="forge-orb"><span>✦</span></div>
    <div className="forge-kicker">YOUR AI COMPANY BUILDER</div>
    <h1>{current.title}</h1>
    {current.key==="autonomyLevel" ? <div className="autonomy-grid">
      {[
       ["supervised","Supervised","CompanyForge works autonomously, but asks before consequential actions."],
       ["autonomous","Autonomous","CompanyForge can execute within your permissions and governance rules."],
       ["assisted","Assisted","CompanyForge prepares work and recommendations for you to execute."],
      ].map(([id,title,desc])=><button type="button" key={id} className={form.autonomyLevel===id?"choice active":"choice"} onClick={()=>set("autonomyLevel",id as CompanyCreationInput["autonomyLevel"])}><strong>{title}</strong><span>{desc}</span></button>)}
    </div> : <textarea autoFocus value={String(value)} onChange={e=>set(current.key,e.target.value)} placeholder={current.placeholder} className="forge-input"/>}
    <p className="forge-hint">{current.hint}</p>
    {step===steps.length-1 && <div className="forge-options"><label>Website direction<select value={form.siteType} onChange={e=>set("siteType",e.target.value as CompanyCreationInput["siteType"])}>{["saas","business","commerce","marketplace","content","portfolio","custom"].map(x=><option key={x}>{x}</option>)}</select></label><label>Use purposeful 3D<input type="checkbox" checked={form.include3D} onChange={e=>set("include3D",e.target.checked)}/></label></div>}
    {error&&<div className="error forge-error">{error}</div>}
    <div className="forge-actions"><button type="button" className="forge-back" disabled={step===0||busy} onClick={()=>{setError("");setStep(x=>x-1)}}>Back</button><button type="button" className="forge-next" disabled={busy} onClick={next}>{busy?"Starting CompanyForge…":step===steps.length-1?"Build my company →":"Continue →"}</button></div>
    <div className="forge-footer">You can change these decisions later. CompanyForge will research, challenge assumptions and build from the approved direction.</div>
   </section>
 </main>;
}