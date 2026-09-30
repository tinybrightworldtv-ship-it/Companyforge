import { postJson } from "./http";
import type { LLMAdapter, LLMRequest, LLMResponse } from "./types";

/**
 * Meta Model API adapter.
 * Meta documents the hosted Meta Model API as OpenAI SDK compatible.
 * The endpoint and model are intentionally configuration-driven because
 * Meta may change the hosted API surface independently of CompanyForge.
 */
export class MetaModelAdapter implements LLMAdapter {
  provider = "meta" as const;
  model: string;
  private readonly apiUrl: string;
  constructor(
    private readonly apiKey = process.env.META_API_KEY,
    model = process.env.META_MODEL ?? "",
    apiUrl = process.env.META_API_URL ?? ""
  ) {
    this.model = model;
    this.apiUrl = apiUrl;
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    if (!this.apiKey) throw new Error("META_API_KEY is not configured.");
    if (!this.apiUrl) throw new Error("META_API_URL is not configured.");
    if (!this.model) throw new Error("META_MODEL is not configured.");

    const data = await postJson(
      this.apiUrl,
      { Authorization: "Bearer " + this.apiKey },
      {
        model: this.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        response_format:
          request.responseFormat === "json" ? { type: "json_object" } : undefined
      }
    );

    const choice = data.choices?.[0];
    return {
      provider: this.provider,
      model: this.model,
      text: choice?.message?.content ?? "",
      finishReason: choice?.finish_reason,
      requestId: data.id,
      usage: {
        inputTokens: data.usage?.prompt_tokens,
        outputTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens
      }
    };
  }
}
