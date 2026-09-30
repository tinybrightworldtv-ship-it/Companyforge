import { LLMAdapter, LLMRequest, LLMResponse } from "./types";
import { postJson } from "./http";
export class OpenAIAdapter implements LLMAdapter {
  provider="openai" as const;
  constructor(public readonly model=process.env.OPENAI_MODEL ?? "gpt-5.6", private readonly apiKey=process.env.OPENAI_API_KEY ?? "") {}
  async generate(request:LLMRequest):Promise<LLMResponse>{
    if(!this.apiKey) throw new Error("OPENAI_API_KEY is not configured.");
    const data=await postJson("https://api.openai.com/v1/chat/completions",{authorization:"Bearer "+this.apiKey},{model:this.model,messages:request.messages,temperature:request.temperature,max_tokens:request.maxTokens,response_format:request.responseFormat==="json"?{type:"json_object"}:undefined});
    const choice=data.choices?.[0];
    return {provider:this.provider,model:data.model??this.model,text:choice?.message?.content??"",usage:data.usage,finishReason:choice?.finish_reason,requestId:data.id};
  }
}
