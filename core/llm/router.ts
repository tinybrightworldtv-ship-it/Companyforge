import { LLMError } from "./errors";
import type { LLMAdapter, LLMRequest, LLMResponse, LLMTaskType } from "./types";
export class MultiProviderRouter {
  private readonly adapters: LLMAdapter[];
  constructor(options:{adapters?:LLMAdapter[]}={}) {
    this.adapters=options.adapters??[
      this.envAdapter("openai"),this.envAdapter("anthropic"),this.envAdapter("google"),this.envAdapter("meta")
    ].filter(Boolean) as LLMAdapter[];
  }
  private envAdapter(provider:string):LLMAdapter|undefined {
    if(provider==="openai"&&process.env.OPENAI_API_KEY){const {OpenAIAdapter}=require("./openai");return new OpenAIAdapter();}
    if(provider==="anthropic"&&process.env.ANTHROPIC_API_KEY){const {AnthropicAdapter}=require("./anthropic");return new AnthropicAdapter();}
    if(provider==="google"&&process.env.GOOGLE_API_KEY){const {GoogleGeminiAdapter}=require("./google");return new GoogleGeminiAdapter();}
    if(provider==="meta"&&process.env.META_API_KEY){const {MetaLlamaAdapter}=require("./meta");return new MetaLlamaAdapter();}
    return undefined;
  }
  private order(task?:LLMTaskType):LLMAdapter[] {
    const weights:Record<string,string[]>={
      coding:["anthropic","openai","meta","google"],creative:["google","openai","meta","anthropic"],
      reasoning:["openai","anthropic","meta","google"],research:["openai","google","anthropic","meta"],
      analysis:["openai","google","anthropic","meta"],structured:["openai","anthropic","google","meta"]
    };
    const preferred=weights[task??"reasoning"]??weights.reasoning;
    return [...this.adapters].sort((a,b)=>preferred.indexOf(a.provider)-preferred.indexOf(b.provider));
  }
  async generate(request:LLMRequest):Promise<LLMResponse>{
    const errors:unknown[]=[];
    for(const adapter of this.order(request.taskType)){try{return await adapter.generate(request)}catch(error){if(error instanceof LLMError&&!error.retryable)throw error;errors.push(error)}}
    throw new Error("All configured LLM providers failed: "+errors.map(e=>e instanceof Error?e.message:String(e)).join(" | "));
  }
}
