export type LLMProvider = "openai" | "anthropic" | "google" | "meta";
export type LLMTaskType = "reasoning" | "research" | "coding" | "analysis" | "creative" | "structured";
export interface LLMMessage { role: "system" | "user" | "assistant"; content: string; }
export interface LLMRequest { messages: LLMMessage[]; taskType?: LLMTaskType; temperature?: number; maxTokens?: number; responseFormat?: "text" | "json"; metadata?: Record<string, unknown>; }
export interface LLMResponse { provider: LLMProvider; model: string; text: string; usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number }; finishReason?: string; requestId?: string; }
export interface LLMAdapter { provider: LLMProvider; model: string; generate(request: LLMRequest): Promise<LLMResponse>; }
export interface LLMRouter { generate(request: LLMRequest): Promise<LLMResponse>; }
