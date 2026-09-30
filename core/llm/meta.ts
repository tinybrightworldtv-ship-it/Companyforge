import { postJson } from "./http";
import type { LLMAdapter, LLMRequest, LLMResponse } from "./types";

export class MetaLlamaAdapter implements LLMAdapter {
  provider = "meta" as const;
  model: string;
  constructor(private readonly apiKey = process.env.META_API_KEY, model = process.env.META_MODEL ?? "llama-4-scout") {
    this.model = model;
  }
  async generate(request: LLMRequest): Promise<LLMResponse> {
    if (!this.apiKey) throw new Error("META_API_KEY is not configured.");
    const data = await postJson(
      process.env.META_API_URL ?? "https://api.llama.com/v1/chat/completions",
      { Authorization: "Bearer "+this.apiKey },
      { model:this.model, messages:request.messages, temperature:request.temperature, max_tokens:request.maxTokens, response_format:request.responseFormat==="json"?{type:"json_object"}:undefined }
    );
    const choice=data.choices?.[0];
    return {provider:this.provider,model:this.model,text:choice?.message?.content??"",finishReason:choice?.finish_reason,requestId:data.id,usage:{inputTokens:data.usage?.prompt_tokens,outputTokens:data.usage?.completion_tokens,totalTokens:data.usage?.total_tokens}};
  }
}
