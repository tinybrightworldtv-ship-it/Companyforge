import { LLMAdapter, LLMRequest, LLMResponse } from "./types";
import { postJson } from "./http";
export class GoogleAdapter implements LLMAdapter {
  provider="google" as const;
  constructor(public readonly model=process.env.GOOGLE_MODEL ?? "gemini-2.5-flash", private readonly apiKey=process.env.GOOGLE_API_KEY ?? "") {}
  async generate(request:LLMRequest):Promise<LLMResponse>{
    if(!this.apiKey) throw new Error("GOOGLE_API_KEY is not configured.");
    const system=request.messages.filter(m=>m.role==="system").map(m=>m.content).join("\n\n");
    const contents=request.messages.filter(m=>m.role!=="system").map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:m.content}]}));
    const data=await postJson("https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(this.model)+":generateContent?key="+encodeURIComponent(this.apiKey),{},{systemInstruction:system?{parts:[{text:system}]}:undefined,contents,generationConfig:{temperature:request.temperature,maxOutputTokens:request.maxTokens,responseMimeType:request.responseFormat==="json"?"application/json":undefined}});
    return {provider:this.provider,model:data.modelVersion??this.model,text:(data.candidates?.[0]?.content?.parts??[]).map((p:any)=>p.text??"").join(""),finishReason:data.candidates?.[0]?.finishReason,usage:data.usageMetadata?{inputTokens:data.usageMetadata.promptTokenCount,outputTokens:data.usageMetadata.candidatesTokenCount,totalTokens:data.usageMetadata.totalTokenCount}:undefined};
  }
}
