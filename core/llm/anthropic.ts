import { LLMAdapter, LLMRequest, LLMResponse } from "./types.js";
import { postJson } from "./http.js";
export class AnthropicAdapter implements LLMAdapter {
  provider="anthropic" as const;
  constructor(public readonly model=process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5", private readonly apiKey=process.env.ANTHROPIC_API_KEY ?? "") {}
  async generate(request:LLMRequest):Promise<LLMResponse>{
    if(!this.apiKey) throw new Error("ANTHROPIC_API_KEY is not configured.");
    const system=request.messages.filter(m=>m.role==="system").map(m=>m.content).join("\n\n");
    const messages=request.messages.filter(m=>m.role!=="system");
    const data=await postJson("https://api.anthropic.com/v1/messages",{"x-api-key":this.apiKey,"anthropic-version":"2023-06-01"},{model:this.model,system:system||undefined,messages,max_tokens:request.maxTokens??4096,temperature:request.temperature});
    return {provider:this.provider,model:data.model??this.model,text:(data.content??[]).filter((x:any)=>x.type==="text").map((x:any)=>x.text).join(""),usage:data.usage?{inputTokens:data.usage.input_tokens,outputTokens:data.usage.output_tokens,totalTokens:(data.usage.input_tokens??0)+(data.usage.output_tokens??0)}:undefined,finishReason:data.stop_reason,requestId:data.id};
  }
}
