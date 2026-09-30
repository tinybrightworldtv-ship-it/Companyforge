import { LLMError } from "./errors";
import type { LLMAdapter, LLMRequest, LLMResponse, LLMTaskType } from "./types";
import { OpenAIAdapter } from "./openai";
import { AnthropicAdapter } from "./anthropic";
import { GoogleAdapter } from "./google";
import { MetaModelAdapter } from "./meta";

export class MultiProviderRouter {
  private readonly adapters: LLMAdapter[];
  constructor(options:{adapters?:LLMAdapter[]}={}) {
    this.adapters=options.adapters??[
      process.env.OPENAI_API_KEY ? new OpenAIAdapter() : undefined,
      process.env.ANTHROPIC_API_KEY ? new AnthropicAdapter() : undefined,
      process.env.GOOGLE_API_KEY ? new GoogleAdapter() : undefined,
      process.env.META_API_KEY ? new MetaModelAdapter() : undefined
    ].filter(Boolean) as LLMAdapter[];
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
    for(const adapter of this.order(request.taskType)){
      try{return await adapter.generate(request)}
      catch(error){if(error instanceof LLMError&&!error.retryable)throw error;errors.push(error)}
    }
    throw new Error("All configured LLM providers failed: "+errors.map(e=>e instanceof Error?e.message:String(e)).join(" | "));
  }
}
