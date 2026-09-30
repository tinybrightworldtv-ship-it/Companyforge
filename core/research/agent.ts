import type {LLMRouter} from "../llm/types";
import type {MemoryStore} from "../memory/types";
import {createResearchReport,addFinding} from "./report";
import {searchPublicSources,sourcesToEvidence} from "./web-provider";
export class ResearchAgent{
 constructor(private readonly router:LLMRouter,private readonly memory?:MemoryStore){}
 async run(companyId:string,input:{query:string;market?:string;limit?:number},taskId?:string){
  const query=input.query.trim();if(!query)throw new Error("Research query is required.");
  const market=input.market??"global";const sources=await searchPublicSources(query+" "+market,input.limit??8);
  let report=createResearchReport({query,market});for(const f of sourcesToEvidence(sources))report=addFinding(report,f);
  if(!sources.length)report.gaps=["No public sources were returned. Configure another source provider."];
  const response=await this.router.generate({taskType:"research",responseFormat:"json",temperature:.1,messages:[
   {role:"system",content:"You are CompanyForge Research Agent. Use only supplied source evidence. Never invent facts, sources, numbers, customers, competitors or demand. Return JSON with summary, findings, gaps, opportunities, risks."},
   {role:"user",content:JSON.stringify({query,market,sources})}],metadata:{company_id:companyId,component:"research-agent",task_id:taskId}});
  let parsed:any;try{parsed=JSON.parse(response.text.replace(/^\u0060\u0060\u0060json\s*/i,"").replace(/\s*\u0060\u0060\u0060$/,""));}catch{parsed={summary:response.text,findings:report.findings,gaps:report.gaps,opportunities:[],risks:[]};}
  const finalReport={...report,summary:parsed.summary??"",findings:parsed.findings??report.findings,gaps:parsed.gaps??report.gaps,opportunities:parsed.opportunities??[],risks:parsed.risks??[],provider:response.provider,model:response.model};
  if(this.memory)await this.memory.upsert({company_id:companyId,memory_type:"document",memory_key:"research:"+query.toLowerCase().slice(0,180),content:JSON.stringify(finalReport),metadata:{source_count:sources.length,market,query},source_task_id:taskId??null,source_agent_id:"research",confidence:sources.length ? .7 : .2,importance:.8});
  return finalReport;
 }
}
