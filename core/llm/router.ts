import { AnthropicAdapter } from "./anthropic.js";
import { GoogleAdapter } from "./google.js";
import { OpenAIAdapter } from "./openai.js";
import { LLMAdapter, LLMRequest, LLMResponse, LLMRouter, LLMProvider } from "./types.js";
import { LLMError } from "./errors.js";

export class MultiProviderRouter implements LLMRouter {
  private readonly adapters=new Map<LLMProvider,LLMAdapter>();
  private readonly order:LLMProvider[];
  constructor(options?:{adapters?:LLMAdapter[];order?:LLMProvider[]}) {
    (options?.adapters??[new OpenAIAdapter(),new AnthropicAdapter(),new GoogleAdapter()]).forEach(a=>this.adapters.set(a.provider,a));
    this.order=options?.order??["openai","anthropic","google"];
  }
  async generate(request:LLMRequest):Promise<LLMResponse>{
    const preferred=this.preference(request);
    const candidates=[preferred,...this.order.filter(p=>p!==preferred)];
    const errors:string[]=[];
    for(const provider of candidates){
      const adapter=this.adapters.get(provider); if(!adapter) continue;
      try{return await adapter.generate(request);}
      catch(e){errors.push(provider+": "+(e instanceof Error?e.message:String(e)));}
    }
    throw new LLMError("No configured LLM provider succeeded. "+errors.join(" | "));
  }
  private preference(request:LLMRequest):LLMProvider{
    switch(request.taskType){case "coding":return "anthropic";case "creative":return "google";default:return "openai";}
  }
}
